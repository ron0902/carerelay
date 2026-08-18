<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (
        !$data ||
        empty($data["id"])
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver ID is required."
        ]);
        exit;
    }

    $stmt = $db->prepare("
        SELECT user_id
        FROM caregivers
        WHERE id = ?
        LIMIT 1
    ");
    $stmt->execute([
        $data["id"]
    ]);
    $caregiver = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$caregiver) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);
        exit;
    }

    $update = $db->prepare("
        UPDATE users
        SET status = 'Inactive'
        WHERE id = ?
        AND role = 'Caregiver'
    ");
    $update->execute([
        $caregiver["user_id"]
    ]);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Caregiver deactivated successfully."
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
