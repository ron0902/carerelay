<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {

    $database = new Database();
    $db = $database->connect();

    // Get total patients
    $patientStmt = $db->query("
        SELECT COUNT(*) AS total
        FROM patients
    ");
    $patients = (int) $patientStmt->fetch(PDO::FETCH_ASSOC)["total"];

    // Get total caregivers
    $caregiverStmt = $db->query("
        SELECT COUNT(*) AS total
        FROM caregivers
    ");
    $caregivers = (int) $caregiverStmt->fetch(PDO::FETCH_ASSOC)["total"];

    // Get total organizations
    $organizationStmt = $db->query("
        SELECT COUNT(*) AS total
        FROM organizations
    ");
    $organizations = (int) $organizationStmt->fetch(PDO::FETCH_ASSOC)["total"];

    // Get total assignments
    $assignmentStmt = $db->query("
        SELECT COUNT(*) AS total
        FROM assignments
    ");
    $assignments = (int) $assignmentStmt->fetch(PDO::FETCH_ASSOC)["total"];

    echo json_encode([
        "success" => true,
        "stats" => [
            "patients" => $patients,
            "caregivers" => $caregivers,
            "organizations" => $organizations,
            "assignments" => $assignments
        ]
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage()
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}