<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: PUT, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";

$database = new Database();
$conn = $database->connect();

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received."
    ]);
    exit();
}

if (empty($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Caregiver ID is required."
    ]);
    exit();
}

try {

    $conn->beginTransaction();

    // Get user_id connected to caregiver
    $find = $conn->prepare("
        SELECT user_id
        FROM caregivers
        WHERE id = ?
        LIMIT 1
    ");

    $find->execute([
        $data["id"]
    ]);

    $caregiver = $find->fetch(PDO::FETCH_ASSOC);

    if (!$caregiver) {
        $conn->rollBack();

        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);

        exit();
    }

    $userId = $caregiver["user_id"];

    // Update users table
    $user = $conn->prepare("
        UPDATE users
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?,
            status = ?
        WHERE id = ?
    ");

    $user->execute([
        $data["first_name"] ?? "",
        $data["last_name"] ?? "",
        $data["email"] ?? "",
        $data["phone"] ?? "",
        $data["status"] ?? "Active",
        $userId
    ]);

    // Update caregivers table
    $caregiverUpdate = $conn->prepare("
        UPDATE caregivers
        SET
            license_number = ?,
            specialization = ?,
            experience_years = ?,
            availability = ?,
            hourly_rate = ?,
            bio = ?
        WHERE id = ?
    ");

    $caregiverUpdate->execute([
        $data["license_number"] ?? "",
        $data["specialization"] ?? "",
        $data["experience_years"] ?? 0,
        $data["availability"] ?? "Available",
        $data["hourly_rate"] ?? 0,
        $data["bio"] ?? "",
        $data["id"]
    ]);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Caregiver updated successfully."
    ]);

} catch (Exception $e) {

    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}