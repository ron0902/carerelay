<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {

    $database = new Database();
    $db = $database->connect();

    $sql = "
        SELECT
            a.id,
            'Assignment Created' AS title,
            CONCAT(
                patient_user.first_name,
                ' ',
                patient_user.last_name
            ) AS patient_name,
            CONCAT(
                caregiver_user.first_name,
                ' ',
                caregiver_user.last_name
            ) AS caregiver_name,
            a.created_at,
            a.status
        FROM assignments a
        INNER JOIN patients p
            ON a.patient_id = p.id
        INNER JOIN users patient_user
            ON p.user_id = patient_user.id
        INNER JOIN caregivers c
            ON a.caregiver_id = c.id
        INNER JOIN users caregiver_user
            ON c.user_id = caregiver_user.id
        ORDER BY a.created_at DESC
        LIMIT 5
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute();
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
