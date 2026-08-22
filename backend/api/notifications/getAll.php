<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();
    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? $_GET["user_id"] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "user_id is required."]);
        exit;
    }

    $stmt = $db->prepare(
        "SELECT id, title, message, type, is_read, reference_id, created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC, id DESC"
    );
    $stmt->execute([$userId]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "notifications" => $notifications,
        "unread_count" => count(array_filter($notifications, fn ($item) => (int) $item["is_read"] === 0))
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>
