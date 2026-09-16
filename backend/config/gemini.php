<?php

function getGeminiApiKey(): string
{
    $apiKey = getenv("GEMINI_API_KEY");

    if ($apiKey === false || trim($apiKey) === "") {
        return "";
    }

    return trim($apiKey);
}

function rankCaregiversWithGemini(array $patientNeeds, array $caregivers): ?array
{
    $apiKey = getGeminiApiKey();

    if ($apiKey === "" || !$caregivers) {
        return null;
    }

    $prompt = json_encode([
        "patient_needs" => array_values($patientNeeds),
        "caregivers" => array_map(static function (array $caregiver): array {
            return [
                "id" => (int) $caregiver["id"],
                "skills" => array_values($caregiver["skills"]),
            ];
        }, $caregivers),
        "instruction" => "Rank caregivers by how well their listed skills meet the patient's needs. Return JSON only with this shape: {\"ranked_caregiver_ids\":[number,...]}. Include every caregiver id exactly once. Do not invent ids."
    ], JSON_UNESCAPED_SLASHES);

    $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . urlencode($apiKey);
    $requestBody = json_encode([
        "contents" => [[
            "parts" => [["text" => $prompt]]
        ]],
        "generationConfig" => [
            "temperature" => 0,
            "responseMimeType" => "application/json"
        ]
    ]);

    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
        CURLOPT_POSTFIELDS => $requestBody,
        CURLOPT_TIMEOUT => 10,
    ]);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($response === false || $status < 200 || $status >= 300) {
        return null;
    }

    $decodedResponse = json_decode($response, true);
    $text = $decodedResponse["candidates"][0]["content"]["parts"][0]["text"] ?? null;
    $result = is_string($text) ? json_decode($text, true) : null;
    $ids = $result["ranked_caregiver_ids"] ?? null;

    if (!is_array($ids)) {
        return null;
    }

    $validIds = array_map(static fn(array $caregiver): int => (int) $caregiver["id"], $caregivers);
    $rankedIds = array_values(array_unique(array_filter(
        array_map("intval", $ids),
        static fn(int $id): bool => in_array($id, $validIds, true)
    )));

    foreach ($validIds as $id) {
        if (!in_array($id, $rankedIds, true)) {
            $rankedIds[] = $id;
        }
    }

    return $rankedIds;
}