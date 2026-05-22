<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: auth.php");
    exit;
}
// Solo admins (role = 1 o 'admin')
if (!isset($_SESSION['user_role']) || ($_SESSION['user_role'] != 1 && $_SESSION['user_role'] !== 'admin')) {
    header("Location: index.php");
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
    <title>Gamity - Panel de Administración</title>
    <script src="js/config.js"></script>
    <script src="js/tailwind-config.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
</head>

<body class="flex h-screen overflow-hidden">

    <!-- Sidebar Navegación (Solo Desktop) -->
    <aside
        class="hidden md:flex w-20 md:w-64 flex-shrink-0 bg-surface neon-border-r flex-col items-center md:items-start transition-all duration-300">
        <div class="h-20 w-full flex items-center justify-center md:justify-start md:px-6 neon-border-b">
            <svg class="w-8 h-8 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z">
                </path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="hidden md:block ml-3 font-bold text-xl tracking-widest text-gamityPurple">GAMITY</span>
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
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
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
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
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
            <a href="admin.php"
                class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                    </path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="hidden md:block ml-3 font-medium">Admin</span>
            </a>

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

    <!-- Contenido Principal -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        <div
            class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-gamityPurple rounded-full blur-[150px] opacity-10 pointer-events-none">
        </div>

        <!-- Header -->
        <header
            class="h-20 w-full flex items-center justify-between px-8 neon-border-b relative z-10 header-glass bg-surface/50 backdrop-blur-md">
            <h1 class="text-2xl font-bold tracking-wide flex items-center gap-3">
                <svg class="w-7 h-7 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                    </path>
                </svg>
                Panel de Administración
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
                <div class="h-10 w-10 rounded-full bg-neon-gradient p-[2px]">
                    <div
                        class="h-full w-full rounded-full bg-surface flex items-center justify-center font-bold text-sm text-white">
                        <?php echo $initials; ?>
                    </div>
                </div>
            </div>
        </header>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative z-10">
            <div class="max-w-6xl mx-auto">

                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div class="stat-card bg-surface rounded-2xl p-6 border border-white/5">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-xl bg-gamityPurple/10 flex items-center justify-center">
                                <svg class="w-6 h-6 text-gamityPurple" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-3xl font-black" id="statUsers">-</p>
                        <p class="text-gray-400 text-sm mt-1">Usuarios totales</p>
                    </div>
                    <div class="stat-card bg-surface rounded-2xl p-6 border border-white/5">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-xl bg-gamityGreen/10 flex items-center justify-center">
                                <svg class="w-6 h-6 text-gamityGreen" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728M9.172 15.172a4 4 0 010-5.656m5.656 0a4 4 0 010 5.656M12 12h.01">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-3xl font-black" id="statOnline">-</p>
                        <p class="text-gray-400 text-sm mt-1">En línea</p>
                    </div>
                    <div class="stat-card bg-surface rounded-2xl p-6 border border-white/5">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-3xl font-black" id="statConnections">-</p>
                        <p class="text-gray-400 text-sm mt-1">Conexiones activas</p>
                    </div>
                    <div class="stat-card bg-surface rounded-2xl p-6 border border-white/5">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-3xl font-black" id="statMessages">-</p>
                        <p class="text-gray-400 text-sm mt-1">Mensajes</p>
                    </div>
                    <div class="stat-card bg-surface rounded-2xl p-6 border border-red-500/20">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <p class="text-3xl font-black" id="statReports">-</p>
                        <p class="text-gray-400 text-sm mt-1">Reportes pendientes</p>
                    </div>
                </div>

                <!-- Gráficos de Estadísticas -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Gráfico de Usuarios -->
                    <div class="bg-surface rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-gamityPurple/10 rounded-full blur-2xl"></div>
                        <h3 class="text-lg font-bold w-full text-left mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                            Estado de Usuarios
                        </h3>
                        <div class="w-full h-64 flex items-center justify-center">
                            <canvas id="usersChart"></canvas>
                        </div>
                    </div>

                    <!-- Gráfico de Actividad -->
                    <div class="bg-surface rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <h3 class="text-lg font-bold w-full text-left mb-4 flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            Actividad Reciente
                        </h3>
                        <div class="w-full h-64">
                            <canvas id="activityChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Tabla de usuarios -->
                <div class="bg-surface rounded-2xl border border-white/5 overflow-hidden">
                    <div class="p-6 neon-border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <h2 class="text-xl font-bold flex items-center gap-2">
                                <svg class="w-5 h-5 text-gamityPurple" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                    </path>
                                </svg>
                                Gestión de Usuarios
                            </h2>
                            <span id="tableCount"
                                class="px-3 py-1 bg-gamityPurple/20 text-gamityPurple text-xs rounded-full font-medium">0
                                usuarios</span>
                        </div>
                        <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <button onclick="exportUsersCSV()" class="px-4 py-2 bg-gamityPurple/10 hover:bg-gamityPurple hover:text-white text-gamityPurple border border-gamityPurple/20 transition-all rounded-xl text-sm font-bold flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Exportar CSV
                            </button>
                            <div class="relative w-full sm:w-auto">
                                <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input type="text" id="searchUsers" placeholder="Buscar usuario, email o rango..."
                                    class="input-gamity pl-10 w-full sm:w-64">
                            </div>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="neon-border-b text-gray-400 uppercase text-xs tracking-wider">
                                    <th class="px-6 py-4 text-left">ID</th>
                                    <th class="px-6 py-4 text-left">Usuario</th>
                                    <th class="px-6 py-4 text-left">Email</th>
                                    <th class="px-6 py-4 text-left">Juego</th>
                                    <th class="px-6 py-4 text-left">Rango</th>
                                    <th class="px-6 py-4 text-left">Rol</th>
                                    <th class="px-6 py-4 text-left">Estado</th>
                                    <th class="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="usersTableBody">
                                <tr>
                                    <td colspan="8" class="px-6 py-10 text-center text-gray-500">Cargando usuarios...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Paginación -->
                    <div id="usersPagination" class="p-4 border-t border-white/5 flex items-center justify-between">
                        <span id="paginationInfo" class="text-xs text-gray-400">Mostrando 0 de 0 usuarios</span>
                        <div class="flex items-center gap-2">
                            <button id="prevPageBtn" onclick="changeUsersPage(-1)" disabled
                                class="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-gamityPurple/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            <span id="pageIndicator"
                                class="text-xs font-bold text-gamityPurple bg-gamityPurple/10 px-3 py-1.5 rounded-full border border-gamityPurple/20">1
                                / 1</span>
                            <button id="nextPageBtn" onclick="changeUsersPage(1)" disabled
                                class="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-gamityPurple/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Premier Section - Partidas Disputadas -->
                <div id="premierSection"
                    class="bg-surface rounded-2xl border border-yellow-500/20 overflow-hidden mt-8 hidden">
                    <div class="p-6 neon-border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <h2 class="text-xl font-bold flex items-center gap-2">
                                <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Premier — Partidas Disputadas
                            </h2>
                            <span id="disputedCount"
                                class="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">0
                                disputas</span>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="neon-border-b text-gray-400 uppercase text-xs tracking-wider">
                                    <th class="px-6 py-4 text-left">Match ID</th>
                                    <th class="px-6 py-4 text-left">Equipo 1</th>
                                    <th class="px-6 py-4 text-left">Equipo 2</th>
                                    <th class="px-6 py-4 text-left">Reporte Eq1</th>
                                    <th class="px-6 py-4 text-left">Reporte Eq2</th>
                                    <th class="px-6 py-4 text-center">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="disputedMatchesBody">
                                <tr>
                                    <td colspan="6" class="px-6 py-10 text-center text-gray-500">No hay partidas
                                        disputadas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Reportes Section -->
                <div class="bg-surface rounded-2xl border border-white/5 overflow-hidden mt-8">
                    <div class="p-6 neon-border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <h2 class="text-xl font-bold flex items-center gap-2">
                                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9">
                                    </path>
                                </svg>
                                Reportes de Usuarios
                            </h2>
                            <span id="reportsCount"
                                class="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-medium">0
                                reportes</span>
                        </div>
                        <!-- Filtros Rápidos de Reportes -->
                        <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                            <button onclick="filterReports('all')" id="btnReportFilter-all"
                                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-all">Todos</button>
                            <button onclick="filterReports('pending')" id="btnReportFilter-pending"
                                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all">Pendientes</button>
                            <button onclick="filterReports('reviewed')" id="btnReportFilter-reviewed"
                                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all">Revisados</button>
                            <button onclick="filterReports('dismissed')" id="btnReportFilter-dismissed"
                                class="px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all">Descartados</button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="neon-border-b text-gray-400 uppercase text-xs tracking-wider">
                                    <th class="px-6 py-4 text-left">ID</th>
                                    <th class="px-6 py-4 text-left">Reportado por</th>
                                    <th class="px-6 py-4 text-left">Usuario reportado</th>
                                    <th class="px-6 py-4 text-left">Motivo</th>
                                    <th class="px-6 py-4 text-left">Estado</th>
                                    <th class="px-6 py-4 text-left">Fecha</th>
                                    <th class="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="reportsTableBody">
                                <tr>
                                    <td colspan="7" class="px-6 py-10 text-center text-gray-500">Cargando reportes...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Paginación Reportes -->
                    <div id="reportsPagination" class="p-4 border-t border-white/5 flex items-center justify-between">
                        <span id="reportsPaginationInfo" class="text-xs text-gray-400">Mostrando 0 de 0 reportes</span>
                        <div class="flex items-center gap-2">
                            <button id="prevReportsPageBtn" onclick="changeReportsPage(-1)" disabled
                                class="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-gamityPurple/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            <span id="reportsPageIndicator"
                                class="text-xs font-bold text-gamityPurple bg-gamityPurple/10 px-3 py-1.5 rounded-full border border-gamityPurple/20">1
                                / 1</span>
                            <button id="nextReportsPageBtn" onclick="changeReportsPage(1)" disabled
                                class="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-gamityPurple/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </main>

    <!-- Modal Editar Usuario -->
    <div id="editModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden items-center justify-center">
        <div class="bg-surface rounded-2xl border border-white/5 w-full max-w-lg mx-4 p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">Editar Usuario</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            <form id="editForm" class="space-y-4">
                <input type="hidden" id="editUserId">
                <div>
                    <label
                        class="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Username</label>
                    <input type="text" id="editUsername" class="w-full input-gamity">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Email</label>
                    <input type="email" id="editEmail" class="w-full input-gamity">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Rol</label>
                        <select id="editRole" class="w-full input-gamity appearance-none cursor-pointer">
                            <option value="0">Usuario</option>
                            <option value="1">Administrador</option>
                        </select>
                    </div>
                    <div>
                        <label
                            class="block text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Estado</label>
                        <select id="editStatus" class="w-full input-gamity appearance-none cursor-pointer">
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>
                </div>
                <div class="pt-4 border-t border-white/5 flex justify-end gap-3">
                    <button type="button" onclick="closeModal()"
                        class="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium">Cancelar</button>
                    <button type="submit"
                        class="px-6 py-2.5 rounded-xl bg-neon-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all text-sm">Guardar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Detalles de Reporte -->
    <div id="reportDetailsModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden items-center justify-center">
        <div class="bg-surface rounded-2xl border border-white/5 w-full max-w-lg mx-4 p-8 shadow-2xl relative">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold flex items-center gap-2">
                    <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9">
                        </path>
                    </svg>
                    Detalles del Reporte <span id="detailReportId" class="text-gray-500 font-mono text-lg">#0</span>
                </h3>
                <button onclick="closeReportDetailsModal()" class="text-gray-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            <div class="space-y-5">
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-surfaceLight/50 rounded-xl border border-white/5">
                        <span
                            class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Denunciante</span>
                        <div>
                            <p id="detailReporterName" class="font-bold text-white text-base"></p>
                            <p id="detailReporterId" class="text-xs text-gray-400 font-mono mt-0.5"></p>
                        </div>
                    </div>
                    <div class="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                        <span class="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Usuario
                            Reportado</span>
                        <div>
                            <p id="detailReportedName" class="font-bold text-white text-base"></p>
                            <p id="detailReportedId" class="text-xs text-red-400/80 font-mono mt-0.5"></p>
                        </div>
                    </div>
                </div>
                <div>
                    <span class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Fecha del
                        Reporte</span>
                    <p id="detailReportDate" class="text-sm text-gray-300"></p>
                </div>
                <div>
                    <span class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Motivo del
                        Reporte</span>
                    <div class="p-4 bg-surfaceLight rounded-xl border border-white/5 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto"
                        id="detailReportReason"></div>
                </div>
                <div>
                    <span class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Evidencia
                        (Últimos 10 mensajes)</span>
                    <div class="p-4 bg-[#18181b] rounded-xl border border-white/5 text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed max-h-60 overflow-y-auto"
                        id="detailReportEvidence"></div>
                </div>
                <div>
                    <span class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Estado del
                        Reporte</span>
                    <div id="detailReportStatusBadge"></div>
                </div>
                <div class="pt-6 border-t border-white/5 flex flex-wrap gap-2 justify-end">
                    <button type="button" onclick="closeReportDetailsModal()"
                        class="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium">Cerrar</button>
                    <div id="detailReportActions" class="flex gap-2"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div id="toastContainer" class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"></div>

    <script>
        const USER_ID = '<?php echo $_SESSION["user_id"]; ?>';
        const USER_HASH = '<?php echo hash("sha256", $_SESSION["user_id"] . "GAMITY_TFG_SECRET_2024"); ?>';

        // --- TOAST NOTIFICATION SYSTEM ---
        function showToast(message, type = 'success') {
            const colors = {
                success: 'bg-gamityGreen/20 border-gamityGreen/40 text-gamityGreen',
                error: 'bg-red-500/20 border-red-500/40 text-red-400',
                info: 'bg-gamityPurple/20 border-gamityPurple/40 text-gamityPurple'
            };
            const icons = {
                success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>',
                error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
                info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
            };
            const toast = document.createElement('div');
            toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl text-sm font-medium transition-all duration-300 translate-x-20 opacity-0 ${colors[type]}`;
            toast.innerHTML = `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[type]}</svg><span>${message}</span>`;
            document.getElementById('toastContainer').appendChild(toast);
            requestAnimationFrame(() => { toast.classList.remove('translate-x-20', 'opacity-0'); });
            setTimeout(() => {
                toast.classList.add('translate-x-20', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadDashboard();

            const searchInput = document.getElementById('searchUsers');
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    window.currentUsersPage = 1;
                    renderPaginatedUsers();
                });
            }
        });


        function loadDashboard() {
            fetch(`${window.GAMITY_API_URL}/admin/dashboard`, {
                headers: {
                    'X-User-Id': USER_ID,
                    'X-User-Hash': USER_HASH
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById('statUsers').textContent = data.stats.total_users;
                        document.getElementById('statOnline').textContent = data.stats.online_users;
                        document.getElementById('statConnections').textContent = data.stats.active_connections;
                        document.getElementById('statMessages').textContent = data.stats.total_messages;
                        document.getElementById('statReports').textContent = data.stats.pending_reports;
                        renderUsersTable(data.users);
                        renderReportsTable(data.reports || []);
                        renderDisputedMatches(data.disputed_matches || []);
                        initCharts(data.stats);
                    } else {
                        showToast(data.error || 'Error al cargar el panel', 'error');
                    }
                })
                .catch(() => showToast('No se puede conectar con el servidor API', 'error'));
        }

        let usersChartInstance = null;
        let activityChartInstance = null;

        function initCharts(stats) {
            Chart.defaults.color = '#9ca3af';
            Chart.defaults.font.family = "'Inter', sans-serif";
            
            // Gráfico de Usuarios (Donut)
            const usersCtx = document.getElementById('usersChart').getContext('2d');
            const offlineUsers = stats.total_users - stats.online_users;
            
            if (usersChartInstance) usersChartInstance.destroy();
            usersChartInstance = new Chart(usersCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Online', 'Offline'],
                    datasets: [{
                        data: [stats.online_users, offlineUsers],
                        backgroundColor: ['#10B981', '#4B5563'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
                    }
                }
            });

            // Gráfico de Actividad (Bar)
            const activityCtx = document.getElementById('activityChart').getContext('2d');
            
            if (activityChartInstance) activityChartInstance.destroy();
            activityChartInstance = new Chart(activityCtx, {
                type: 'bar',
                data: {
                    labels: ['Conexiones', 'Mensajes', 'Reportes', 'Disputas'],
                    datasets: [{
                        label: 'Métricas Totales',
                        data: [stats.active_connections, stats.total_messages, stats.pending_reports, stats.disputed_matches || 0],
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.8)', // blue
                            'rgba(234, 179, 8, 0.8)',  // yellow
                            'rgba(239, 68, 68, 0.8)',  // red
                            'rgba(139, 92, 246, 0.8)'  // purple
                        ],
                        borderRadius: 6,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }

        window.allUsers = [];
        window.currentUsersPage = 1;
        const usersPerPage = 10;

        function renderUsersTable(users) {
            window.allUsers = users;
            window.currentUsersPage = 1;
            document.getElementById('tableCount').textContent = `${users.length} usuarios`;
            renderPaginatedUsers();
        }

        function renderPaginatedUsers() {
            const tbody = document.getElementById('usersTableBody');

            // Search filter logic
            const searchTerm = (document.getElementById('searchUsers').value || '').toLowerCase();
            const filteredUsers = window.allUsers.filter(u =>
                u.username.toLowerCase().includes(searchTerm) ||
                u.email.toLowerCase().includes(searchTerm) ||
                (u.game_rank && u.game_rank.toLowerCase().includes(searchTerm)) ||
                (u.main_game && u.main_game.toLowerCase().includes(searchTerm))
            );

            const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
            if (window.currentUsersPage > totalPages) window.currentUsersPage = totalPages;

            const startIndex = (window.currentUsersPage - 1) * usersPerPage;
            const endIndex = startIndex + usersPerPage;
            const currentUsers = filteredUsers.slice(startIndex, endIndex);

            document.getElementById('paginationInfo').textContent = `Mostrando ${currentUsers.length > 0 ? startIndex + 1 : 0} a ${Math.min(endIndex, filteredUsers.length)} de ${filteredUsers.length} usuarios`;
            document.getElementById('pageIndicator').textContent = `${window.currentUsersPage} / ${totalPages}`;

            document.getElementById('prevPageBtn').disabled = window.currentUsersPage === 1;
            document.getElementById('nextPageBtn').disabled = window.currentUsersPage === totalPages;

            if (currentUsers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-10 text-center text-gray-500">No se encontraron usuarios.</td></tr>';
                return;
            }

            tbody.innerHTML = currentUsers.map(u => {
                const isOnline = u.status === 'online';
                const roleLabel = u.role === 'admin'
                    ? '<span class="px-2 py-1 rounded-full bg-gamityPurple/20 text-gamityPurple text-xs font-bold">Admin</span>'
                    : '<span class="px-2 py-1 rounded-full bg-surfaceLight text-gray-400 text-xs font-medium">Usuario</span>';
                const statusDot = isOnline
                    ? '<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gamityGreen shadow-[0_0_8px_#10B981]"></span> Online</span>'
                    : '<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gray-500"></span> Offline</span>';

                return `
                    <tr class="user-row neon-border-b hover:bg-white/[0.02] transition-colors">
                        <td class="px-6 py-4 text-gray-400 font-mono">#${u.id}</td>
                        <td class="px-6 py-4 font-semibold flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-gamityPurple/20 flex items-center justify-center text-gamityPurple font-bold text-xs">${u.username.substring(0, 2).toUpperCase()}</div>
                            ${u.username}
                        </td>
                        <td class="px-6 py-4 text-gray-300">${u.email}</td>
                        <td class="px-6 py-4 text-gray-300">${u.main_game || '-'}</td>
                        <td class="px-6 py-4 text-gray-300">${u.game_rank || '-'}</td>
                        <td class="px-6 py-4">${roleLabel}</td>
                        <td class="px-6 py-4 text-sm">${statusDot}</td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <button onclick="openEdit(${u.id}, '${u.username}', '${u.email}', '${u.role === 'admin' ? 1 : 0}', '${u.status}')" class="p-2 rounded-lg text-gray-400 hover:text-gamityPurple hover:bg-gamityPurple/10 transition-colors" title="Editar">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                </button>
                                <button onclick="deleteUser(${u.id}, '${u.username}')" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Eliminar">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function changeUsersPage(direction) {
            window.currentUsersPage += direction;
            renderPaginatedUsers();
        }

        function exportUsersCSV() {
            if (!window.allUsers || window.allUsers.length === 0) {
                showToast('No hay datos para exportar', 'error');
                return;
            }

            const headers = ['ID', 'Username', 'Email', 'Rol', 'Estado', 'Juego Principal', 'Rango'];
            const csvRows = [headers.join(',')];

            window.allUsers.forEach(u => {
                const row = [
                    u.id,
                    `"${u.username}"`,
                    `"${u.email}"`,
                    `"${u.role}"`,
                    `"${u.status}"`,
                    `"${u.main_game || ''}"`,
                    `"${u.game_rank || ''}"`
                ];
                csvRows.push(row.join(','));
            });

            const csvData = csvRows.join('\n');
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `gamity_users_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Archivo CSV descargado con éxito', 'success');
        }

        function openEdit(id, username, email, role, status) {
            document.getElementById('editUserId').value = id;
            document.getElementById('editUsername').value = username;
            document.getElementById('editEmail').value = email;
            document.getElementById('editRole').value = role;
            document.getElementById('editStatus').value = status;
            const modal = document.getElementById('editModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeModal() {
            const modal = document.getElementById('editModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = document.getElementById('editUserId').value;
            const body = {
                username: document.getElementById('editUsername').value,
                email: document.getElementById('editEmail').value,
                role: document.getElementById('editRole').value,
                status: document.getElementById('editStatus').value
            };

            fetch(`${window.GAMITY_API_URL}/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': USER_HASH
                },
                body: JSON.stringify(body)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        closeModal();
                        showToast('Usuario actualizado correctamente', 'success');
                        loadDashboard();
                    } else {
                        showToast(data.error || 'Error al actualizar usuario', 'error');
                    }
                })
                .catch(() => showToast('Error de conexión con la API', 'error'));
        });

        function deleteUser(userId, username) {
            if (!confirm(`¿Eliminar a "${username}"? Esta acción no se puede deshacer.`)) return;

            fetch(`${window.GAMITY_API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': USER_HASH
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showToast(`Usuario "${username}" eliminado`, 'info');
                        loadDashboard();
                    } else {
                        showToast(data.error || 'Error al eliminar usuario', 'error');
                    }
                })
                .catch(() => showToast('Error de conexión con la API', 'error'));
        }

        window.allReports = [];
        window.currentReportFilter = 'all';
        window.currentReportsPage = 1;
        const reportsPerPage = 10;

        function filterReports(status) {
            window.currentReportFilter = status;
            window.currentReportsPage = 1;
            const statuses = ['all', 'pending', 'reviewed', 'dismissed'];
            statuses.forEach(s => {
                const btn = document.getElementById(`btnReportFilter-${s}`);
                if (btn) {
                    if (s === status) {
                        btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-all';
                    } else {
                        btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all';
                    }
                }
            });
            renderPaginatedReports();
        }

        function renderReportsTable(reports) {
            window.allReports = reports;
            window.currentReportsPage = 1;
            renderPaginatedReports();
        }

        function renderPaginatedReports() {
            const tbody = document.getElementById('reportsTableBody');

            const filteredReports = window.allReports.filter(r => {
                if (window.currentReportFilter === 'all') return true;
                return r.status === window.currentReportFilter;
            });

            document.getElementById('reportsCount').textContent = `${filteredReports.length} reportes`;

            const totalPages = Math.ceil(filteredReports.length / reportsPerPage) || 1;
            if (window.currentReportsPage > totalPages) window.currentReportsPage = totalPages;

            const startIndex = (window.currentReportsPage - 1) * reportsPerPage;
            const endIndex = startIndex + reportsPerPage;
            const currentReports = filteredReports.slice(startIndex, endIndex);

            document.getElementById('reportsPaginationInfo').textContent = `Mostrando ${currentReports.length > 0 ? startIndex + 1 : 0} a ${Math.min(endIndex, filteredReports.length)} de ${filteredReports.length} reportes`;
            document.getElementById('reportsPageIndicator').textContent = `${window.currentReportsPage} / ${totalPages}`;

            document.getElementById('prevReportsPageBtn').disabled = window.currentReportsPage === 1;
            document.getElementById('nextReportsPageBtn').disabled = window.currentReportsPage === totalPages;

            if (currentReports.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-500">No hay reportes en esta categoría.</td></tr>';
                return;
            }

            tbody.innerHTML = currentReports.map(r => {
                const statusBadge = {
                    'pending': '<span class="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">Pendiente</span>',
                    'reviewed': '<span class="px-2 py-1 rounded-full bg-gamityGreen/20 text-gamityGreen text-xs font-bold">Revisado</span>',
                    'dismissed': '<span class="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">Descartado</span>'
                };
                const date = new Date(r.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

                return `
                    <tr class="user-row neon-border-b cursor-pointer hover:bg-white/[0.02] transition-colors" onclick="openReportDetails(${r.id})">
                        <td class="px-6 py-4 text-gray-400 font-mono">#${r.id}</td>
                        <td class="px-6 py-4 font-semibold">${r.reporter_name}</td>
                        <td class="px-6 py-4 text-red-400 font-semibold">${r.reported_name}</td>
                        <td class="px-6 py-4 text-gray-300 max-w-xs truncate">${r.reason}</td>
                        <td class="px-6 py-4">${statusBadge[r.status] || r.status}</td>
                        <td class="px-6 py-4 text-gray-400 text-xs">${date}</td>
                        <td class="px-6 py-4 text-center" onclick="event.stopPropagation()">
                            <div class="flex items-center justify-center gap-2">
                                <button onclick="openReportDetails(${r.id})" class="p-2 rounded-lg text-gray-400 hover:text-gamityPurple hover:bg-gamityPurple/10 transition-colors" title="Ver Detalles">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                </button>
                                ${r.status === 'pending' ? `
                                    <button onclick="updateReportStatus(${r.id}, 'reviewed')" class="p-2 rounded-lg text-gray-400 hover:text-gamityGreen hover:bg-gamityGreen/10 transition-colors" title="Marcar revisado">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                    </button>
                                    <button onclick="updateReportStatus(${r.id}, 'dismissed')" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Descartar">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                ` : '-'}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function changeReportsPage(direction) {
            window.currentReportsPage += direction;
            renderPaginatedReports();
        }

        function openReportDetails(reportId) {
            const report = (window.allReports || []).find(r => r.id === reportId);
            if (!report) return;

            document.getElementById('detailReportId').textContent = `#${report.id}`;
            document.getElementById('detailReporterName').textContent = report.reporter_name;
            document.getElementById('detailReporterId').textContent = report.reporter_id ? `ID: #${report.reporter_id}` : 'ID: N/A';
            document.getElementById('detailReportedName').textContent = report.reported_name;
            document.getElementById('detailReportedId').textContent = report.reported_id ? `ID: #${report.reported_id}` : 'ID: N/A';

            const date = new Date(report.created_at).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            document.getElementById('detailReportDate').textContent = date;
            document.getElementById('detailReportReason').textContent = report.reason;
            document.getElementById('detailReportEvidence').textContent = report.evidence || 'No se adjuntó evidencia.';

            const statusBadgeContainer = document.getElementById('detailReportStatusBadge');
            const statusBadges = {
                'pending': '<span class="px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Pendiente de Revisión</span>',
                'reviewed': '<span class="px-3 py-1.5 rounded-full bg-gamityGreen/20 text-gamityGreen text-xs font-bold inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gamityGreen"></span> Revisado</span>',
                'dismissed': '<span class="px-3 py-1.5 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gray-500"></span> Descartado</span>'
            };
            statusBadgeContainer.innerHTML = statusBadges[report.status] || report.status;

            const actionsContainer = document.getElementById('detailReportActions');
            if (report.status === 'pending') {
                actionsContainer.innerHTML = `
                    <button onclick="updateReportStatus(${report.id}, 'dismissed'); closeReportDetailsModal();" 
                        class="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium">
                        Denegar
                    </button>
                    <button onclick="updateReportStatus(${report.id}, 'reviewed'); closeReportDetailsModal();" 
                        class="px-4 py-2 bg-gamityGreen/10 hover:bg-gamityGreen border border-gamityGreen/30 text-gamityGreen hover:text-white rounded-xl text-sm font-bold transition-all">
                        Aceptar
                    </button>
                    ${report.reported_id ? `
                        <button onclick="deleteUserFromReport(${report.reported_id}, '${report.reported_name}', ${report.id})" 
                            class="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-500 hover:text-white rounded-xl text-sm font-bold transition-all">
                            Sancionar y Eliminar
                        </button>
                    ` : ''}
                `;
            } else {
                actionsContainer.innerHTML = `
                    <span class="text-xs text-gray-400 font-medium italic self-center">Procesado</span>
                `;
            }

            const modal = document.getElementById('reportDetailsModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeReportDetailsModal() {
            const modal = document.getElementById('reportDetailsModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function deleteUserFromReport(userId, username, reportId) {
            if (!confirm(`¿Eliminar al usuario "${username}"? Esta acción no se puede deshacer y resolverá el reporte.`)) return;

            fetch(`${window.GAMITY_API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': USER_HASH
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showToast(`Usuario "${username}" eliminado y reporte resuelto`, 'success');
                        closeReportDetailsModal();
                        loadDashboard();
                    } else {
                        showToast(data.error || 'Error al eliminar usuario', 'error');
                    }
                })
                .catch(() => showToast('Error de conexión con la API', 'error'));
        }

        function updateReportStatus(reportId, newStatus) {
            const label = newStatus === 'reviewed' ? 'revisado' : 'descartado';
            fetch(`${window.GAMITY_API_URL}/admin/reports/${reportId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': USER_HASH
                },
                body: JSON.stringify({ status: newStatus })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showToast(`Reporte marcado como ${label}`, 'success');
                        loadDashboard();
                    } else {
                        showToast(data.error || 'Error al actualizar reporte', 'error');
                    }
                })
                .catch(() => showToast('Error de conexión con la API', 'error'));
        }

        function renderDisputedMatches(matches) {
            const premierSection = document.getElementById('premierSection');
            const tbody = document.getElementById('disputedMatchesBody');
            document.getElementById('disputedCount').textContent = `${matches.length} disputas`;

            if (matches.length > 0) {
                premierSection.classList.remove('hidden');
            } else {
                premierSection.classList.add('hidden');
                return;
            }

            tbody.innerHTML = matches.map(m => {
                const team1ReportedWinner = m.team1_reported_winner ? 'Ganador: Equipo ' + m.team1_reported_winner : 'No reportado';
                const team2ReportedWinner = m.team2_reported_winner ? 'Ganador: Equipo ' + m.team2_reported_winner : 'No reportado';

                return `
                    <tr class="user-row neon-border-b hover:bg-white/[0.02] transition-colors">
                        <td class="px-6 py-4 text-yellow-400 font-mono">#${m.id}</td>
                        <td class="px-6 py-4 font-bold text-white">${m.team1_name}</td>
                        <td class="px-6 py-4 font-bold text-white">${m.team2_name}</td>
                        <td class="px-6 py-4 text-gray-300">
                            <span class="px-3 py-1 bg-surfaceLight border border-white/5 rounded-lg text-xs font-medium block w-max">${team1ReportedWinner}</span>
                        </td>
                        <td class="px-6 py-4 text-gray-300">
                            <span class="px-3 py-1 bg-surfaceLight border border-white/5 rounded-lg text-xs font-medium block w-max">${team2ReportedWinner}</span>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <button onclick="resolveDisputedMatch(${m.id}, ${m.team1_id})" class="px-3 py-2 rounded-xl bg-gamityPurple/10 hover:bg-gamityPurple/30 text-gamityPurple border border-gamityPurple/20 transition-all text-xs font-bold" title="Dar victoria al Equipo 1">
                                    Gana Eq 1
                                </button>
                                <button onclick="resolveDisputedMatch(${m.id}, ${m.team2_id})" class="px-3 py-2 rounded-xl bg-gamityGreen/10 hover:bg-gamityGreen/30 text-gamityGreen border border-gamityGreen/20 transition-all text-xs font-bold" title="Dar victoria al Equipo 2">
                                    Gana Eq 2
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        function resolveDisputedMatch(matchId, winnerTeamId) {
            if (!confirm('¿Estás seguro de resolver esta disputa dando la victoria a este equipo?')) return;

            fetch(`${window.GAMITY_API_URL}/admin/matches/${matchId}/resolve`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': USER_HASH
                },
                body: JSON.stringify({ winner_team_id: winnerTeamId })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showToast('Disputa resuelta correctamente', 'success');
                        loadDashboard();
                    } else {
                        showToast(data.error || 'Error al resolver la disputa', 'error');
                    }
                })
                .catch(() => showToast('Error de conexión con la API', 'error'));
        }
    </script>

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
            <a href="premier.php"
                class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span class="text-[10px] font-medium">Premier</span>
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

    <script src="js/app.js"></script>
</body>

</html>