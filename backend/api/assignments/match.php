<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/../../config/gemini.php";
require_once __DIR__ . "/../organizations/_helpers.php";

header("Content-Type: application/json");

try {
    $data = json_decode(file_get_contents("php://input"), true) ?? [];
    $assignedBy = (int) ($data["assigned_by"] ?? 0);
    $patientId = (int) ($data["patient_id"] ?? 0);
    $organizationId = (int) ($data["organization_id"] ?? 0);

    if (!$assignedBy || !$patientId || !$organizationId) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "assigned_by, patient_id, and organization_id are required."]);
        exit;
    }

    $database = new Database();
    $db = $database->connect();
    $organization = findOrganizationForUser($db, $assignedBy, $organizationId);

    if (!$organization) {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "You do not have access to this organization."]);
        exit;
    }

    $patientStmt = $db->prepare("SELECT care_needs FROM patients WHERE id = ? AND organization_id = ? LIMIT 1");
    $patientStmt->execute([$patientId, $organization["id"]]);
    $patientNeeds = $patientStmt->fetchColumn();

    if ($patientNeeds === false) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Patient not found."]);
        exit;
    }

    $caregiverStmt = $db->prepare(
                "SELECT c.id, GROUP_CONCAT(s.name ORDER BY s.name SEPARATOR ', ') AS skills
         FROM caregivers c
                 INNER JOIN users u ON u.id = c.user_id
         LEFT JOIN caregiver_skill_sets css ON css.caregiver_id = c.id
         LEFT JOIN skill_sets s ON s.id = css.skill_set_id
                 WHERE c.organization_id = ?
                     AND u.status = 'Active'
                     AND c.availability = 'Available'
         GROUP BY c.id"
    );
    $caregiverStmt->execute([$organization["id"]]);
    $caregivers = array_map(static function (array $caregiver): array {
        return [
            "id" => (int) $caregiver["id"],
            "skills" => $caregiver["skills"] ? array_map("trim", explode(",", $caregiver["skills"])) : [],
        ];
    }, $caregiverStmt->fetchAll(PDO::FETCH_ASSOC));

    $needs = $patientNeeds ? array_map("trim", explode(",", $patientNeeds)) : [];
    $rankedIds = rankCaregiversWithGemini($needs, $caregivers);
    $source = "gemini";

    if ($rankedIds === null) {
        $source = "skills";
        usort($caregivers, static function (array $first, array $second) use ($needs): int {
            $firstMatches = count(array_intersect($first["skills"], $needs));
            $secondMatches = count(array_intersect($second["skills"], $needs));
            return $secondMatches <=> $firstMatches;
        });
        $rankedIds = array_map(static fn(array $caregiver): int => $caregiver["id"], $caregivers);
    }

    echo json_encode([
        "success" => true,
        "source" => $source,
        "ranked_caregiver_ids" => $rankedIds,
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Unable to match caregivers."]);
}