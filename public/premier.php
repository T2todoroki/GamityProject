<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: auth.php");
    exit;
}
$username = $_SESSION['username'];
$initials = strtoupper(substr($username, 0, 2));
?>
<!DOCTYPE html>
<html lang="es" class="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamity - Premier</title>
    <meta name="description" content="Gamity Premier - Matchmaking Express 5v5. Encuentra partidas equilibradas al instante.">
    <script src="js/config.js"></script>
    <script src="js/tailwind-config.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/premier.css">
</head>

<body class="flex h-screen overflow-hidden">

    <!-- Sidebar Navegación (Solo Desktop) -->
    <aside
        class="hidden md:flex w-20 md:w-64 flex-shrink-0 bg-surface neon-border-r flex-col items-center md:items-start transition-all duration-300 z-20 relative">
        <div class="h-20 w-full flex items-center justify-center md:justify-start md:px-6 neon-border-b">
            <svg class="w-8 h-8 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="hidden md:block ml-3 font-bold text-xl tracking-widest text-white">GAMITY</span>
        </div>

        <nav class="flex-1 w-full py-6 flex flex-col gap-2 px-3">
            <a href="index.php"
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                    </path>
                </svg>
                <span class="hidden md:block ml-3 font-medium">Inicio</span>
            </a>
            <a href="chat.php"
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z">
                    </path>
                </svg>
                <span class="hidden md:block ml-3 font-medium">Chats</span>
            </a>

            <a href="social.php"
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                    </path>
                </svg>
                <span class="hidden md:block ml-3 font-medium">Social</span>
            </a>
            <a href="premier.php"
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="hidden md:block ml-3 font-medium">Premier</span>
            </a>
            <a href="profile.php"
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="hidden md:block ml-3 font-medium">Perfil</span>
            </a>
            <?php if (isset($_SESSION['user_role']) && ($_SESSION['user_role'] == 1 || $_SESSION['user_role'] === 'admin')): ?>
                <a href="admin.php"
                    class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                        </path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="hidden md:block ml-3 font-medium">Admin</span>
                </a>
            <?php endif; ?>

            <a href="logout.php"
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors mt-auto">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                    </path>
                </svg>
                <span class="hidden md:block ml-3 font-medium">Salir</span>
            </a>
        </nav>
    </aside>

    <main class="flex-1 flex flex-col relative overflow-hidden">
        <!-- Abstract gradient background -->
        <div
            class="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-yellow-500 rounded-full blur-[200px] opacity-10 pointer-events-none">
        </div>

        <header
            class="h-20 w-full flex items-center justify-between px-8 neon-border-b relative z-10 header-glass bg-surface/50 backdrop-blur-md">
            <h1 class="text-2xl font-bold tracking-wide flex items-center gap-2">
                <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Premier
            </h1>
            <div class="flex items-center gap-4">
                <button id="themeToggle"
                    class="p-2 text-gray-400 hover:text-gamityPurple transition-colors rounded-full hover:bg-surfaceLight">
                    <svg id="themeIconDark" class="w-6 h-6 hidden" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z">
                        </path>
                    </svg>
                    <svg id="themeIconLight" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                        </path>
                    </svg>
                </button>
            </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8 pb-24 md:pb-8 relative z-10">
            <div class="max-w-5xl mx-auto">

                <!-- Tabs -->
                <div class="flex w-full bg-surfaceLight rounded-xl p-1 mb-8 overflow-hidden border border-white/5">
                    <button id="tabTournament" class="flex-1 py-3 tab-btn tab-active rounded-lg font-bold">
                        <i class="fa-solid fa-crosshairs mr-2"></i>Buscar Partida
                    </button>
                    <button id="tabMyTeam" class="flex-1 py-3 tab-btn tab-inactive rounded-lg font-bold">
                        <i class="fa-solid fa-users mr-2"></i>Mi Escuadrón 5v5
                    </button>
                    <button id="tabBracket" class="flex-1 py-3 tab-btn tab-inactive rounded-lg font-bold">
                        <i class="fa-solid fa-medal mr-2"></i>Salón de la Fama
                    </button>
                </div>

                <!-- Tab 1: Buscar Partida -->
                <div id="contentTournament" class="space-y-6">
                    <div class="flex flex-col items-center justify-center py-20 opacity-50">
                        <svg class="animate-spin h-8 w-8 text-gamityPurple mb-4" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <p>Conectando con el servidor de matchmaking...</p>
                    </div>
                </div>

                <!-- Tab 2: Mi Escuadrón 5v5 (Estado idle elegante, sin spinner) -->
                <div id="contentMyTeam" class="space-y-6 hidden">
                    <div class="bg-surface p-10 rounded-2xl border border-white/10 text-center animate-premierFadeIn">
                        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gamityPurple/10 border border-gamityPurple/20 flex items-center justify-center">
                            <i class="fa-solid fa-shield-halved text-4xl text-gamityPurple/50 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">Aún no estás en el campo de batalla.</h3>
                        <p class="text-gray-400 max-w-md mx-auto">Ve a la pestaña <span class="text-gamityPurple font-semibold">Buscar Partida</span> para unirte a la cola y ser asignado a un escuadrón.</p>
                    </div>
                </div>

                <!-- Tab 3: Salón de la Fama -->
                <div id="contentBracket" class="space-y-6 hidden">
                    <div class="bg-surface p-8 rounded-2xl border border-white/10 text-center py-16 animate-premierFadeIn">
                        <i class="fa-solid fa-spinner fa-spin text-4xl text-gamityPurple/50 mb-4"></i>
                        <p class="text-gray-400 text-sm">Cargando Salón de la Fama...</p>
                    </div>
                </div>

            </div>
        </div>
    </main>

    <!-- Bottom Navigation Bar (Solo Móvil) -->
    <nav class="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0b]/90 backdrop-blur-md border-t border-purple-500/20 md:hidden"
        style="padding-bottom: env(safe-area-inset-bottom, 12px)">
        <div class="flex items-center justify-around h-16">
            <a href="index.php"
                class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                    </path>
                </svg>
                <span class="text-[10px] font-medium">Inicio</span>
            </a>
            <a href="chat.php"
                class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z">
                    </path>
                </svg>
                <span class="text-[10px] font-medium">Chats</span>
            </a>
            <a href="social.php"
                class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                    </path>
                </svg>
                <span class="text-[10px] font-medium">Social</span>
            </a>
            <a href="premier.php" class="flex flex-col items-center gap-1 text-gamityPurple transition-colors relative">
                <div
                    class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gamityPurple shadow-[0_0_6px_rgba(139,92,246,0.8)]">
                </div>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="text-[10px] font-bold">Premier</span>
            </a>
            <a href="profile.php"
                class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-[10px] font-medium">Perfil</span>
            </a>
        </div>
    </nav>

    <!-- Modal de Chat -->
    <div id="chat-modal" class="hidden fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div
            class="bg-surface border border-gamityPurple/30 rounded-2xl w-full max-w-md h-[500px] flex flex-col relative overflow-hidden">
            <div class="p-4 bg-surfaceLight border-b border-white/10 flex justify-between items-center">
                <h3 class="font-bold text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z">
                        </path>
                    </svg>
                    Chat del Equipo
                </h3>
                <button onclick="closeChat()" class="text-gray-400 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                <!-- Mensajes aquí -->
            </div>
            <div class="p-4 bg-surfaceLight border-t border-white/10">
                <form id="chat-form" class="flex gap-2">
                    <input type="text" id="chat-input"
                        class="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-gamityPurple"
                        placeholder="Escribe un mensaje...">
                    <button type="submit"
                        class="bg-gamityPurple text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition">Enviar</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal de Reportar Resultado -->
    <div id="report-modal" class="hidden fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div class="bg-surface border border-gamityPurple/30 rounded-2xl w-full max-w-sm flex flex-col relative overflow-hidden animate-premierFadeIn shadow-[0_0_50px_rgba(139,92,246,0.15)]">
            <div class="p-6 text-center relative z-10">
                <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gamityPurple/10 border border-gamityPurple/30 flex items-center justify-center">
                    <i class="fa-solid fa-flag-checkered text-4xl text-gamityPurple drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]"></i>
                </div>
                <h3 class="text-2xl font-black text-white mb-2">Reportar Resultado</h3>
                <p class="text-gray-400 text-sm mb-6">Selecciona el resultado real de la partida. Falsificar el resultado resultará en un bloqueo de la cuenta.</p>
                <div class="flex flex-col gap-3">
                    <button id="confirmWinBtn" class="w-full py-3 rounded-xl bg-gamityPurple text-white font-bold hover:bg-purple-600 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                        <i class="fa-solid fa-trophy text-yellow-400 mr-2"></i> Reportar Victoria
                    </button>
                    <button id="confirmLossBtn" class="w-full py-3 rounded-xl bg-red-500/20 text-red-500 font-bold hover:bg-red-500/30 transition-colors">
                        <i class="fa-solid fa-skull mr-2"></i> Reportar Derrota
                    </button>
                    <button onclick="closeReportModal()" class="w-full py-3 rounded-xl bg-surfaceLight text-white font-bold hover:bg-white/10 transition-colors mt-2">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none"></div>

    <!-- Modal de Celebración Victoria/Derrota -->
    <div id="celebration-modal" class="hidden fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-4">
        <div id="celebration-content" class="bg-surface border border-gamityPurple/30 rounded-2xl w-full max-w-md flex flex-col relative overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.2)]">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-20 -left-20 w-60 h-60 bg-gamityPurple/10 rounded-full blur-[80px] animate-pulse"></div>
                <div class="absolute -bottom-20 -right-20 w-60 h-60 bg-yellow-500/10 rounded-full blur-[80px] animate-pulse"></div>
            </div>
            <div class="p-8 text-center relative z-10" id="celebration-inner">
                <!-- Contenido inyectado por JS -->
            </div>
        </div>
    </div>

    <script>
        window.currentUserId = <?php echo $_SESSION['user_id']; ?>;
        window.currentUserHash = '<?php echo $_SESSION['user_hash'] ?? ''; ?>';
    </script>
    <script src="js/premier.js?v=<?php echo filemtime('js/premier.js') ?: time(); ?>"></script>
    <script src="js/app.js?v=<?php echo filemtime('js/app.js'); ?>"></script>
</body>

</html>