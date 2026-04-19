<?php
// Configuración de la base de datos según tu docker-compose
$host = 'db'; 
$db   = 'gamity_db';
$user = 'root';
$pass = 'root';

echo "<h1>Gamity Project: Estado del Sistema</h1>";
echo "<p>El servidor Apache/PHP está <strong>FUNCIONANDO</strong> en el puerto 8080.</p>";

try {
    // Intentamos conectar usando PDO
    $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
    $options = [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
    
    $pdo = new PDO($dsn, $user, $pass, $options);

    echo "<p style='color: green;'><strong>CONEXIÓN EXITOSA:</strong> PHP se ha comunicado correctamente con el contenedor de MySQL ('$db').</p>";
    
    // Prueba para contar usuarios cargados por init.sql
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $count = $stmt->fetchColumn();
    echo "<p><strong>Datos:</strong> Se han detectado <strong>$count</strong> usuarios en la tabla 'users'.</p>";

} catch (\PDOException $e) {
    echo "<p style='color: red;'><strong>ERROR DE CONEXIÓN:</strong> PHP funciona, pero no llega a la base de datos.</p>";
    echo "<p>Detalle del error: " . $e->getMessage() . "</p>";
}
?>