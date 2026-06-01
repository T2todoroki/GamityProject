<?php
// Script de diagnóstico temporal - ELIMINAR DESPUÉS
$userId = '1';
$secret = 'GAMITY_TFG_SECRET_2024';
$hash = hash('sha256', $userId . $secret);

echo "<pre>";
echo "userId: $userId\n";
echo "hash: $hash\n";

// Test 1: dashboard
echo "\n--- Test 1: GET /api/v1/admin/dashboard ---\n";
testEndpoint('http://gamity-api:8082/api/v1/admin/dashboard', 'GET', null, [
    'X-User-Id: ' . $userId,
    'X-User-Hash: ' . $hash,
    'Content-Type: application/json'
]);

// Test 2: endpoint de auth (debería funcionar sin auth)
echo "\n--- Test 2: POST /api/v1/auth/login (sin headers) ---\n";
testEndpoint('http://gamity-api:8082/api/v1/auth/login', 'POST', '{"email":"test","password":"test"}', [
    'Content-Type: application/json'
]);

// Test 3: endpoint raiz
echo "\n--- Test 3: GET / (raiz) ---\n";
testEndpoint('http://gamity-api:8082/', 'GET', null, []);

function testEndpoint($url, $method, $body, $headers) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    if ($body) curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    curl_setopt($ch, CURLOPT_HEADER, true); // include response headers
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $curlError = curl_error($ch);
    curl_close($ch);
    
    $responseHeaders = substr($response, 0, $headerSize);
    $responseBody = substr($response, $headerSize);
    
    echo "HTTP Code: $httpCode\n";
    if ($curlError) echo "CURL Error: $curlError\n";
    echo "Response Headers:\n$responseHeaders\n";
    echo "Response Body: " . (strlen($responseBody) > 0 ? $responseBody : "(empty)") . "\n";
}

echo "</pre>";
