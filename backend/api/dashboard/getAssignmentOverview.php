<?php

require_once __DIR__ . "/../../config/cors.php";
require_once __DIR__ . "/../../config/database.php";

header("Content-Type: application/json");

try {
    $database = new Database();
    $db = $database->connect();

    $sql = "
        SELECT
            COUNT(*) AS total,
            SUM(
                CASE
                    WHEN status = 'Active' THEN 1
                    ELSE 0
                END
            ) AS active,
            SUM(
                CASE
                    WHEN status = 'Completed' THEN 1
                    ELSE 0
                END
            ) AS completed,
            SUM(
                CASE
                    WHEN status = 'Cancelled' THEN 1
                    ELSE 0
                END
            ) AS cancelled,
            SUM(
                CASE
                    WHEN status = 'Suspended' THEN 1
                    ELSE 0
                END
            ) AS suspended
        FROM assignments
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "overview" => [
            "total" => (int) ($result["total"] ?? 0),
            "active" => (int) ($result["active"] ?? 0),
            "completed" => (int) ($result["completed"] ?? 0),
            "cancelled" => (int) ($result["cancelled"] ?? 0),
            "suspended" => (int) ($result["suspended"] ?? 0)
        ]
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
