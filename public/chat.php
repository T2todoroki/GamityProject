<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: auth.php");
    exit;
}
$selectedUserId = $_GET['user_id'] ?? null;
?>
<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamity - Mensajes</title>
    <script src="js/tailwind-config.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
</head>
<body class="flex h-screen overflow-hidden">
    
    <!-- Sidebar Navegación Global (Solo Desktop) -->
    <aside class="hidden md:flex w-16 md:w-20 flex-shrink-0 bg-surface neon-border-r flex-col items-center transition-all duration-300 z-20">
        <div class="h-20 w-full flex items-center justify-center neon-border-b">
            <svg class="w-8 h-8 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <nav class="flex-1 w-full py-6 flex flex-col items-center gap-4">
            <a href="index.php" class="p-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors" title="Inicio">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </a>
            <a href="chat.php" class="p-3 rounded-xl bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-colors" title="Chats">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            </a>
            <a href="social.php" class="p-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors" title="Social">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            </a>
            <a href="profile.php" class="p-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors" title="Perfil">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </a>
            <?php if (isset($_SESSION['user_role']) && ($_SESSION['user_role'] == 1 || $_SESSION['user_role'] === 'admin')): ?>
            <a href="admin.php" class="p-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors" title="Admin">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </a>
            <?php
endif; ?>
            <a href="logout.php" class="p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors mt-auto" title="Salir">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </a>
        </nav>
    </aside>

    <!-- Content Chat Area -->
    <main class="flex-1 flex bg-gamityDark relative">
        <!-- Abstract gradient background -->
        <div class="absolute top-[0%] right-[0%] w-[500px] h-[500px] bg-gamityPurple rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

        <!-- Sidebar Contactos -->
        <aside class="hidden md:flex w-80 flex-shrink-0 bg-surface/50 border-r border-white/5 flex-col backdrop-blur-md relative z-10">
            <div class="p-6 neon-border-b flex items-center justify-between">
                <h2 class="text-xl font-bold mb-0">Mensajes</h2>
                <!-- Modo Claro/Oscuro Toggle -->
                <button id="themeToggle" class="p-2 text-gray-400 hover:text-gamityPurple transition-colors rounded-full hover:bg-surfaceLight -mr-2">
                    <svg id="themeIconDark" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    <svg id="themeIconLight" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </button>
            </div>
            <div class="p-6 neon-border-b pt-4">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input type="text" id="searchContact" placeholder="Buscar conversación..." class="block w-full pl-9 pr-3 py-2 border border-purple-500/25 rounded-full leading-5 bg-[#1f2937] text-white placeholder-gray-400 focus:outline-none focus:border-gamityPurple text-sm">
                </div>
            </div>
            <div id="contactsList" class="flex-1 overflow-y-auto">
                <!-- Javascript inyectará los contactos (amigos) aquí -->
                <div class="flex justify-center items-center h-20 opacity-50">
                    <svg class="animate-spin h-5 w-5 text-gamityPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
            </div>
        </aside>

        <!-- Chat Principal -->
        <section class="flex-1 flex flex-col bg-gamityDark/50 backdrop-blur-sm relative z-10" id="chatSection">
            <!-- Esto se mostrará si no hay chat seleccionado -->
            <div id="noChatSelected" class="flex-1 flex flex-col items-center justify-center text-gray-500">
                <svg class="w-20 h-20 mb-4 opacity-30 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <h3 class="text-xl font-medium text-white mb-2">Tus mensajes</h3>
                <p>Selecciona un chat o inicia una nueva conversación.</p>
            </div>

            <!-- Cabecera de Chat Activo -->
            <header id="chatHeader" class="h-20 neon-border-b flex items-center justify-between px-6 bg-surface/50 hidden">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <img id="chatAvatar" src="" alt="Avatar" class="w-10 h-10 rounded-full border border-gamityPurple/30 object-cover">
                        <div id="chatStatusDot" class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface bg-gamityGreen"></div>
                    </div>
                    <div>
                        <h3 id="chatName" class="font-bold text-white flex items-center gap-2">Usuario</h3>
                        <p id="chatSubtitle" class="text-xs text-gamityGreen flex items-center"><span class="w-1.5 h-1.5 rounded-full bg-gamityGreen mr-1.5"></span> En línea <span class="text-gray-500 ml-2 border-l border-white/10 pl-2">Juego - Rango</span></p>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-white transition p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                </button>
            </header>

            <!-- Historial de Mensajes -->
            <div id="chatMessages" class="flex-1 overflow-y-auto p-6 space-y-4 hidden flex-col">
                <!-- Javascript inyectará burbujas aquí -->
            </div>

            <!-- Input de Chat -->
            <div id="chatInputSection" class="p-6 hidden">
                <form id="sendMessageForm" class="flex gap-4 items-end bg-surfaceLight rounded-2xl border border-white/10 p-2 relative shadow-lg">
                    <input type="hidden" id="currentReceiverId" name="receiver_id" value="">
                    <button type="button" class="p-3 text-gray-400 hover:text-gamityPurple transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </button>
                    <textarea id="messageInput" name="content" rows="1" placeholder="Escribe un mensaje..." class="flex-1 bg-transparent border-none focus:ring-0 resize-none text-white placeholder-gray-500 py-3 block w-full"></textarea>
                    <button type="submit" class="p-3 bg-gamityPurple text-white rounded-xl hover:bg-gamityPurple/80 transition transform hover:scale-105 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                        <svg class="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                    </button>
                </form>
            </div>
        </section>
    </main>

    <script>
        window.currentUserId = <?php echo $_SESSION['user_id']; ?>;
        window.prepopulatedUserId = <?php echo $selectedUserId ? $selectedUserId : 'null'; ?>;
        window.apiBaseUrl = 'http://localhost:8082/api/v1';
    </script>
    <!-- Bottom Navigation Bar (Solo Móvil) -->
    <nav class="fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0b]/90 backdrop-blur-md border-t border-purple-500/20 md:hidden" style="padding-bottom: env(safe-area-inset-bottom, 12px)">
        <div class="flex items-center justify-around h-16">
            <a href="index.php" class="flex flex-col items-center gap-1 text-gray-400 hover:text-gamityPurple transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span class="text-[10px] font-medium">Inicio</span>
            </a>
            <a href="chat.php" class="flex flex-col items-center gap-1 text-gamityPurple transition-colors relative">
                <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gamityPurple shadow-[0_0_6px_rgba(139,92,246,0.8)]"></div>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="text-[10px] font-bold">Chats</span>
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

    <script src="js/chat.js?v=<?php echo filemtime('js/chat.js'); ?>"></script>
    <script src="js/app.js?v=<?php echo filemtime('js/app.js'); ?>"></script>
</body>
</html>
