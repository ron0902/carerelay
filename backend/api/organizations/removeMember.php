<?php
require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";
require_once __DIR__ . "/_helpers.php";

header("Content-Type: application/json");

try {
    $db = (new Database())->connect();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $actorId = (int) ($input['actor_user_id'] ?? 0);
    $memberId = (int) ($input['member_id'] ?? 0);

    if (!$actorId || !$memberId) {
        jsonError('actor_user_id and member_id are required.');
    }

    $stmt = $db->prepare("SELECT m.id, m.user_id, m.organization_id, o.user_id AS owner_user_id FROM organization_members m INNER JOIN organizations o ON o.id = m.organization_id WHERE m.id = ? LIMIT 1");
    $stmt->execute([$memberId]);
    $member = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$member) {
        jsonError('Organization member not found.', 404);
    }

    $actorStmt = $db->prepare("SELECT role FROM users WHERE id = ? AND status = 'Active' LIMIT 1");
    $actorStmt->execute([$actorId]);
    $actor = $actorStmt->fetch(PDO::FETCH_ASSOC);
    if (!$actor || ($actor['role'] !== 'Admin' && (int) $member['owner_user_id'] !== $actorId)) {
        jsonError('Only the platform admin or organization owner can manage members.', 403);
    }
    if ((int) $member['user_id'] === (int) $member['owner_user_id']) {
        jsonError('The organization owner cannot be removed.', 400);
    }

    $delete = $db->prepare("DELETE FROM organization_members WHERE id = ?");
    $delete->execute([$memberId]);
    echo json_encode(['success' => true, 'message' => 'Organization member removed successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error.']);
}
