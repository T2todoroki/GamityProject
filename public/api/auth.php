<?php
// public/api/auth.php
session_start();
require_once __DIR__ . '/../../src/classes/User.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $user = new User();

    if ($action === 'register') {
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
            exit;
        }

        $result = $user->register($username, $email, $password);

        if ($result === true) {
            echo json_encode(['success' => true]);
        }
        else {
            echo json_encode(['success' => false, 'error' => $result]);
        }
        exit;
    }

    if ($action === 'login') {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($email) || empty($password)) {
            echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
            exit;
        }

        $result = $user->login($email, $password);

        if ($result !== false) {
            $_SESSION['user_id'] = $result['id'];
            $_SESSION['username'] = $result['username'];
            $_SESSION['user_role'] = $result['role'] ?? 'user';  // 'admin' o 'user' (string)
            $_SESSION['avatar'] = $result['avatar'] ?? 'img/default.png';
            echo json_encode(['success' => true]);
        }
        else {
            echo json_encode(['success' => false, 'error' => 'Credenciales incorrectas']);
        }
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'Solicitud inválida']);
