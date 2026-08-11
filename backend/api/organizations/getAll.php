<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

$database = new Database();
$conn = $database->connect();

try {

    $sql = "
        SELECT
            o.id,
            o.user_id,

            o.organization_name,
            o.contact_person,
            o.phone,
            o.email,
            o.address,
            o.city,
            o.province,
            o.postal_code,
            o.description,
            o.website,
            o.status,

            o.created_at,
            o.updated_at

        FROM organizations o

        INNER JOIN users u
            ON o.user_id = u.id

        WHERE u.role = 'Organization'

        ORDER BY o.id DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $organizations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "organizations" => $organizations
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}