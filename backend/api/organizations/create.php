<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

function createOrganizationCode(PDO $db, string $organizationName): string
{
    $words = preg_split('/\s+/', strtoupper(trim($organizationName)), -1, PREG_SPLIT_NO_EMPTY);
    $code = '';

    foreach ($words as $word) {
        $word = preg_replace('/[^A-Z0-9]/', '', $word);
        if ($word !== '') {
            $code .= count($words) === 1 ? substr($word, 0, 4) : $word[0];
        }
    }

    if ($code === '') {
        $code = 'ORG';
    } elseif (count($words) === 1) {
        $code = substr($code, 0, 4);
    }

    $baseCode = $code;
    $suffix = 1;
    $check = $db->prepare("SELECT id FROM organizations WHERE organization_code = ? LIMIT 1");
    while (true) {
        $check->execute([$code]);
        if (!$check->fetch()) {
            return $code;
        }
        $suffix++;
        $code = $baseCode . '-' . $suffix;
    }
}

try {
    $database = new Database();
    $db = $database->connect();

    $raw = file_get_contents("php://input");

    if (!$raw) {
        echo json_encode([
            "success" => false,
            "message" => "No request data received."
        ]);
        exit;
    }

    $data = json_decode($raw, true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data.",
            "raw" => $raw
        ]);
        exit;
    }

    $organizationEmail = trim($data["email"] ?? "");
    if ($organizationEmail === "") {
        throw new Exception("An organization email is required to create its portal account.");
    }

    $existingUserStmt = $db->prepare("SELECT id, role FROM users WHERE email = ? LIMIT 1");
    $existingUserStmt->execute([$organizationEmail]);
    $existingUser = $existingUserStmt->fetch(PDO::FETCH_ASSOC);
    if ($existingUser && empty($data["user_id"])) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "This email is already registered. Use a different organization email."
        ]);
        exit;
    }

    $db->beginTransaction();
    $ownerUserId = (int) ($data["user_id"] ?? 0);
    $createdPortalAccount = false;
    $organizationName = trim($data["organization_name"] ?? "Organization");
    $organizationCode = createOrganizationCode($db, $organizationName);

    if (!$ownerUserId) {
        $userStmt = $db->prepare("INSERT INTO users (first_name, last_name, email, password, role, phone, status) VALUES (?, ?, ?, ?, 'Organization', ?, ?)");
        $userStmt->execute([
            trim($data["contact_person"] ?? $data["organization_name"] ?? "Organization"),
            "",
            $organizationEmail,
            password_hash("changeme123", PASSWORD_DEFAULT),
            $data["phone"] ?? "",
            $data["status"] ?? "Active"
        ]);
        $ownerUserId = (int) $db->lastInsertId();
        $createdPortalAccount = true;
    }

    $sql = "INSERT INTO organizations (
                user_id,
                organization_code,
                organization_name,
                contact_person,
                phone,
                email,
                address,
                city,
                province,
                postal_code,
                description,
                website,
                status
            ) VALUES (
                :user_id,
                :organization_code,
                :organization_name,
                :contact_person,
                :phone,
                :email,
                :address,
                :city,
                :province,
                :postal_code,
                :description,
                :website,
                :status
            )";

    $stmt = $db->prepare($sql);

    $stmt->execute([
        ":user_id" => $ownerUserId,
        ":organization_code" => $organizationCode,
        ":organization_name" => $organizationName,
        ":contact_person" => $data["contact_person"] ?? "",
        ":phone" => $data["phone"] ?? "",
        ":email" => $data["email"] ?? "",
        ":address" => $data["address"] ?? "",
        ":city" => $data["city"] ?? "",
        ":province" => $data["province"] ?? "",
        ":postal_code" => $data["postal_code"] ?? "",
        ":description" => $data["description"] ?? "",
        ":website" => $data["website"] ?? "",
        ":status" => $data["status"] ?? "Active"
    ]);

    $organizationId = (int) $db->lastInsertId();
    $memberStmt = $db->prepare("INSERT INTO organization_members (organization_id, user_id, member_role, status) VALUES (?, ?, 'Owner', 'Active')");
    $memberStmt->execute([$organizationId, $ownerUserId]);
    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "Organization created successfully.",
        "organization" => [
            "id" => $organizationId
            ,"organization_code" => $organizationCode
        ],
        "temporary_password" => $createdPortalAccount ? "changeme123" : null
    ]);

} catch (PDOException $e) {

    if ($db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error.",
        "error" => $e->getMessage(),
        "sql_state" => $e->getCode()
    ]);

    exit;

} catch (Exception $e) {

    if ($db->inTransaction()) {
        $db->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => "Server error.",
        "error" => $e->getMessage()
    ]);
}