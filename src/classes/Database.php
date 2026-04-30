<?php
// src/classes/Database.php

class Database
{
    private static $instance = null;
    private $pdo;

    private $host = 'db';
    private $user = 'root';
    private $pass = 'root';
    private $dbname = 'gamity_db';

    private function __construct()
    {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->pdo = new PDO($dsn, $this->user, $this->pass, $options);
        }
        catch (PDOException $e) {
            die("Error de conexión a la base de datos: " . $e->getMessage());
        }
    }

    //Aquí creamos dos funciones de seguridad para evitar la clonación y deserialización del objeto
    // Prevenir la clonación del objeto
    private function __clone()
    {
    }

    // Prevenir la deserialización del objeto
    public function __wakeup()
    {
        throw new Exception("No se puede deserializar un singleton.");
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}
?>