<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";
require_once "../organizations/_helpers.php";

$database = new Database();
$conn = $database->connect();

try {

    $requestUserId = (int) ($_GET["user_id"] ?? 0);
    $requestedOrganizationId = isset($_GET["organization_id"])
        ? (int) $_GET["organization_id"]
        : null;
    $organization = $requestUserId
        ? findOrganizationForUser($conn, $requestUserId, $requestedOrganizationId)
        : null;

    if ($requestUserId && !$organization) {
        jsonError("You do not have access to this organization.", 403);
    }

    $sql = "
        SELECT
            c.id,
            c.user_id,
            c.organization_id,

            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.profile_picture,
            u.status,

            c.license_number,
            c.specialization,
            c.experience_years,
            c.availability,
            c.hourly_rate,
            c.bio,

            c.created_at,
            c.updated_at

        FROM caregivers c

        INNER JOIN users u
            ON c.user_id = u.id

        WHERE u.role = 'Caregiver'

        " . ($organization ? "AND c.organization_id = :organization_id" : "") . "

        ORDER BY c.id DESC
    ";

    $stmt = $conn->prepare($sql);
    if ($organization) {
        $stmt->bindValue(":organization_id", $organization["id"], PDO::PARAM_INT);
    }
    $stmt->execute();

    $caregivers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "caregivers" => $caregivers
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}