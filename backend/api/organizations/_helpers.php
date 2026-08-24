<?php

function findOrganizationForUser(PDO $db, int $userId, ?int $organizationId = null): ?array
{
    $userStmt = $db->prepare("SELECT id, role FROM users WHERE id = ? AND status = 'Active' LIMIT 1");
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return null;
    }

    if ($user['role'] === 'Admin' && $organizationId !== null) {
        $organizationStmt = $db->prepare("SELECT id, organization_name, user_id FROM organizations WHERE id = ? LIMIT 1");
        $organizationStmt->execute([$organizationId]);
        return $organizationStmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    if ($user['role'] === 'Organization') {
        $organizationStmt = $db->prepare("SELECT id, organization_name, user_id FROM organizations WHERE user_id = ? LIMIT 1");
        $organizationStmt->execute([$userId]);
        return $organizationStmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    $memberStmt = $db->prepare("SELECT o.id, o.organization_name, o.user_id FROM organization_members m INNER JOIN organizations o ON o.id = m.organization_id WHERE m.user_id = ? AND m.status = 'Active' LIMIT 1");
    $memberStmt->execute([$userId]);
    return $memberStmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

function jsonError(string $message, int $status = 400): never
{
    http_response_code($status);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}
