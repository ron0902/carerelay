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

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "No data received."
    ]);
    exit;
}

try {

    $conn->beginTransaction();

    // Check email
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$data["email"]]);

    if ($check->rowCount() > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Email already exists."
        ]);
        exit;
    }

    $password = password_hash($data["password"], PASSWORD_DEFAULT);

    // Insert into users
    $user = $conn->prepare("
        INSERT INTO users
        (
            first_name,
            last_name,
            email,
            password,
            role,
            phone,
            status
        )
        VALUES
        (
            ?, ?, ?, ?, 'Patient', ?, 'Active'
        )
    ");

    $user->execute([
        $data["first_name"],
        $data["last_name"],
        $data["email"],
        $password,
        $data["phone"]
    ]);

    $userId = $conn->lastInsertId();

    // Insert into patients
    $patient = $conn->prepare("
        INSERT INTO patients
        (
            user_id,
            date_of_birth,
            gender,
            blood_type,
            address,
            emergency_contact_name,
            emergency_contact_phone,
            medical_notes
        )
        VALUES
        (
            ?,?,?,?,?,?,?,?
        )
    ");

    $patient->execute([
        $userId,
        $data["date_of_birth"],
        $data["gender"],
        $data["blood_type"],
        $data["address"],
        $data["emergency_contact_name"],
        $data["emergency_contact_phone"],
        $data["medical_notes"]
    ]);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Patient created successfully."
    ]);

} catch (Exception $e) {

    $conn->rollBack();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}