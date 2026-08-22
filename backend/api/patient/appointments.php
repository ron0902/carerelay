<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();
    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "user_id is required."]);
        exit;
    }

    $patientStmt = $db->prepare(
        "SELECT id FROM patients WHERE user_id = ? LIMIT 1"
    );
    $patientStmt->execute([$userId]);
    $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);

    if (!$patient) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Patient not found."]);
        exit;
    }

    $stmt = $db->prepare(" 
        SELECT
            a.id,
            a.appointment_date,
            a.appointment_time,
            a.duration,
            a.appointment_type,
            a.reason,
            a.location,
            a.status,
            a.notes,
            CONCAT(caregiver_user.first_name, ' ', caregiver_user.last_name) AS caregiver_name,
            o.organization_name
        FROM appointments a
        INNER JOIN caregivers c ON a.caregiver_id = c.id
        INNER JOIN users caregiver_user ON c.user_id = caregiver_user.id
        LEFT JOIN organizations o ON a.organization_id = o.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC, a.id DESC
    ");
    $stmt->execute([$patient["id"]]);

    echo json_encode([
        "success" => true,
        "appointments" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>
