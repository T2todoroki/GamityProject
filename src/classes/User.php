<?php
// src/classes/User.php
require_once __DIR__ . '/Database.php';

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Registra un nuevo usuario y crea un perfil vacío
     * 
     * @param string $username
     * @param string $email
     * @param string $password
     * @return bool|string True si es exitoso, string con error si falla
     */
    public function register($username, $email, $password)
    {
        try {
            // Validar si el usuario o email ya existen
            $stmt = $this->db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                return "El nombre de usuario o correo ya está registrado.";
            }

            // Hashear contraseña (aseguramos la encriptación de la contraseña)
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Iniciamos la transacción (para que si algo falla, no se guarde a medias)
            $this->db->beginTransaction();

            // Insertar en tabla users con un avatar por defecto
            $defaultAvatar = 'img/default.png';
            $stmt = $this->db->prepare("INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)");
            $stmt->execute([$username, $email, $hashedPassword, $defaultAvatar]);
            $userId = $this->db->lastInsertId();

            // Insertar en tabla user_profiles (para que tu compañero pueda usarlo luego)
            $stmt = $this->db->prepare("INSERT INTO user_profiles (user_id) VALUES (?)");
            $stmt->execute([$userId]);

            // Confirmar transacción
            $this->db->commit();

            return true;
        } catch (PDOException $e) {
            // Revertir en caso de error
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            return "Error en el registro: " . $e->getMessage();
        }
    }
}
