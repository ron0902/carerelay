<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../organizations/_helpers.php";

header("Content-Type: application/json");

try {

    $database = new Database();
    $db = $database->connect();

    $requestUserId = (int) ($_GET["user_id"] ?? 0);
    $requestedOrganizationId = isset($_GET["organization_id"])
        ? (int) $_GET["organization_id"]
        : null;
    $organization = $requestUserId
        ? findOrganizationForUser($db, $requestUserId, $requestedOrganizationId)
        : null;
    if ($requestUserId && !$organization) {
        jsonError("You do not have access to this organization.", 403);
    }

    $sql = "
        SELECT
            a.id,

            a.patient_id,
            a.caregiver_id,
            a.organization_id,
            a.assigned_by,

            a.assigned_date,
            a.start_date,
            a.end_date,

            a.shift,
            a.status,
            a.remarks,

            a.created_at,
            a.updated_at,

            -- Patient
            CONCAT(
                patient_user.first_name,
                ' ',
                patient_user.last_name
            ) AS patient_name,

            -- Caregiver
            CONCAT(
                caregiver_user.first_name,
                ' ',
                caregiver_user.last_name
            ) AS caregiver_name,

            -- Organization
            o.organization_name

        FROM assignments a

        -- Patient
        INNER JOIN patients p
            ON a.patient_id = p.id

        INNER JOIN users patient_user
            ON p.user_id = patient_user.id

        -- Caregiver
        INNER JOIN caregivers c
            ON a.caregiver_id = c.id

        INNER JOIN users caregiver_user
            ON c.user_id = caregiver_user.id

        -- Organization
        LEFT JOIN organizations o
            ON a.organization_id = o.id

        " . ($organization ? "WHERE a.organization_id = :organization_id" : "") . "

        ORDER BY a.id DESC
    ";

    $stmt = $db->prepare($sql);
    if ($organization) {
        $stmt->bindValue(":organization_id", $organization["id"], PDO::PARAM_INT);
    }
    $stmt->execute();

    $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "assignments" => $assignments
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