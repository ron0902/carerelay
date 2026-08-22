<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (
        !$data ||
        empty($data["user_id"])
    ) {
        echo json_encode([
            "success" => false,
            "message" => "User ID is required."
        ]);
        exit;
    }

    // Find caregiver linked to logged-in user
    $caregiverStmt = $db->prepare("
        SELECT id
        FROM caregivers
        WHERE user_id = ?
        LIMIT 1
    ");
    $caregiverStmt->execute([
        $data["user_id"]
    ]);
    $caregiver = $caregiverStmt->fetch(
        PDO::FETCH_ASSOC
    );

    if (!$caregiver) {
        echo json_encode([
            "success" => false,
            "message" => "Caregiver record not found."
        ]);
        exit;
    }

    $caregiverId = (int) $caregiver["id"];

    // Get assignments for this caregiver
    $sql = "
        SELECT
            a.id,
            a.patient_id,
            a.organization_id,
            a.assigned_date,
            a.start_date,
            a.end_date,
            a.shift,
            a.status,
            a.remarks,
                        (
                                SELECT ap.id
                                FROM appointments ap
                                WHERE ap.caregiver_id = a.caregiver_id
                                    AND ap.patient_id = a.patient_id
                                    AND ap.appointment_date BETWEEN a.start_date AND COALESCE(a.end_date, a.start_date)
                                ORDER BY ap.appointment_date DESC, ap.appointment_time DESC, ap.id DESC
                                LIMIT 1
                        ) AS appointment_id,
            (
                SELECT ap.status
                FROM appointments ap
                WHERE ap.caregiver_id = a.caregiver_id
                    AND ap.patient_id = a.patient_id
                    AND ap.appointment_date BETWEEN a.start_date AND COALESCE(a.end_date, a.start_date)
                ORDER BY ap.appointment_date DESC, ap.appointment_time DESC, ap.id DESC
                LIMIT 1
            ) AS appointment_status,
            CONCAT(
                patient_user.first_name,
                ' ',
                patient_user.last_name
            ) AS patient_name,
            o.organization_name
        FROM assignments a
        INNER JOIN patients p
            ON a.patient_id = p.id
        INNER JOIN users patient_user
            ON p.user_id = patient_user.id
        LEFT JOIN organizations o
            ON a.organization_id = o.id
        WHERE a.caregiver_id = ?
        ORDER BY a.start_date DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$caregiverId]);
    $assignments = $stmt->fetchAll(
        PDO::FETCH_ASSOC
    );

    echo json_encode([
        "success" => true,
        "shifts" => $assignments,
        "message" => "Shifts retrieved successfully."
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
