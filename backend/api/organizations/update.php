<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

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
        "message" => "Organization ID is required."
    ]);
    exit();
}

try {

    $conn->beginTransaction();

    /*
     * Find organization
     */
    $find = $conn->prepare("
        SELECT user_id
        FROM organizations
        WHERE id = ?
        LIMIT 1
    ");

    $find->execute([
        $data["id"]
    ]);

    $organization = $find->fetch(PDO::FETCH_ASSOC);

    if (!$organization) {

        $conn->rollBack();

        echo json_encode([
            "success" => false,
            "message" => "Organization not found."
        ]);

        exit();
    }

    $userId = $organization["user_id"];

    /*
     * Update users table
     */

    $nameParts = preg_split(
        '/\s+/',
        trim($data["contact_person"] ?? "")
    );

    $firstName = $nameParts[0] ?? "";

    array_shift($nameParts);

    $lastName = implode(" ", $nameParts);

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
        $firstName,
        $lastName,
        $data["email"] ?? "",
        $data["phone"] ?? "",
        $data["status"] ?? "Active",
        $userId
    ]);

    /*
     * Update organizations table
     */

    $organizationUpdate = $conn->prepare("
        UPDATE organizations
        SET
            organization_name = ?,
            contact_person = ?,
            phone = ?,
            email = ?,
            address = ?,
            city = ?,
            province = ?,
            postal_code = ?,
            description = ?,
            website = ?,
            status = ?
        WHERE id = ?
    ");

    $organizationUpdate->execute([
        $data["organization_name"] ?? "",
        $data["contact_person"] ?? "",
        $data["phone"] ?? "",
        $data["email"] ?? "",
        $data["address"] ?? "",
        $data["city"] ?? "",
        $data["province"] ?? "",
        $data["postal_code"] ?? "",
        $data["description"] ?? "",
        $data["website"] ?? "",
        $data["status"] ?? "Active",
        $data["id"]
    ]);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Organization updated successfully."
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