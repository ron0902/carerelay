<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

$database = new Database();
$conn = $database->connect();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data["id"])) {
    echo json_encode([
        "success" => false,
        "message" => "Organization ID is required."
    ]);
    exit();
}

try {

    $deleteOrganization = $conn->prepare("
        DELETE FROM organizations
        WHERE id = ?
    ");

    $deleteOrganization->execute([
        $data["id"]
    ]);

    if ($deleteOrganization->rowCount() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Organization not found."
        ]);
        exit();
    }

    echo json_encode([
        "success" => true,
        "message" => "Organization deleted successfully."
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete organization.",
        "error" => $e->getMessage()
    ]);
}