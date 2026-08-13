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

    // =====================================
    // REQUIRED FIELDS
    // =====================================

    $required = [
        "patient_id",
        "caregiver_id",
        "organization_id",
        "appointment_date",
        "appointment_time",
        "duration",
        "appointment_type",
        "status"
    ];

    foreach ($required as $field) {

        if (
            !isset($data[$field]) ||
            $data[$field] === ""
        ) {

            echo json_encode([
                "success" => false,
                "message" =>
                    ucfirst(
                        str_replace("_", " ", $field)
                    ) . " is required."
            ]);

            exit;
        }
    }

    // =====================================
    // CHECK PATIENT
    // =====================================

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

    // =====================================
    // CHECK CAREGIVER
    // =====================================

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

    // =====================================
    // CHECK ORGANIZATION
    // =====================================

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

    // =====================================
    // INSERT APPOINTMENT
    // =====================================

    $sql = "
        INSERT INTO appointments (
            patient_id,
            caregiver_id,
            organization_id,
            appointment_date,
            appointment_time,
            duration,
            appointment_type,
            reason,
            location,
            status,
            notes
        )
        VALUES (
            :patient_id,
            :caregiver_id,
            :organization_id,
            :appointment_date,
            :appointment_time,
            :duration,
            :appointment_type,
            :reason,
            :location,
            :status,
            :notes
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

        ":appointment_date" =>
            $data["appointment_date"],

        ":appointment_time" =>
            $data["appointment_time"],

        ":duration" =>
            $data["duration"],

        ":appointment_type" =>
            $data["appointment_type"],

        ":reason" =>
            $data["reason"] ?? null,

        ":location" =>
            $data["location"] ?? null,

        ":status" =>
            $data["status"],

        ":notes" =>
            $data["notes"] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "message" =>
            "Appointment created successfully.",

        "appointment" => [
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