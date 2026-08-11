<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";

$database = new Database();
$conn = $database->connect();

try {

    $sql = "
        SELECT
            p.id,
            p.user_id,

            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.profile_picture,
            u.status,

            p.gender,
            p.date_of_birth,
            p.blood_type,
            p.address,
            p.emergency_contact_name,
            p.emergency_contact_phone,
            p.medical_notes,

            p.created_at,
            p.updated_at

        FROM patients p

        INNER JOIN users u
            ON p.user_id = u.id

        ORDER BY p.id DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "patients" => $patients
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}