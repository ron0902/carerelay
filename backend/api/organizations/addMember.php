<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/_helpers.php";

header("Content-Type: application/json");

try {
    $db = (new Database())->connect();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $actorId = (int) ($input['actor_user_id'] ?? 0);
    $organizationId = (int) ($input['organization_id'] ?? 0);
    $memberUserId = (int) ($input['user_id'] ?? 0);
    $memberRole = $input['member_role'] ?? 'Contact';

    if (!$actorId || !$organizationId || !$memberUserId) {
        jsonError('actor_user_id, organization_id and user_id are required.');
    }
    if (!in_array($memberRole, ['Admin', 'Contact'], true)) {
        jsonError('member_role must be Admin or Contact.');
    }

    $organization = findOrganizationForUser($db, $actorId, $organizationId);
    if (!$organization) {
        jsonError('You do not have access to this organization.', 403);
    }

    $actorStmt = $db->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
    $actorStmt->execute([$actorId]);
    $actor = $actorStmt->fetch(PDO::FETCH_ASSOC);
    if ($actor['role'] !== 'Admin' && (int) $organization['user_id'] !== $actorId) {
        jsonError('Only the platform admin or organization owner can manage members.', 403);
    }

    $userStmt = $db->prepare("SELECT id FROM users WHERE id = ? AND status = 'Active' LIMIT 1");
    $userStmt->execute([$memberUserId]);
    if (!$userStmt->fetch()) {
        jsonError('User not found or inactive.', 404);
    }

    $stmt = $db->prepare("INSERT INTO organization_members (organization_id, user_id, member_role, status) VALUES (?, ?, ?, 'Active') ON DUPLICATE KEY UPDATE member_role = VALUES(member_role), status = 'Active'");
    $stmt->execute([$organizationId, $memberUserId, $memberRole]);

    echo json_encode(['success' => true, 'message' => 'Organization member saved successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
