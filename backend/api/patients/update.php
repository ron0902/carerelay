<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";

$database = new Database();
$conn = $database->connect();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received."
    ]);
    exit();
}

if (empty($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Patient ID is required."
    ]);
    exit();
}

$actorUserId = isset($data["actor_user_id"]) ? (int) $data["actor_user_id"] : null;
$actorRole = null;
if ($actorUserId) {
    $actorStmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $actorStmt->execute([$actorUserId]);
    $actorRole = $actorStmt->fetchColumn();
}

try {

    $conn->beginTransaction();

    /*
     * Get the user's ID connected to this patient
     */
    $findPatient = $conn->prepare("
        SELECT user_id, organization_id
        FROM patients
        WHERE id = ?
        LIMIT 1
    ");

    $findPatient->execute([
        $data["id"]
    ]);

    $patient = $findPatient->fetch(PDO::FETCH_ASSOC);

    if (!$patient) {
        $conn->rollBack();

        echo json_encode([
            "success" => false,
            "message" => "Patient not found."
        ]);

        exit();
    }

    $userId = $patient["user_id"];
    $patientOrganizationId = isset($patient["organization_id"]) ? (int) $patient["organization_id"] : 0;

    $canEditVisibility = in_array($actorRole, ["Admin", "System Admin", "Organization"], true);

    if (!$canEditVisibility && $actorUserId > 0 && $patientOrganizationId > 0) {
        $memberStmt = $conn->prepare("
            SELECT member_role
            FROM organization_members
            WHERE user_id = ?
              AND organization_id = ?
              AND status = 'Active'
            LIMIT 1
        ");
        $memberStmt->execute([$actorUserId, $patientOrganizationId]);

        $memberRole = $memberStmt->fetchColumn();
        $canEditVisibility = in_array($memberRole, ["Owner", "Admin"], true);
    }

    if (!$canEditVisibility && !empty($data["medical_notes_public"])) {
        echo json_encode([
            "success" => false,
            "message" => "Only admin or organization owner can change note visibility."
        ]);
        exit();
    }

    /*
     * Update users table
     */
    $user = $conn->prepare("
        UPDATE users
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?,
            status = ?
        WHERE id = ?
    ");

    $user->execute([
        $data["first_name"],
        $data["last_name"],
        $data["email"],
        $data["phone"],
        $data["status"],
        $userId
    ]);

    /*
     * Update patients table
     */
    $patientUpdate = $conn->prepare("
        UPDATE patients
        SET
            date_of_birth = ?,
            gender = ?,
            blood_type = ?,
            address = ?,
            emergency_contact_name = ?,
            emergency_contact_phone = ?,
            medical_notes = ?,
            medical_notes_public = ?
        WHERE id = ?
    ");

    $patientUpdate->execute([
        $data["date_of_birth"],
        $data["gender"],
        $data["blood_type"],
        $data["address"],
        $data["emergency_contact_name"],
        $data["emergency_contact_phone"],
        $data["medical_notes"],
        !empty($data["medical_notes_public"]) ? 1 : 0,
        $data["id"]
    ]);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Patient updated successfully."
    ]);

} catch (Exception $e) {

    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}