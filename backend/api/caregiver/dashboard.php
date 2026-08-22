<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? $_GET["user_id"] ?? null;

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
                FROM assignments
                WHERE caregiver_id = ?
                    AND CURDATE() BETWEEN DATE(start_date) AND DATE(end_date)
                    AND status = 'Active'
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
                FROM assignments
        WHERE caregiver_id = ?
                    AND DATE(start_date) > CURDATE()
                    AND status = 'Active'
    ");
    $upcomingStmt->execute([$caregiverId]);
    $upcomingVisits = (int) (
        $upcomingStmt->fetch(
            PDO::FETCH_ASSOC
        )["total"] ?? 0
    );

    /*
     * Pending offers
     */
    $pendingStmt = $db->prepare("
        SELECT COUNT(*) AS total
        FROM assignments
        WHERE caregiver_id = ?
          AND status = 'Pending'
    ");
    $pendingStmt->execute([$caregiverId]);
    $pendingOffers = (int) (
        $pendingStmt->fetch(
            PDO::FETCH_ASSOC
        )["total"] ?? 0
    );

    /*
     * Completed visits
     */
    $completedStmt = $db->prepare("
        SELECT COUNT(*) AS total
        FROM assignments
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
            "pendingOffers" => $pendingOffers,
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
