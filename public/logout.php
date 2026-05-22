<?php
session_start();

if (isset($_SESSION['user_id'])) {
    // Definimos la URL de la API (desde una variable de entorno o config si existe)
    // Para simplificar, usamos localhost o el gamity-api interno si estamos en Docker
    $apiBase = getenv('API_BASE_URL') ?: 'http://gamity-api:8080/api/v1';
    
    // Configurar cURL para decirle a Java que cierre la sesión (estado offline)
    $ch = curl_init($apiBase . '/auth/logout');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-User-Id: ' . $_SESSION['user_id'],
        'Content-Length: 0'
    ]);
    
    // Ejecutamos la petición y la cerramos
    curl_exec($ch);
    curl_close($ch);
}

session_destroy();
header("Location: auth.php");
exit;
