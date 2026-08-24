<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();
    $input = json_decode(file_get_contents("php://input"), true) ?? [];

    $userId = $input["user_id"] ?? null;
    $appointmentId = $input["appointment_id"] ?? null;
    $report = $input["report"] ?? null;

    if (!$userId || !$appointmentId || !is_array($report)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id, appointment_id, and report are required."
        ]);
        exit;
    }

    $caregiverStmt = $db->prepare(
        "SELECT id FROM caregivers WHERE user_id = ? LIMIT 1"
    );
    $caregiverStmt->execute([$userId]);
    $caregiver = $caregiverStmt->fetch(PDO::FETCH_ASSOC);

    if (!$caregiver) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);
        exit;
    }

    $db->beginTransaction();

    $appointmentStmt = $db->prepare(
        "SELECT id, patient_id, notes, status
         FROM appointments
         WHERE id = ? AND caregiver_id = ?
         LIMIT 1
         FOR UPDATE"
    );
    $appointmentStmt->execute([$appointmentId, $caregiver["id"]]);
    $appointment = $appointmentStmt->fetch(PDO::FETCH_ASSOC);

    if (!$appointment) {
        $db->rollBack();
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Appointment not found for this caregiver."
        ]);
        exit;
    }

    if ($appointment["status"] !== "In Progress") {
        $db->rollBack();
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Only an in-progress visit can be completed."
        ]);
        exit;
    }

    $notes = json_encode([
        "visit_report" => [
            "checklist" => $report["checklist"] ?? [],
            "blood_pressure" => trim((string) ($report["bloodPressure"] ?? "")),
            "temperature" => trim((string) ($report["temperature"] ?? "")),
            "pulse_rate" => trim((string) ($report["pulseRate"] ?? "")),
            "pain_level" => trim((string) ($report["painLevel"] ?? "")),
            "mood" => trim((string) ($report["mood"] ?? "")),
            "care_notes" => trim((string) ($report["notes"] ?? "")),
            "recommendation" => trim((string) ($report["recommendation"] ?? "")),
            "submitted_at" => gmdate("c")
        ],
        "previous_notes" => $appointment["notes"]
    ], JSON_UNESCAPED_UNICODE);

    $updateStmt = $db->prepare(
        "UPDATE appointments
         SET status = 'Completed', notes = ?
         WHERE id = ? AND caregiver_id = ?"
    );
    $updateStmt->execute([$notes, $appointmentId, $caregiver["id"]]);

    $patientStmt = $db->prepare(
        "SELECT user_id FROM patients WHERE id = ? LIMIT 1"
    );
    $patientStmt->execute([$appointment["patient_id"]]);
    $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);

    if ($patient) {
        $notificationStmt = $db->prepare(
            "INSERT INTO notifications (user_id, title, message, type, is_read, reference_id)
             VALUES (?, ?, ?, 'Appointment', 0, ?)"
        );
        $notificationStmt->execute([
            $patient["user_id"],
            "Visit completed",
            "Your caregiver completed the visit and submitted a report.",
            $appointmentId
        ]);
    }

    $organizationStmt = $db->prepare(
        "SELECT DISTINCT m.user_id
         FROM appointments a
         INNER JOIN organization_members m ON m.organization_id = a.organization_id
         WHERE a.id = ? AND m.status = 'Active'"
    );
    $organizationStmt->execute([$appointmentId]);
    $organizationNotificationStmt = $db->prepare(
        "INSERT INTO notifications (user_id, title, message, type, is_read, reference_id)
         VALUES (?, ?, ?, 'Appointment', 0, ?)"
    );
    while ($member = $organizationStmt->fetch(PDO::FETCH_ASSOC)) {
        $organizationNotificationStmt->execute([
            $member["user_id"],
            "Visit completed",
            "A caregiver completed an appointment for your organization.",
            $appointmentId
        ]);
    }

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "Visit completed successfully.",
        "appointment_id" => (int) $appointmentId,
        "status" => "Completed"
    ]);
} catch (PDOException $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error."
    ]);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error."
    ]);
}
?>
