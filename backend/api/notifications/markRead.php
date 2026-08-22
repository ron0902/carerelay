<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();
    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? null;
    $notificationId = $input["notification_id"] ?? null;

    if (!$userId || !$notificationId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id and notification_id are required."
        ]);
        exit;
    }

    $stmt = $db->prepare(
        "UPDATE notifications
         SET is_read = 1
         WHERE id = ? AND user_id = ?"
    );
    $stmt->execute([$notificationId, $userId]);

    echo json_encode([
        "success" => true,
        "message" => "Notification marked as read."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>
