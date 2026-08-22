<?php
require_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();
    $method = $_SERVER["REQUEST_METHOD"];
    $input = json_decode(file_get_contents("php://input"), true) ?? [];

    if ($method === "GET") {
        $stmt = $db->query(" 
            SELECT cp.*, 
                   CONCAT(patient_user.first_name, ' ', patient_user.last_name) AS patient_name,
                   CONCAT(caregiver_user.first_name, ' ', caregiver_user.last_name) AS caregiver_name
            FROM care_plans cp
            INNER JOIN patients p ON cp.patient_id = p.id
            INNER JOIN users patient_user ON p.user_id = patient_user.id
            INNER JOIN caregivers c ON cp.caregiver_id = c.id
            INNER JOIN users caregiver_user ON c.user_id = caregiver_user.id
            ORDER BY cp.updated_at DESC, cp.id DESC
        ");
        echo json_encode(["success" => true, "care_plans" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        exit;
    }

    if ($method === "DELETE") {
        $id = $input["id"] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Care plan ID is required."]);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM care_plans WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true, "message" => "Care plan deleted successfully."]);
        exit;
    }

    $required = ["patient_id", "caregiver_id", "title", "care_goal", "start_date", "status"];
    foreach ($required as $field) {
        if (!isset($input[$field]) || $input[$field] === "") {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "$field is required."]);
            exit;
        }
    }

    $statuses = ["Active", "Completed", "Cancelled"];
    if (!in_array($input["status"], $statuses, true)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid care plan status."]);
        exit;
    }

    $values = [
        $input["patient_id"],
        $input["caregiver_id"],
        $input["assignment_id"] ?: null,
        trim($input["title"]),
        trim($input["diagnosis"] ?? ""),
        trim($input["care_goal"]),
        trim($input["medications"] ?? ""),
        trim($input["instructions"] ?? ""),
        $input["start_date"],
        $input["end_date"] ?: null,
        $input["status"]
    ];

    if ($method === "POST") {
        $stmt = $db->prepare(" 
            INSERT INTO care_plans
            (patient_id, caregiver_id, assignment_id, title, diagnosis, care_goal,
             medications, instructions, start_date, end_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute($values);
        echo json_encode(["success" => true, "message" => "Care plan created successfully."]);
        exit;
    }

    if ($method === "PUT") {
        if (empty($input["id"])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Care plan ID is required."]);
            exit;
        }

        $values[] = $input["id"];
        $stmt = $db->prepare(" 
            UPDATE care_plans SET
                patient_id = ?, caregiver_id = ?, assignment_id = ?, title = ?, diagnosis = ?,
                care_goal = ?, medications = ?, instructions = ?, start_date = ?, end_date = ?, status = ?
            WHERE id = ?
        ");
        $stmt->execute($values);
        echo json_encode(["success" => true, "message" => "Care plan updated successfully."]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error."]);
}
?>
