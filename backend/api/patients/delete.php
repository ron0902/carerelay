<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
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
    exit();
}

if (empty($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Patient ID is required."
    ]);
    exit();
}

try {

    $conn->beginTransaction();

    /*
     * Get user_id connected to patient
     */
    $findPatient = $conn->prepare("
        SELECT user_id
        FROM patients
        WHERE id = ?
        LIMIT 1
    ");

    $findPatient->execute([
        $data["id"]
    ]);

    $patient = $findPatient->fetch(PDO::FETCH_ASSOC);

    if (!$patient) {

        $conn->rollBack();

        echo json_encode([
            "success" => false,
            "message" => "Patient not found."
        ]);

        exit();
    }

    $userId = $patient["user_id"];

    /*
     * Delete patient record
     */
    $deletePatient = $conn->prepare("
        DELETE FROM patients
        WHERE id = ?
    ");

    $deletePatient->execute([
        $data["id"]
    ]);

    /*
     * Delete connected user record
     */
    $deleteUser = $conn->prepare("
        DELETE FROM users
        WHERE id = ?
    ");

    $deleteUser->execute([
        $userId
    ]);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Patient deleted successfully."
    ]);

} catch (Exception $e) {

    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}