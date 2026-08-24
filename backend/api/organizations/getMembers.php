<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/_helpers.php";

header("Content-Type: application/json");

try {
    $db = (new Database())->connect();
    $userId = (int) ($_GET['user_id'] ?? 0);
    $organizationId = isset($_GET['organization_id']) ? (int) $_GET['organization_id'] : null;
    $organization = findOrganizationForUser($db, $userId, $organizationId);

    if (!$organization) {
        jsonError('You do not have access to this organization.', 403);
    }

    $stmt = $db->prepare("SELECT m.id, m.organization_id, m.user_id, m.member_role, m.status, m.created_at, u.first_name, u.last_name, u.email, u.phone, u.role AS user_role FROM organization_members m INNER JOIN users u ON u.id = m.user_id WHERE m.organization_id = ? ORDER BY m.member_role, u.last_name, u.first_name");
    $stmt->execute([$organization['id']]);

    echo json_encode(['success' => true, 'organization' => $organization, 'members' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
