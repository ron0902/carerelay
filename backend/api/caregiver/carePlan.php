<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();
    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? null;
    $patientId = $input["patient_id"] ?? null;
    $visitDate = $input["visit_date"] ?? date("Y-m-d");

    if (!$userId || !$patientId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id and patient_id are required."
        ]);
        exit;
    }

    $stmt = $db->prepare(" 
        SELECT cp.id, cp.title, cp.diagnosis, cp.care_goal, cp.medications,
               cp.instructions, cp.start_date, cp.end_date, cp.status
        FROM care_plans cp
        INNER JOIN caregivers c ON cp.caregiver_id = c.id
        WHERE c.user_id = ?
          AND cp.patient_id = ?
          AND cp.status = 'Active'
          AND cp.start_date <= ?
          AND (cp.end_date IS NULL OR cp.end_date >= ?)
        ORDER BY cp.updated_at DESC, cp.id DESC
        LIMIT 1
    ");
    $stmt->execute([$userId, $patientId, $visitDate, $visitDate]);
    $plan = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "care_plan" => $plan ?: null,
        "message" => $plan ? "Care plan retrieved successfully." : "No active care plan found."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>
