<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

require_once "../../config/database.php";
require_once "../organizations/_helpers.php";

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

$organizationId = isset($data["organization_id"])
    ? (int) $data["organization_id"]
    : null;
if (!$organizationId && !empty($data["created_by"])) {
    $organization = findOrganizationForUser($conn, (int) $data["created_by"]);
    $organizationId = $organization ? (int) $organization["id"] : null;
}
if ($organizationId) {
    $organization = findOrganizationForUser(
        $conn,
        (int) ($data["created_by"] ?? 0),
        $organizationId
    );
    if (!$organization) {
        jsonError("You do not have access to this organization.", 403);
    }
}

try {

    /*
     * Validate required fields
     */
    if (
        empty($data["first_name"]) ||
        empty($data["email"]) ||
        empty($data["phone"])
    ) {
        echo json_encode([
            "success" => false,
            "message" =>
                "First name, email and phone are required."
        ]);
        exit();
    }

    $conn->beginTransaction();

    /*
     * Check if email already exists
     */
    $check = $conn->prepare(
        "SELECT id FROM users WHERE email = ? LIMIT 1"
    );

    $check->execute([
        $data["email"]
    ]);

    if ($check->fetch()) {

        $conn->rollBack();

        echo json_encode([
            "success" => false,
            "message" => "Email already exists."
        ]);

        exit();
    }

    /*
     * Temporary password
     */
    $temporaryPassword = "changeme123";

    $password = password_hash(
        $temporaryPassword,
        PASSWORD_DEFAULT
    );

    /*
     * Insert caregiver account into users
     */
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
            ?, ?, ?, ?, 'Caregiver', ?, ?
        )
    ");

    $user->execute([
        $data["first_name"],
        $data["last_name"] ?? "",
        $data["email"],
        $password,
        $data["phone"],
        $data["status"] ?? "Active"
    ]);

    $userId = $conn->lastInsertId();

    /*
     * Insert professional caregiver information
     */
    $caregiver = $conn->prepare("
        INSERT INTO caregivers
        (
            user_id,
            organization_id,
            license_number,
            specialization,
            experience_years,
            availability,
            hourly_rate,
            bio
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $caregiver->execute([
        $userId,
        $organizationId,
        $data["license_number"] ?? "",
        $data["specialization"] ?? "",
        $data["experience_years"] ?? 0,
        $data["availability"] ?? "Available",
        $data["hourly_rate"] ?? 0,
        $data["bio"] ?? ""
    ]);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Caregiver created successfully.",
        "temporary_password" => $temporaryPassword
    ]);

} catch (Exception $e) {

    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}