<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../organizations/_helpers.php";

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

    $organization = findOrganizationForUser(
        $db,
        (int) ($data["assigned_by"] ?? 0),
        (int) ($data["organization_id"] ?? 0)
    );
    if (!$organization) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "The assigning user does not have access to this organization."
        ]);
        exit;
    }

    /*
     * Required fields
     */
    $required = [
        "patient_id",
        "caregiver_id",
        "organization_id",
        "assigned_by",
        "start_date",
        "end_date",
        "shift",
        "status"
    ];

    foreach ($required as $field) {

        if (
            !isset($data[$field]) ||
            $data[$field] === ""
        ) {

            echo json_encode([
                "success" => false,
                "message" => ucfirst(str_replace("_", " ", $field))
                    . " is required."
            ]);

            exit;
        }
    }

    /*
     * Verify patient
     */
    $checkPatient = $db->prepare("
        SELECT id
        FROM patients
        WHERE id = ?
        LIMIT 1
    ");

    $checkPatient->execute([
        $data["patient_id"]
    ]);

    if (!$checkPatient->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Patient not found."
        ]);

        exit;
    }

    /*
     * Verify caregiver
     */
    $checkCaregiver = $db->prepare("
        SELECT id
        FROM caregivers
        WHERE id = ?
        LIMIT 1
    ");

    $checkCaregiver->execute([
        $data["caregiver_id"]
    ]);

    if (!$checkCaregiver->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);

        exit;
    }

    /*
     * Verify organization
     */
    $checkOrganization = $db->prepare("
        SELECT id
        FROM organizations
        WHERE id = ?
        LIMIT 1
    ");

    $checkOrganization->execute([
        $data["organization_id"]
    ]);

    if (!$checkOrganization->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Organization not found."
        ]);

        exit;
    }

    /*
     * Verify assigning user
     */
    $checkUser = $db->prepare("
        SELECT id
        FROM users
        WHERE id = ?
        LIMIT 1
    ");

    $checkUser->execute([
        $data["assigned_by"]
    ]);

    if (!$checkUser->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Assigned-by user not found."
        ]);

        exit;
    }

    /*
     * Insert assignment
     */
    $sql = "
        INSERT INTO assignments (
            patient_id,
            caregiver_id,
            organization_id,
            assigned_by,
            assigned_date,
            start_date,
            end_date,
            shift,
            status,
            remarks
        )
        VALUES (
            :patient_id,
            :caregiver_id,
            :organization_id,
            :assigned_by,
            :assigned_date,
            :start_date,
            :end_date,
            :shift,
            :status,
            :remarks
        )
    ";

    $stmt = $db->prepare($sql);

    $stmt->execute([

        ":patient_id" =>
            $data["patient_id"],

        ":caregiver_id" =>
            $data["caregiver_id"],

        ":organization_id" =>
            $data["organization_id"],

        ":assigned_by" =>
            $data["assigned_by"],

        ":assigned_date" =>
            $data["assigned_date"]
            ?? date("Y-m-d"),

        ":start_date" =>
            $data["start_date"],

        ":end_date" =>
            $data["end_date"],

        ":shift" =>
            $data["shift"],

        ":status" =>
            $data["status"],

        ":remarks" =>
            $data["remarks"] ?? ""
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Care assignment created successfully.",
        "assignment" => [
            "id" => $db->lastInsertId()
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