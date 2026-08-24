<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? null;
    $offerId = $input["offer_id"] ?? null;
    $status = $input["status"] ?? null;

    if (!$userId || !$offerId || !$status) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id, offer_id and status are required."
        ]);
        exit;
    }

    if (!in_array($status, ["Accepted", "Declined"], true)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Status must be Accepted or Declined."
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

    $caregiverId = (int) $caregiver["id"];

    $db->beginTransaction();

    $offerStmt = $db->prepare("
        SELECT id, assignment_id, status
        FROM shift_offers
        WHERE id = ?
          AND caregiver_id = ?
        LIMIT 1
        FOR UPDATE
    ");
    $offerStmt->execute([$offerId, $caregiverId]);
    $offer = $offerStmt->fetch(PDO::FETCH_ASSOC);

    if (!$offer) {
        $db->rollBack();
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Shift offer not found."
        ]);
        exit;
    }

    if ($offer["status"] !== "Pending") {
        $db->rollBack();
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "This shift offer has already been responded to."
        ]);
        exit;
    }

    $updateStmt = $db->prepare("
        UPDATE shift_offers
        SET
            status = ?,
            responded_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND caregiver_id = ?
    ");
    $updateStmt->execute([$status, $offerId, $caregiverId]);

    if ($status === "Accepted") {
        $assignmentStmt = $db->prepare("
            UPDATE assignments
            SET status = 'Active'
            WHERE id = ?
              AND caregiver_id = ?
        ");
        $assignmentStmt->execute([
            $offer["assignment_id"],
            $caregiverId
        ]);
    }

    $recipientStmt = $db->prepare("
        SELECT DISTINCT recipient.user_id
        FROM (
            SELECT a.assigned_by AS user_id
            FROM assignments a
            WHERE a.id = ?
            UNION
            SELECT m.user_id
            FROM assignments a
            INNER JOIN organization_members m ON m.organization_id = a.organization_id
            WHERE a.id = ? AND m.status = 'Active'
            UNION
            SELECT p.user_id
            FROM assignments a
            INNER JOIN patients p ON p.id = a.patient_id
            WHERE a.id = ?
        ) recipient
    ");
    $recipientStmt->execute([
        $offer["assignment_id"],
        $offer["assignment_id"],
        $offer["assignment_id"]
    ]);
    $notificationStmt = $db->prepare(
        "INSERT INTO notifications (user_id, title, message, type, is_read, reference_id)
         VALUES (?, ?, ?, 'Assignment', 0, ?)"
    );
    while ($recipient = $recipientStmt->fetch(PDO::FETCH_ASSOC)) {
        if ((int) $recipient["user_id"] === (int) $userId) {
            continue;
        }
        $notificationStmt->execute([
            $recipient["user_id"],
            "Assignment {$status}",
            "The caregiver has " . strtolower($status) . " the assignment offer.",
            $offer["assignment_id"]
        ]);
    }

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "Shift offer {$status} successfully.",
        "offer_id" => (int) $offerId,
        "status" => $status
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
