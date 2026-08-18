<?php
header("Content-Type: application/json");

require_once "../../config/cors.php";
require_once "../../config/database.php";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $data = $input ?? [];

    if (!isset($data["id"]) || empty($data["id"])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver ID is required."
        ]);
        exit;
    }

    $db->beginTransaction();

    /*
     * Find linked user account
     */
    $find = $db->prepare("
        SELECT user_id
        FROM caregivers
        WHERE id = ?
        LIMIT 1
    ");
    $find->execute([
        $data["id"]
    ]);
    $caregiver = $find->fetch(
        PDO::FETCH_ASSOC
    );

    if (!$caregiver) {
        $db->rollBack();
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);
        exit;
    }

    $userId = $caregiver["user_id"];

    /*
     * Delete caregiver record
     */
    $deleteCaregiver = $db->prepare("
        DELETE FROM caregivers
        WHERE id = ?
    ");
    $deleteCaregiver->execute([
        $data["id"]
    ]);

    /*
     * Delete linked user account
     */
    $deleteUser = $db->prepare("
        DELETE FROM users
        WHERE id = ?
        AND role = 'Caregiver'
    ");
    $deleteUser->execute([
        $userId
    ]);

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" =>
            "Caregiver deleted successfully."
    ]);

} catch (PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}
?>
