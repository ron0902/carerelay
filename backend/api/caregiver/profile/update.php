<?php
require_once __DIR__ . "/../../../config/cors.php";
require_once __DIR__ . "/../../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $input = json_decode(file_get_contents("php://input"), true);
    $userId = $input["user_id"] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id is required."
        ]);
        exit;
    }

    $firstName = $input["first_name"] ?? "";
    $lastName = $input["last_name"] ?? "";
    $email = $input["email"] ?? "";
    $phone = $input["phone"] ?? "";
    $licenseNumber = $input["license_number"] ?? null;
    $specialization = $input["specialization"] ?? null;
    $experienceYears = $input["experience_years"] ?? null;
    $bio = $input["bio"] ?? null;

    $db->beginTransaction();

    $userStmt = $db->prepare("
        UPDATE users
        SET
            first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?
        WHERE id = ?
          AND role = 'Caregiver'
    ");
    $userStmt->execute([
        $firstName,
        $lastName,
        $email,
        $phone,
        $userId
    ]);

    $caregiverStmt = $db->prepare("
        UPDATE caregivers
        SET
            license_number = ?,
            specialization = ?,
            experience_years = ?,
            bio = ?
        WHERE user_id = ?
    ");
    $caregiverStmt->execute([
        $licenseNumber,
        $specialization,
        $experienceYears,
        $bio,
        $userId
    ]);

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "Caregiver profile updated successfully."
    ]);
} catch (PDOException $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}
?>
