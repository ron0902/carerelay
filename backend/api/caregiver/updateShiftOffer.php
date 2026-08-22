<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? null;
    $assignmentId = $input["assignment_id"] ?? null;
    $requestedStatus = $input["status"] ?? null;

    if (!$userId || !$assignmentId || !$requestedStatus) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id, assignment_id and status are required."
        ]);
        exit;
    }

    $statusMap = [
        "Accepted" => "Active",
        "Declined" => "Cancelled"
    ];

    if (!isset($statusMap[$requestedStatus])) {
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

    $checkStmt = $db->prepare("
        SELECT id, status
        FROM assignments
        WHERE id = ?
          AND caregiver_id = ?
        LIMIT 1
    ");
    $checkStmt->execute([$assignmentId, $caregiverId]);
    $assignment = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$assignment) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Shift assignment not found."
        ]);
        exit;
    }

    if ($assignment["status"] !== "Active") {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Only active shift assignments can be updated."
        ]);
        exit;
    }

    $status = $statusMap[$requestedStatus];
    $updateStmt = $db->prepare("
        UPDATE assignments
        SET status = ?
        WHERE id = ?
          AND caregiver_id = ?
    ");
    $updateStmt->execute([$status, $assignmentId, $caregiverId]);

    echo json_encode([
        "success" => true,
        "message" => "Shift status updated successfully.",
        "assignment_id" => (int) $assignmentId,
        "status" => $requestedStatus,
        "database_status" => $status
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
