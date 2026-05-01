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

/**
     * Inicia sesión verificando credenciales
     * 
     * @param string $email
     * @param string $password
     * @return array|false Datos del usuario si es correcto, false si falla
     */
    public function login($email, $password)
    {
        try {
            $stmt = $this->db->prepare("SELECT id, username, password, role, avatar FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                // Eliminar el hash antes de devolver los datos del usuario por seguridad
                unset($user['password']);
                return $user;
            }

            return false;
        } catch (PDOException $e) {
            return false;
        }
    }


    /**
     * Obtener el perfil de un usuario
     */
    public function getProfile($userId)
    {
        try {
            // Asegurar que exista la fila en user_profiles (esto sirve para auto-reparar en caso de que algo falle y no se cree el perfil)
            $check = $this->db->prepare("SELECT 1 FROM user_profiles WHERE user_id = ?");
            $check->execute([$userId]);
            if (!$check->fetch()) {
                $insert = $this->db->prepare("INSERT INTO user_profiles (user_id) VALUES (?)");
                $insert->execute([$userId]);
            }

            $stmt = $this->db->prepare("
                SELECT u.username, u.email, u.avatar, up.bio, up.main_game, up.game_rank, up.attitude
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = ?
            ");
            $stmt->execute([$userId]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
        catch (PDOException $e) {
            return false;
        }
    }

    /**
     * Actualiza el perfil de un usuario
     */
    public function updateProfile($userId, $data)
    {
        try {
            // Asegurar que exista la fila en user_profiles
            $check = $this->db->prepare("SELECT 1 FROM user_profiles WHERE user_id = ?");
            $check->execute([$userId]);
            if (!$check->fetch()) {
                $insert = $this->db->prepare("INSERT INTO user_profiles (user_id) VALUES (?)");
                $insert->execute([$userId]);
            }

            $stmt = $this->db->prepare("
                UPDATE user_profiles 
                SET bio = ?, main_game = ?, game_rank = ?, attitude = ?
                WHERE user_id = ?
            ");
            return $stmt->execute([
                $data['bio'] ?? '',
                $data['main_game'] ?? '',
                $data['game_rank'] ?? '',
                $data['attitude'] ?? '',
                $userId
            ]);
        }
        catch (PDOException $e) {
            return false;
        }
    }

    /**
     * Actualiza el avatar del usuario
     */
    public function updateAvatar($userId, $avatarUrl)
    {
        try {
            $stmt = $this->db->prepare("UPDATE users SET avatar = ? WHERE id = ?");
            return $stmt->execute([$avatarUrl, $userId]);
        }
        catch (PDOException $e) {
            return false;
        }
    }
}
?>
