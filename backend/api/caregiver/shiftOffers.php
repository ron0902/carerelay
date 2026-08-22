<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $input = json_decode(file_get_contents("php://input"), true) ?? [];
    $userId = $input["user_id"] ?? null;

    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "user_id is required."
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

    $sql = "
        SELECT
            so.id,
            so.assignment_id,
            so.caregiver_id,
            so.offered_by,
            so.status AS offer_status,
            so.offered_at,
            so.responded_at,
            a.patient_id,
            a.caregiver_id,
            a.organization_id,
            a.assigned_date,
            a.start_date,
            a.end_date,
            a.shift,
            a.status AS assignment_status,
            a.remarks,
            CONCAT(
                patient_user.first_name,
                ' ',
                patient_user.last_name
            ) AS patient_name,
            o.organization_name AS organization_name
        FROM shift_offers so
        INNER JOIN assignments a
            ON so.assignment_id = a.id
        INNER JOIN patients p
            ON a.patient_id = p.id
        INNER JOIN users patient_user
            ON p.user_id = patient_user.id
        LEFT JOIN organizations o
            ON a.organization_id = o.id
        WHERE so.caregiver_id = ?
        ORDER BY so.offered_at DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute([$caregiverId]);
    $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "offers" => $offers,
        "message" => "Shift offers retrieved successfully."
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
