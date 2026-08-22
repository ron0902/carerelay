<?php
require_once __DIR__ . "/../../../config/cors.php";
require_once __DIR__ . "/../../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $input = json_decode(file_get_contents("php://input"), true);
    $userId = $input["user_id"] ?? null;
    $currentPassword = $input["current_password"] ?? "";
    $newPassword = $input["new_password"] ?? "";

    if (!$userId || !$currentPassword || !$newPassword) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id, current_password and new_password are required."
        ]);
        exit;
    }

    if (strlen($newPassword) < 8) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "New password must be at least 8 characters long."
        ]);
        exit;
    }

    $userStmt = $db->prepare(
        "SELECT password FROM users WHERE id = ? AND role = 'Caregiver' LIMIT 1"
    );
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver user not found."
        ]);
        exit;
    }

    if (!password_verify($currentPassword, $user["password"])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Current password is incorrect."
        ]);
        exit;
    }

    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateStmt = $db->prepare(
        "UPDATE users SET password = ? WHERE id = ? AND role = 'Caregiver'"
    );
    $updateStmt->execute([$newPasswordHash, $userId]);

    echo json_encode([
        "success" => true,
        "message" => "Password changed successfully."
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
?>
