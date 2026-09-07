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
        $organizationStmt = $db->prepare("SELECT id, organization_code, user_id, organization_name, contact_person, phone, email, address, city, province, postal_code, description, website, status FROM organizations WHERE id = ? LIMIT 1");
        $organizationStmt->execute([$organizationId]);
        return $organizationStmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    if ($user['role'] === 'Organization') {
        $organizationStmt = $db->prepare("SELECT id, organization_code, user_id, organization_name, contact_person, phone, email, address, city, province, postal_code, description, website, status FROM organizations WHERE user_id = ? LIMIT 1");
        $organizationStmt->execute([$userId]);
        return $organizationStmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    $memberStmt = $db->prepare("SELECT o.id, o.organization_code, o.user_id, o.organization_name, o.contact_person, o.phone, o.email, o.address, o.city, o.province, o.postal_code, o.description, o.website, o.status FROM organization_members m INNER JOIN organizations o ON o.id = m.organization_id WHERE m.user_id = ? AND m.status = 'Active' AND m.member_role IN ('Owner', 'Admin') LIMIT 1");
    $memberStmt->execute([$userId]);
    return $memberStmt->fetch(PDO::FETCH_ASSOC) ?: null;
}

function jsonError(string $message, int $status = 400): never
{
    http_response_code($status);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}
