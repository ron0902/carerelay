<?php
header("Content-Type: application/json");

require_once "../../config/cors.php";
require_once "../../config/database.php";

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $userId = $input["user_id"] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id is required."
        ]);
        exit;
    }

    /*
     * Get caregiver_id from user_id
     */
    $caregiverStmt = $db->prepare("
        SELECT id
        FROM caregivers
        WHERE user_id = ?
    ");
    $caregiverStmt->execute([$userId]);
    $caregiverRow = $caregiverStmt->fetch(PDO::FETCH_ASSOC);

    if (!$caregiverRow) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Caregiver not found."
        ]);
        exit;
    }

    $caregiverId = $caregiverRow["id"];

    /*
     * Today's shifts
     */
    $todayStmt = $db->prepare("
        SELECT COUNT(*) AS total
        FROM appointments
        WHERE caregiver_id = ?
          AND DATE(appointment_date) = CURDATE()
          AND status = 'Scheduled'
    ");
    $todayStmt->execute([$caregiverId]);
    $todaysShifts = (int) (
        $todayStmt->fetch(
            PDO::FETCH_ASSOC
        )["total"] ?? 0
    );

    /*
     * Upcoming visits
     */
    $upcomingStmt = $db->prepare("
        SELECT COUNT(*) AS total
        FROM appointments
        WHERE caregiver_id = ?
          AND appointment_date >= CURDATE()
          AND status = 'Scheduled'
    ");
    $upcomingStmt->execute([$caregiverId]);
    $upcomingVisits = (int) (
        $upcomingStmt->fetch(
            PDO::FETCH_ASSOC
        )["total"] ?? 0
    );

    /*
     * Completed visits
     */
    $completedStmt = $db->prepare("
        SELECT COUNT(*) AS total
        FROM appointments
        WHERE caregiver_id = ?
          AND status = 'Completed'
    ");
    $completedStmt->execute([$caregiverId]);
    $completedVisits = (int) (
        $completedStmt->fetch(
            PDO::FETCH_ASSOC
        )["total"] ?? 0
    );

    /*
     * Response
     */
    echo json_encode([
        "success" => true,
        "caregiver_id" => $caregiverId,
        "stats" => [
            "todaysShifts" => $todaysShifts,
            "upcomingVisits" => $upcomingVisits,
            "completedVisits" => $completedVisits
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
?>
