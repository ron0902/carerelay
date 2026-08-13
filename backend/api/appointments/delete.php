<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {

    $database = new Database();
    $db = $database->connect();

    $raw = file_get_contents("php://input");

    if (!$raw) {
        echo json_encode([
            "success" => false,
            "message" => "No request data received."
        ]);
        exit;
    }

    $data = json_decode($raw, true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data."
        ]);
        exit;
    }

    // Appointment ID is required
    if (
        !isset($data["id"]) ||
        $data["id"] === ""
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Appointment ID is required."
        ]);
        exit;
    }

    // Check if appointment exists
    $check = $db->prepare("
        SELECT id
        FROM appointments
        WHERE id = ?
        LIMIT 1
    ");

    $check->execute([
        $data["id"]
    ]);

    if (!$check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Appointment not found."
        ]);

        exit;
    }

    // Delete appointment
    $delete = $db->prepare("
        DELETE FROM appointments
        WHERE id = ?
    ");

    $delete->execute([
        $data["id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Appointment deleted successfully."
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