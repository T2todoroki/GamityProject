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
    <title>Gamity - Social</title>
    <script src="js/tailwind-config.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
</head>
<body class="flex h-screen overflow-hidden">
    
    <!-- Sidebar Navegación (Solo Desktop) -->
    <aside class="hidden md:flex w-20 md:w-64 flex-shrink-0 bg-surface neon-border-r flex-col items-center md:items-start transition-all duration-300 z-20 relative">
        <div class="h-20 w-full flex items-center justify-center md:justify-start md:px-6 neon-border-b">
            <svg class="w-8 h-8 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="hidden md:block ml-3 font-bold text-xl tracking-widest text-white">GAMITY</span>
        </div>

        <nav class="flex-1 w-full py-6 flex flex-col gap-2 px-3">
            <a href="index.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Inicio</span>
            </a>
            <a href="chat.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Chats</span>
            </a>

            <a href="social.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-colors">
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

    <main class="flex-1 flex flex-col relative overflow-hidden">
        <!-- Abstract gradient background -->
        <div class="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-gamityPurple rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

        <header class="h-20 w-full flex items-center justify-between px-8 neon-border-b relative z-10 header-glass bg-surface/50 backdrop-blur-md">
            <h1 class="text-2xl font-bold tracking-wide">Social</h1>
            <button id="themeToggle" class="p-2 text-gray-400 hover:text-gamityPurple transition-colors rounded-full hover:bg-surfaceLight">
                <svg id="themeIconDark" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                <svg id="themeIconLight" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </button>
        </header>

        <div class="flex-1 overflow-y-auto p-8 pb-24 md:pb-8 relative z-10">
            <div class="max-w-3xl mx-auto">
                
                <!-- Tabs -->
                <div class="flex w-full bg-surfaceLight rounded-xl p-1 mb-8 overflow-hidden border border-white/5">
                    <button id="tabRequests" class="flex-1 py-3 tab-btn tab-active rounded-lg flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        Solicitudes
                    </button>
                    <button id="tabFriends" class="flex-1 py-3 tab-btn tab-inactive rounded-lg flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        Amigos
                    </button>
                </div>

                 <!-- Contenedores -->
                <div id="contentRequests" class="space-y-4">
                    <!-- Javascript inyectará las solicitudes aquí -->
                    <div class="flex flex-col items-center justify-center py-20 opacity-50">
                        <svg class="animate-spin h-8 w-8 text-gamityPurple mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p>Cargando información...</p>
                    </div>
                </div>

                <div id="contentFriends" class="space-y-4 hidden">
                    <!-- Javascript inyectará amigos aquí -->
                </div>

            </div>
        </div>
    </main>

     <!-- Bottom Navigation Bar (Solo Móvil) -->
    <nav class="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0b]/90 backdrop-blur-md border-t border-purple-500/20 md:hidden" style="padding-bottom: env(safe-area-inset-bottom, 12px)">
        <div class="flex items-center justify-around h-16">
            <a href="index.php" class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span class="text-[10px] font-medium">Inicio</span>
            </a>
            <a href="chat.php" class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="text-[10px] font-medium">Chats</span>
            </a>
            <a href="social.php" class="flex flex-col items-center gap-1 text-gamityPurple transition-colors relative">
                <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gamityPurple shadow-[0_0_6px_rgba(139,92,246,0.8)]"></div>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span class="text-[10px] font-bold">Social</span>
            </a>
            <a href="profile.php" class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span class="text-[10px] font-medium">Perfil</span>
            </a>
        </div>
    </nav>s