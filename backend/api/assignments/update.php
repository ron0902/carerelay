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
            "message" => "Invalid JSON data."
        ]);
        exit;
    }

    // Assignment ID is required
    if (
        !isset($data["id"]) ||
        $data["id"] === ""
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Assignment ID is required."
        ]);
        exit;
    }

    // Required fields
    $requiredFields = [
        "patient_id",
        "caregiver_id",
        "assigned_date",
        "start_date",
        "shift"
    ];

    foreach ($requiredFields as $field) {

        if (
            !isset($data[$field]) ||
            $data[$field] === ""
        ) {
            echo json_encode([
                "success" => false,
                "message" => ucfirst(
                    str_replace("_", " ", $field)
                ) . " is required."
            ]);
            exit;
        }
    }

    /*
     * Check assignment exists
     */
    $assignmentCheck = $db->prepare("
        SELECT id
        FROM assignments
        WHERE id = ?
        LIMIT 1
    ");

    $assignmentCheck->execute([
        $data["id"]
    ]);

    if (!$assignmentCheck->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Assignment not found."
        ]);
        exit;
    }

    /*
     * Check patient
     */
    $patientCheck = $db->prepare("
        SELECT id
        FROM patients
        WHERE id = ?
        LIMIT 1
    ");

    $patientCheck->execute([
        $data["patient_id"]
    ]);

    if (!$patientCheck->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Patient not found."
        ]);
        exit;
    }

    /*
     * Check caregiver
     */
    $caregiverCheck = $db->prepare("
        SELECT id
        FROM caregivers
        WHERE id = ?
        LIMIT 1
    ");

    $caregiverCheck->execute([
        $data["caregiver_id"]
    ]);

    if (!$caregiverCheck->fetch()) {
        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);
        exit;
    }

    /*
     * Check organization
     */
    if (
        isset($data["organization_id"]) &&
        $data["organization_id"] !== "" &&
        $data["organization_id"] !== null
    ) {

        $organizationCheck = $db->prepare("
            SELECT id
            FROM organizations
            WHERE id = ?
            LIMIT 1
        ");

        $organizationCheck->execute([
            $data["organization_id"]
        ]);

        if (!$organizationCheck->fetch()) {
            echo json_encode([
                "success" => false,
                "message" => "Organization not found."
            ]);
            exit;
        }
    }

    /*
     * Update assignment
     */
    $sql = "
        UPDATE assignments
        SET
            patient_id = :patient_id,
            caregiver_id = :caregiver_id,
            organization_id = :organization_id,
            assigned_date = :assigned_date,
            start_date = :start_date,
            end_date = :end_date,
            shift = :shift,
            status = :status,
            remarks = :remarks
        WHERE id = :id
    ";

    $stmt = $db->prepare($sql);

    $stmt->execute([

        ":patient_id" =>
            $data["patient_id"],

        ":caregiver_id" =>
            $data["caregiver_id"],

        ":organization_id" =>
            !empty($data["organization_id"])
                ? $data["organization_id"]
                : null,

        ":assigned_date" =>
            $data["assigned_date"],

        ":start_date" =>
            $data["start_date"],

        ":end_date" =>
            !empty($data["end_date"])
                ? $data["end_date"]
                : null,

        ":shift" =>
            $data["shift"],

        ":status" =>
            !empty($data["status"])
                ? $data["status"]
                : "Active",

        ":remarks" =>
            !empty($data["remarks"])
                ? $data["remarks"]
                : null,

        ":id" =>
            $data["id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Assignment updated successfully."
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