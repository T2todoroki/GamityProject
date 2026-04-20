<?php
session_start();
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamity - Login & Regístrate</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        gamityDark: '#0a0a0b',
                        gamityPurple: '#8b5cf6',
                        gamityGreen: '#10b981',
                        surface: '#18181b'
                    },
                    backgroundImage: {
                        'neon-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #10b981 100%)',
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
</head>
<body class="flex items-center justify-center min-h-screen relative">
    
    <div class="fixed top-[-10%] left-[-10%] w-96 h-96 bg-gamityPurple rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
    <div class="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-gamityGreen rounded-full blur-[150px] opacity-20 pointer-events-none"></div>

    <div class="relative w-full max-w-4xl h-[600px] bg-surface rounded-2xl glow bg-opacity-80 backdrop-blur-xl border border-white/5 overflow-hidden flex">
        
        <div id="formsContainer" class="absolute top-0 left-0 w-1/2 h-full transition-transform duration-700 ease-in-out z-10 bg-surface">
            <div id="loginFormContainer" class="absolute inset-0 p-12 flex flex-col justify-center opacity-100-custom z-20">
                <h2 class="text-3xl font-bold mb-2">Iniciar sesión</h2>
                <p class="text-sm text-gray-400 mb-8">Ingresa tus datos para continuar</p>
                
                <form id="loginForm" class="space-y-5">
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Correo electrónico</label>
                        <div class="relative">
                            <span class="absolute left-4 top-3 text-gray-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </span>
                            <input type="email" name="email" required placeholder="correo@ejemplo.com" class="w-full pl-12 pr-4 py-3 rounded-xl input-gamity text-sm text-white placeholder-gray-500">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Contraseña</label>
                        <div class="relative flex items-center">
                            <span class="absolute left-4 text-gray-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </span>
                            <input type="password" id="loginPassword" name="password" required placeholder="••••••••" class="w-full pl-12 pr-12 py-3 rounded-xl input-gamity text-sm text-white placeholder-gray-500">
                            <button type="button" onclick="togglePassword('loginPassword', this)" class="absolute right-4 text-gray-500 hover:text-gamityPurple transition-all duration-300">
                                <!-- Eye Icon -->
                                <svg class="w-5 h-5 eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <button type="submit" class="w-full py-3 rounded-xl bg-neon-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-1 mt-4">
                        Iniciar sesión
                    </button>
                    <div id="loginMessage" class="text-red-500 text-sm mt-3 text-center hidden"></div>
                </form>
            </div>

            <div id="registerFormContainer" class="absolute inset-0 p-12 flex flex-col justify-center opacity-0-custom z-0">
                <h2 class="text-3xl font-bold mb-2">Crear cuenta</h2>
                <p class="text-sm text-gray-400 mb-8">Regístrate y encuentra tu equipo</p>
                
                <form id="registerForm" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Nombre de usuario</label>
                        <div class="relative">
                            <span class="absolute left-4 top-3 text-gray-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </span>
                            <input type="text" name="username" required placeholder="tu_gamertag" class="w-full pl-12 pr-4 py-2.5 rounded-xl input-gamity text-sm text-white placeholder-gray-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Correo electrónico</label>
                        <div class="relative">
                            <span class="absolute left-4 top-3 text-gray-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </span>
                            <input type="email" name="email" required placeholder="correo@ejemplo.com" class="w-full pl-12 pr-4 py-2.5 rounded-xl input-gamity text-sm text-white placeholder-gray-500">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">Contraseña</label>
                        <div class="relative flex items-center">
                            <span class="absolute left-4 text-gray-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </span>
                            <input type="password" id="registerPassword" name="password" required placeholder="••••••••" class="w-full pl-12 pr-12 py-2.5 rounded-xl input-gamity text-sm text-white placeholder-gray-500">
                            <button type="button" onclick="togglePassword('registerPassword', this)" class="absolute right-4 text-gray-500 hover:text-gamityPurple transition-all duration-300">
                                <!-- Eye Icon -->
                                <svg class="w-5 h-5 eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <button type="submit" class="w-full py-3 rounded-xl bg-neon-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 transform hover:-translate-y-1 mt-2">
                        Crear cuenta
                    </button>
                    <div id="registerMessage" class="text-red-500 text-sm mt-3 text-center hidden"></div>
                </form>
            </div>
        </div>

        <div id="overlayPanel" class="absolute top-0 left-1/2 w-1/2 h-full bg-neon-gradient transition-transform duration-700 ease-in-out z-20 flex items-center justify-center text-center p-12">
            
            <div id="overlayRightContent" class="absolute flex flex-col items-center justify-center w-full px-12 transition-opacity duration-500 opacity-100">
                <svg class="w-16 h-16 text-white mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 class="text-4xl font-bold text-white mb-4">¡Hola, Gamer!</h2>
                <p class="text-white/80 mb-8 font-medium">¿Aún no tienes cuenta? Regístrate y únete a la comunidad.</p>
                <button id="showRegisterBtn" class="px-8 py-2 rounded-full border-2 border-white/50 text-white font-medium hover:bg-white/10 transition-colors flex items-center">
                    Regístrate <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>

            <div id="overlayLeftContent" class="absolute flex flex-col items-center justify-center w-full px-12 transition-opacity duration-500 opacity-0 pointer-events-none">
                <svg class="w-16 h-16 text-white mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h2 class="text-4xl font-bold text-white mb-4">¡Bienvenido!</h2>
                <p class="text-white/80 mb-8 font-medium">¿Ya tienes cuenta? Inicia sesión y vuelve a la acción.</p>
                <button id="showLoginBtn" class="px-8 py-2 rounded-full border-2 border-white/50 text-white font-medium hover:bg-white/10 transition-colors flex items-center">
                    Inicia sesión <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
            </div>
        </div>

    </div>

    <script src="js/auth.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
