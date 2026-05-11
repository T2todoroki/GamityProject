<?php
// public/api/auth.php
session_start();
require_once __DIR__ . '/../../src/classes/User.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'register') {
        // El frontend ya apunta directamente a Java para el registro
        echo json_encode(['success' => false, 'error' => 'El registro ahora se maneja vía Spring Boot directamente']);
        exit;
    }

    if ($action === 'login') {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
            exit;
        }

        // Preparamos los datos para enviarlos a la API de Java (Spring Boot)
        // Usamos 'gamity-api' en lugar de 'localhost' porque ambos están en Docker Compose
        $javaUrl = 'http://gamity-api:8082/api/v1/auth/login';
        $postData = json_encode([
            'email' => $email,
            'password' => $password
        ]);

        // Iniciamos cURL para comunicarnos con el backend en Java de forma segura
        $ch = curl_init($javaUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($postData)
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Verificamos si Java aceptó el login
        if ($response && $httpCode === 200) {
            $data = json_decode($response, true);
            
            if (isset($data['success']) && $data['success'] === true && isset($data['user'])) {
                // Java aprobó el inicio de sesión, así que creamos la sesión en PHP
                $userData = $data['user'];
                
                $_SESSION['user_id'] = $userData['id'];
                $_SESSION['username'] = $userData['username'];
                $_SESSION['user_role'] = $userData['role'] ?? 'user';
                $_SESSION['avatar'] = $userData['avatar'] ?? 'img/default.png';
                
                echo json_encode(['success' => true]);
                exit;
            }
        }

        // Si falla, decodificamos el error de Java o lanzamos uno genérico
        $errorMsg = 'Credenciales incorrectas';
        if ($response) {
            $errData = json_decode($response, true);
            if (isset($errData['error'])) {
                $errorMsg = $errData['error'];
            }
        }

        echo json_encode(['success' => false, 'error' => $errorMsg]);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'Solicitud inválida']);
