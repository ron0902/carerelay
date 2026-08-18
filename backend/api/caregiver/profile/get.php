<?php
require_once __DIR__ . "/../../../config/cors.php";
require_once __DIR__ . "/../../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

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

    $sql = "
        SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.status,
            c.id AS caregiver_id,
            c.license_number,
            c.specialization,
            c.experience_years,
            c.availability,
            c.hourly_rate,
            c.bio
        FROM users u
        INNER JOIN caregivers c
            ON c.user_id = u.id
        WHERE u.id = ?
          AND u.role = 'Caregiver'
        LIMIT 1
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$userId]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profile) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver profile not found."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "profile" => $profile
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
