<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";

$database = new Database();
$conn = $database->connect();

$data = json_decode(file_get_contents("php://input"));

if (
    !$data ||
    empty($data->email) ||
    empty($data->password)
) {
    echo json_encode([
        "success" => false,
        "message" => "Email and Password are required."
    ]);
    exit;
}

$email = trim($data->email);
$password = $data->password;

try {

    $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":email", $email);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "message" => "User not found."
        ]);
        exit;
    }

    if (!password_verify($password, $user["password"])) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid password."
        ]);
        exit;
    }

    if (isset($user["status"]) && $user["status"] !== "Active") {
        echo json_encode([
            "success" => false,
            "message" => "Your account is inactive."
        ]);
        exit;
    }

    unset($user["password"]);

    echo json_encode([
        "success" => true,
        "message" => "Login Successful",
        "user" => $user
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);
}