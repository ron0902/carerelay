<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {

    $database = new Database();
    $db = $database->connect();

    $sql = "
        SELECT
            a.id,

            a.patient_id,
            a.caregiver_id,
            a.organization_id,

            a.appointment_date,
            a.appointment_time,
            a.duration,

            a.appointment_type,
            a.reason,
            a.location,
            a.status,
            a.notes,

            a.created_at,
            a.updated_at,

            -- Patient
            CONCAT(
                patient_user.first_name,
                ' ',
                patient_user.last_name
            ) AS patient_name,

            -- Caregiver
            CONCAT(
                caregiver_user.first_name,
                ' ',
                caregiver_user.last_name
            ) AS caregiver_name,

            -- Organization
            o.organization_name

        FROM appointments a

        INNER JOIN patients p
            ON a.patient_id = p.id

        INNER JOIN users patient_user
            ON p.user_id = patient_user.id

        INNER JOIN caregivers c
            ON a.caregiver_id = c.id

        INNER JOIN users caregiver_user
            ON c.user_id = caregiver_user.id

        LEFT JOIN organizations o
            ON a.organization_id = o.id

        ORDER BY a.id DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute();

    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "appointments" => $appointments
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