<?php
require_once 'config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"), true);
$prompt = $data['prompt'] ?? '';

if (empty($prompt)) {
    echo json_encode(["error" => "Prompt is required"]);
    exit;
}

if (!defined('GEMINI_API_KEY') || empty(GEMINI_API_KEY) || GEMINI_API_KEY === 'PASTE_API_KEY_DISINI') {
    echo json_encode(["error" => "API Key belum disetting di server"]);
    exit;
}

// Gunakan model Gemini 1.5 Flash (Cepat & Hemat)
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . GEMINI_API_KEY;

$payload = [
    "contents" => [
        [
            "parts" => [
                ["text" => $prompt]
            ]
        ]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(["error" => "Gemini API Error", "details" => json_decode($response)]);
    exit;
}

$decoded = json_decode($response, true);
$text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? "Maaf, AI tidak memberikan respons.";

echo json_encode(["result" => $text]);
?>