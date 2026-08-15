<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {

    $database = new Database();
    $db = $database->connect();

    // Get recent assignments
    $assignmentStmt = $db->prepare("
        SELECT 
            'assignment' AS type,
            a.id,
            a.created_at AS timestamp,
            p.user_id AS patient_id,
            u_patient.first_name AS patient_first_name,
            u_patient.last_name AS patient_last_name,
            c.user_id AS caregiver_id,
            u_caregiver.first_name AS caregiver_first_name,
            u_caregiver.last_name AS caregiver_last_name,
            a.status
        FROM assignments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u_patient ON p.user_id = u_patient.id
        JOIN caregivers c ON a.caregiver_id = c.id
        JOIN users u_caregiver ON c.user_id = u_caregiver.id
        ORDER BY a.created_at DESC
        LIMIT 10
    ");
    $assignmentStmt->execute();
    $assignments = $assignmentStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get recent caregiver registrations
    $caregiverStmt = $db->prepare("
        SELECT 
            'caregiver' AS type,
            c.id,
            c.created_at AS timestamp,
            u.first_name,
            u.last_name
        FROM caregivers c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT 5
    ");
    $caregiverStmt->execute();
    $caregivers = $caregiverStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get recent appointments
    $appointmentStmt = $db->prepare("
        SELECT 
            'appointment' AS type,
            a.id,
            a.created_at AS timestamp,
            p.user_id AS patient_id,
            u_patient.first_name AS patient_first_name,
            u_patient.last_name AS patient_last_name,
            c.user_id AS caregiver_id,
            u_caregiver.first_name AS caregiver_first_name,
            u_caregiver.last_name AS caregiver_last_name,
            a.status
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u_patient ON p.user_id = u_patient.id
        JOIN caregivers c ON a.caregiver_id = c.id
        JOIN users u_caregiver ON c.user_id = u_caregiver.id
        WHERE a.status = 'Pending'
        ORDER BY a.created_at DESC
        LIMIT 5
    ");
    $appointmentStmt->execute();
    $appointments = $appointmentStmt->fetchAll(PDO::FETCH_ASSOC);

    // Combine and format activities
    $activities = [];

    foreach ($assignments as $assignment) {
        $activities[] = [
            "type" => "assignment",
            "id" => (int) $assignment["id"],
            "title" => "Assignment Created",
            "description" => $assignment["patient_first_name"] . " " . $assignment["patient_last_name"] . " assigned to " . $assignment["caregiver_first_name"] . " " . $assignment["caregiver_last_name"],
            "timestamp" => $assignment["timestamp"]
        ];
    }

    foreach ($caregivers as $caregiver) {
        $activities[] = [
            "type" => "caregiver",
            "id" => (int) $caregiver["id"],
            "title" => "Caregiver Joined",
            "description" => $caregiver["first_name"] . " " . $caregiver["last_name"] . " joined CareRelay",
            "timestamp" => $caregiver["timestamp"]
        ];
    }

    foreach ($appointments as $appointment) {
        $activities[] = [
            "type" => "appointment",
            "id" => (int) $appointment["id"],
            "title" => "Visit " . ucfirst($appointment["status"]),
            "description" => $appointment["patient_first_name"] . " " . $appointment["patient_last_name"] . " visit with " . $appointment["caregiver_first_name"] . " " . $appointment["caregiver_last_name"],
            "timestamp" => $appointment["timestamp"]
        ];
    }

    // Sort by timestamp descending
    usort($activities, function ($a, $b) {
        return strtotime($b["timestamp"]) - strtotime($a["timestamp"]);
    });

    // Take top 3
    $activities = array_slice($activities, 0, 3);

    echo json_encode([
        "success" => true,
        "activities" => $activities
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
