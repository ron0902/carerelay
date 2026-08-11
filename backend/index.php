<?php

header("Content-Type: application/json");

echo json_encode([
    "status" => true,
    "message" => "CareRelay Backend is Running 🚀"
]);