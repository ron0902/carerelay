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

    if (!$userId || !$appointmentId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id and appointment_id are required."
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

    $appointmentStmt = $db->prepare("
        SELECT id, status
        FROM appointments
        WHERE id = ?
          AND caregiver_id = ?
        LIMIT 1
        FOR UPDATE
    ");
    $db->beginTransaction();
    $appointmentStmt->execute([
        $appointmentId,
        $caregiver["id"]
    ]);
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

    if ($appointment["status"] === "In Progress") {
        $db->commit();
        echo json_encode([
            "success" => true,
            "message" => "Visit is already in progress.",
            "appointment_id" => (int) $appointmentId,
            "status" => "In Progress"
        ]);
        exit;
    }

    if (!in_array($appointment["status"], ["Pending", "Approved"], true)) {
        $db->rollBack();
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "This appointment cannot be started from its current status."
        ]);
        exit;
    }

    $updateStmt = $db->prepare(
        "UPDATE appointments SET status = 'In Progress' WHERE id = ? AND caregiver_id = ?"
    );
    $updateStmt->execute([
        $appointmentId,
        $caregiver["id"]
    ]);
    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "Visit started successfully.",
        "appointment_id" => (int) $appointmentId,
        "status" => "In Progress"
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
