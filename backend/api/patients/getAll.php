<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";
require_once "../organizations/_helpers.php";

$database = new Database();
$conn = $database->connect();

try {

    $requestUserId = (int) ($_GET["user_id"] ?? 0);
    $requestedOrganizationId = isset($_GET["organization_id"])
        ? (int) $_GET["organization_id"]
        : null;

    $userRole = null;
    if ($requestUserId > 0) {
        $userStmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
        $userStmt->execute([$requestUserId]);
        $userRole = $userStmt->fetchColumn();
    }

    $organization = $requestUserId
        ? findOrganizationForUser($conn, $requestUserId, $requestedOrganizationId)
        : null;

    if ($requestUserId && !$organization && $userRole !== "Caregiver" && $userRole !== "Patient") {
        jsonError("You do not have access to this organization.", 403);
    }

    $canViewPrivateNotes = in_array($userRole, ["Admin", "Organization"], true);

    $sql = "
        SELECT
            p.id,
            p.user_id,
            p.organization_id,

            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.profile_picture,
            u.status,

            p.gender,
            p.date_of_birth,
            p.blood_type,
            p.address,
            p.emergency_contact_name,
            p.emergency_contact_phone,
            CASE
                WHEN p.medical_notes_public = 1 OR :canViewPrivateNotes = 1 THEN p.medical_notes
                ELSE NULL
            END AS medical_notes,
            p.medical_notes_public,

            p.created_at,
            p.updated_at

        FROM patients p

        INNER JOIN users u
            ON p.user_id = u.id

        LEFT JOIN assignments a
            ON a.patient_id = p.id
            AND a.status IN ('Active', 'Assigned')

        WHERE 1 = 1
        " . ($requestUserId && $userRole === "Caregiver" ? "AND a.caregiver_id IN (SELECT id FROM caregivers WHERE user_id = :request_user_id)" : "") . "
        " . ($requestUserId && $userRole === "Patient" ? "AND p.user_id = :request_user_id" : "") . "
        " . ($requestUserId && $organization && $userRole !== "Caregiver" && $userRole !== "Patient" ? "AND p.organization_id = :organization_id" : "") . "
        " . (!$requestUserId ? "" : "") . "

        GROUP BY p.id
        ORDER BY p.id DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(":canViewPrivateNotes", $canViewPrivateNotes ? 1 : 0, PDO::PARAM_INT);
    if ($requestUserId && $userRole === "Caregiver") {
        $stmt->bindValue(":request_user_id", $requestUserId, PDO::PARAM_INT);
    }
    if ($requestUserId && $userRole === "Patient") {
        $stmt->bindValue(":request_user_id", $requestUserId, PDO::PARAM_INT);
    }
    if ($requestUserId && $organization && $userRole !== "Caregiver" && $userRole !== "Patient") {
        $stmt->bindValue(":organization_id", $organization["id"], PDO::PARAM_INT);
    }
    $stmt->execute();

    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "patients" => $patients
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}