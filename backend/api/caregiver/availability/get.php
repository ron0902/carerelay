<?php
require_once __DIR__ . "/../../../config/cors.php";
require_once __DIR__ . "/../../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $db->exec("
        CREATE TABLE IF NOT EXISTS caregiver_availability (
            id INT AUTO_INCREMENT PRIMARY KEY,
            caregiver_id INT NOT NULL,
            day_of_week VARCHAR(20) NOT NULL,
            enabled TINYINT(1) NOT NULL DEFAULT 0,
            start_time TIME NULL,
            end_time TIME NULL,
            UNIQUE KEY unique_caregiver_day (caregiver_id, day_of_week),
            KEY idx_caregiver_id (caregiver_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");

    $input = json_decode(file_get_contents("php://input"), true);
    $userId = $input["user_id"] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id is required."
        ]);
        exit;
    }

    $caregiverStmt = $db->prepare("
        SELECT id, availability
        FROM caregivers
        WHERE user_id = ?
        LIMIT 1
    ");
    $caregiverStmt->execute([$userId]);
    $caregiver = $caregiverStmt->fetch(PDO::FETCH_ASSOC);

    if (!$caregiver) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);
        exit;
    }

    $stmt = $db->prepare("
        SELECT
            day_of_week,
            enabled,
            start_time,
            end_time
        FROM caregiver_availability
        WHERE caregiver_id = ?
        ORDER BY FIELD(
            day_of_week,
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        )
    ");
    $stmt->execute([(int) $caregiver["id"]]);
    $availability = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "availability" => $availability,
        "status" => $caregiver["availability"] ?? null
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}
