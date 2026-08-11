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
            "message" => "Invalid JSON data.",
            "raw" => $raw
        ]);
        exit;
    }

    $sql = "INSERT INTO organizations (
                user_id,
                organization_name,
                contact_person,
                phone,
                email,
                address,
                city,
                province,
                postal_code,
                description,
                website,
                status
            ) VALUES (
                :user_id,
                :organization_name,
                :contact_person,
                :phone,
                :email,
                :address,
                :city,
                :province,
                :postal_code,
                :description,
                :website,
                :status
            )";

    $stmt = $db->prepare($sql);

    $stmt->execute([
        ":user_id" => $data["user_id"] ?? 1,
        ":organization_name" => $data["organization_name"] ?? "",
        ":contact_person" => $data["contact_person"] ?? "",
        ":phone" => $data["phone"] ?? "",
        ":email" => $data["email"] ?? "",
        ":address" => $data["address"] ?? "",
        ":city" => $data["city"] ?? "",
        ":province" => $data["province"] ?? "",
        ":postal_code" => $data["postal_code"] ?? "",
        ":description" => $data["description"] ?? "",
        ":website" => $data["website"] ?? "",
        ":status" => $data["status"] ?? "Active"
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Organization created successfully.",
        "organization" => [
            "id" => $db->lastInsertId()
        ]
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage(),
        "sql_state" => $e->getCode()
    ]);

    exit;

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}