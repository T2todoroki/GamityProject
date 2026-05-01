<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: auth.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamity - Encuentra tu equipo</title>
    <script src="js/tailwind-config.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
</head>
<body class="flex h-screen overflow-hidden">

    <!-- Sidebar NavegaciÃ³n (Solo Desktop) -->
    <aside class="hidden md:flex w-20 md:w-64 flex-shrink-0 bg-surface neon-border-r flex-col items-center md:items-start transition-all duration-300">
        <!-- Logo -->
        <div class="h-20 w-full flex items-center justify-center md:justify-start md:px-6 neon-border-b">
            <svg class="w-8 h-8 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="hidden md:block ml-3 font-bold text-xl tracking-widest text-white">GAMITY</span>
        </div>

        <!-- Links -->
        <nav class="flex-1 w-full py-6 flex flex-col gap-2 px-3">
            <a href="index.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Inicio</span>
            </a>
            
            <a href="chat.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Chats</span>
            </a>

            <a href="social.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Social</span>
            </a>

            <a href="profile.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Perfil</span>
            </a>
            
            <?php if (isset($_SESSION['user_role']) && ($_SESSION['user_role'] == 1 || $_SESSION['user_role'] === 'admin')): ?>
            <a href="admin.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Admin</span>
            </a>
            <?php
endif; ?>

            <a href="logout.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors mt-auto">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Salir</span>
            </a>
        </nav>
    </aside>

    <!-- Contenido Principal -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        <!-- Efectos de fondo abstracto -->
        <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-gamityPurple rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <!-- Top Header (Search bar) -->
        <header class="h-20 w-full flex items-center justify-between px-8 neon-border-b header-glass bg-surface/50 backdrop-blur-md z-10">
            <div class="flex-1 max-w-xl">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input type="text" id="searchInput" placeholder="Buscar jugadores, juegos..." class="block w-full pl-10 pr-3 py-2 border border-purple-500/25 rounded-full leading-5 bg-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:border-gamityPurple focus:ring-1 focus:ring-gamityPurple sm:text-sm transition-colors">
                </div>
            </div>
            
            <div class="ml-4 flex items-center gap-4">
                <!-- Modo Claro/Oscuro Toggle -->
                <button id="themeToggle" class="p-2 text-gray-400 hover:text-gamityPurple transition-colors rounded-full hover:bg-surfaceLight">
                    <svg id="themeIconDark" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    <svg id="themeIconLight" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </button>

                <div class="h-14 w-14 rounded-full bg-gradient-to-r from-gamityPurple to-gamityGreen p-[2px]">
                    <div class="h-full w-full rounded-full bg-surface flex items-center justify-center font-bold text-sm text-white profile-initials overflow-hidden">
                        <img id="headerAvatar" src="<?php echo htmlspecialchars($_SESSION['avatar'] ?? 'img/default.png'); ?>" class="w-full h-full object-cover">
                        <span id="headerInitials" class="hidden"><?php echo strtoupper(substr($_SESSION['username'], 0, 2)); ?></span>
                    </div>
                </div>
            </div>
        </header>
        <!-- Contenedor Scrollable -->
        <div class="flex-1 overflow-y-auto p-8 z-10" id="mainScroll">

            <!-- Filters Section -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div class="flex items-center gap-4 flex-wrap">
                    <div class="flex items-center text-gray-400 mr-2">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        Filtros
                    </div>

                    <select id="filterGame" class="filter-select">
                        <option value="">Todos los juegos</option>
                        <option value="Valorant">Valorant</option>
                        <option value="LoL">League of Legends</option>
                        <option value="CS2">Counter Strike 2</option>
                    </select>

                    <select id="filterRank" class="filter-select">
                        <option value="">Cualquier rango</option>
                        <option value="low">Hierro / Bronce / Plata</option>
                        <option value="mid">Oro / Platino / Diamante</option>
                        <option value="high">Ascendente / Inmortal / Radiante</option>
                    </select>

                    <select id="filterAttitude" class="filter-select">
                        <option value="">Cualquier actitud</option>
                        <option value="Tryhard">Competitivo / Tryhard</option>
                        <option value="Chill">Casual / Chill</option>
                    </select>
                </div>
            </div>

            <!-- Title -->
            <div class="flex items-center mb-6">
                <h2 class="text-2xl font-bold flex items-center">
                    <svg class="w-6 h-6 mr-3 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    Encuentra tu equipo
                </h2>
                <span id="playerCount" class="ml-4 px-3 py-1 bg-gamityPurple/20 text-gamityPurple text-xs rounded-full font-medium">0 jugadores</span>
            </div>

            <!-- Grid Cards -->
            <div id="usersGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24 md:pb-20">
                <div class="col-span-full flex justify-center items-center py-10 opacity-50">
                    <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-gamityPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando jugadores...
                </div>
            </div>

        </div>
    </main>

    <!-- Player Profile Modal -->
    <div id="playerModal" class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden items-center justify-center">
        <div class="modal-content bg-surface rounded-2xl border border-white/5 w-full max-w-md mx-4 overflow-hidden shadow-2xl transform scale-95 opacity-0 transition-all duration-300">
            <div class="h-28 bg-neon-gradient relative">
                <button onclick="closePlayerModal()" class="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 text-white/80 hover:text-white hover:bg-black/50 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="px-6 pb-6">
                <div class="flex items-end gap-4 -mt-10 mb-4">
                    <img id="modalAvatar" src="" class="w-20 h-20 rounded-xl border-4 border-surface object-cover shadow-lg">
                    <div class="pb-1">
                        <h3 id="modalUsername" class="text-xl font-black text-white"></h3>
                        <div id="modalStatus"></div>
                    </div>
                </div>
                <input type="hidden" id="modalUserId">
                <div class="space-y-4">
                    <div>
                        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">BiografÃ­a</label>
                        <p id="modalBio" class="text-gray-300 text-sm mt-1 leading-relaxed"></p>
                    </div>
                    <div>
                        <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Juegos y Rangos</label>
                        <div id="modalGamesContainer" class="mt-2 space-y-2"></div>
                    </div>
                    <div class="grid grid-cols-1 gap-3">
                        <div class="bg-surfaceLight rounded-xl p-3 text-center">
                            <p class="text-xs text-gray-500 font-medium mb-1">Actitud</p>
                            <p id="modalAttitude" class="text-sm font-bold text-yellow-400"></p>
                        </div>
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button id="modalChatBtn" class="flex-1 py-2.5 rounded-xl bg-neon-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            Enviar mensaje
                        </button>
                        <button onclick="closePlayerModal()" class="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Report Modal -->
    <div id="reportModal" class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden items-center justify-center">
        <div class="bg-surface rounded-2xl border border-white/5 w-full max-w-md mx-4 p-6 shadow-2xl">
            <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                </div>
                <div>
                    <h3 class="text-lg font-bold">Reportar usuario</h3>
                    <p class="text-sm text-gray-400">Reportando a <span id="reportUsername" class="text-red-400 font-semibold"></span></p>
                </div>
            </div>
            <form id="reportForm">
                <input type="hidden" id="reportUserId">
                <textarea id="reportReason" rows="4" placeholder="Describe el motivo del reporte..." class="w-full px-4 py-3 rounded-xl bg-surfaceLight border border-white/10 text-white text-sm placeholder-gray-500 resize-none focus:border-red-500 focus:outline-none mb-4"></textarea>
                <div class="flex gap-3">
                    <button type="submit" class="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all text-sm">Enviar reporte</button>
                    <button type="button" onclick="closeReportModal()" class="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Bottom Navigation Bar (Solo MÃ³vil) -->
    <nav class="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0b]/90 backdrop-blur-md border-t border-purple-500/20 md:hidden" style="padding-bottom: env(safe-area-inset-bottom, 12px)">
        <div class="flex items-center justify-around h-16">
            <a href="index.php" class="flex flex-col items-center gap-1 text-gamityPurple transition-colors relative">
                <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gamityPurple shadow-[0_0_6px_rgba(139,92,246,0.8)]"></div>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span class="text-[10px] font-bold">Inicio</span>
            </a>
            <a href="chat.php" class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="text-[10px] font-medium">Chats</span>
            </a>
            <a href="social.php" class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span class="text-[10px] font-medium">Social</span>
            </a>
            <a href="profile.php" class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span class="text-[10px] font-medium">Perfil</span>
            </a>
        </div>
    </nav>

    <script>
        const currentUserId = <?php echo $_SESSION['user_id'] ?? 'null'; ?>;
        window.currentUserId = currentUserId;
        window.apiBaseUrl = 'http://localhost:8082/api/v1';
    </script>
    <script src="js/index.js?v=<?php echo filemtime('js/index.js'); ?>"></script>
    <script src="js/app.js?v=<?php echo filemtime('js/app.js'); ?>"></script>
        
</body>
</html>
