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

    // Appointment ID
    if (
        !isset($data["id"]) ||
        $data["id"] === ""
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Appointment ID is required."
        ]);
        exit;
    }

    // Required fields
    $requiredFields = [
        "patient_id",
        "caregiver_id",
        "appointment_date",
        "appointment_time",
        "duration",
        "appointment_type",
        "status"
    ];

    foreach ($requiredFields as $field) {

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

    // Check appointment
    $appointmentCheck = $db->prepare("
        SELECT id
        FROM appointments
        WHERE id = ?
        LIMIT 1
    ");

    $appointmentCheck->execute([
        $data["id"]
    ]);

    if (!$appointmentCheck->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Appointment not found."
        ]);

        exit;
    }

    // Check patient
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

    // Check caregiver
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

    // Check organization if provided
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

    // Update
    $sql = "
        UPDATE appointments
        SET
            patient_id = :patient_id,
            caregiver_id = :caregiver_id,
            organization_id = :organization_id,
            appointment_date = :appointment_date,
            appointment_time = :appointment_time,
            duration = :duration,
            appointment_type = :appointment_type,
            reason = :reason,
            location = :location,
            status = :status,
            notes = :notes
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

        ":appointment_date" =>
            $data["appointment_date"],

        ":appointment_time" =>
            $data["appointment_time"],

        ":duration" =>
            $data["duration"],

        ":appointment_type" =>
            $data["appointment_type"],

        ":reason" =>
            $data["reason"] ?? "",

        ":location" =>
            $data["location"] ?? "",

        ":status" =>
            $data["status"],

        ":notes" =>
            $data["notes"] ?? "",

        ":id" =>
            $data["id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Appointment updated successfully."
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