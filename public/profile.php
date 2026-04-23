<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: auth.php");
    exit;
}
$username = $_SESSION['username'];
$initials = strtoupper(substr($username, 0, 2));

// Obtener lista de avatares disponibles de la carpeta valorant
$valorantAvatars = [];
$avatarDir = __DIR__ . '/img/valorant';
if (is_dir($avatarDir)) {
    $files = scandir($avatarDir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $valorantAvatars[] = 'img/valorant/' . $file;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gamity - Mi Perfil</title>
    <script src="js/tailwind-config.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/profile.css">
</head>
<body class="flex h-screen overflow-hidden">

    <!-- Sidebar Navegación (Solo Desktop) -->
    <aside class="hidden md:flex w-20 md:w-64 flex-shrink-0 bg-surface neon-border-r flex-col items-center md:items-start transition-colors duration-300 z-20">
        <div class="h-20 w-full flex items-center justify-center md:justify-start md:px-6 neon-border-b">
            <svg class="w-8 h-8 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="hidden md:block ml-3 font-bold text-xl tracking-widest text-gamityPurple">GAMITY</span>
        </div>
        <nav class="flex-1 w-full py-6 flex flex-col gap-2 px-3">
            <a href="index.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Inicio</span>
            </a>
            <a href="chat.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Mensajes</span>
            </a>
            <a href="social.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Social</span>
            </a>
            <a href="profile.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Perfil</span>
            </a>
            <?php if (isset($_SESSION['user_role']) && ($_SESSION['user_role'] == 1 || $_SESSION['user_role'] === 'admin')): ?>
            <a href="admin.php" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-gray-400 hover:text-gamityPurple hover:bg-surfaceLight transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Admin</span>
            </a>
            <?php endif; ?>
            <a href="logout.php" id="logoutBtn" class="flex items-center justify-center md:justify-start px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors mt-auto">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span class="hidden md:block ml-3 font-medium">Salir</span>
            </a>
        </nav>
    </aside>

    <main class="flex-1 flex flex-col h-full overflow-hidden relative">
        <!-- Efecto Neón Ambiental -->
        <div class="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-gamityPurple rounded-full blur-[200px] opacity-10 pointer-events-none"></div>

        <!-- Top Header -->
        <header class="h-20 w-full flex items-center justify-end px-4 md:px-8 neon-border-b header-glass bg-surface/50 backdrop-blur-md z-10">
            <div class="flex items-center gap-6">
                <button id="themeToggle" class="p-2 text-gray-400 hover:text-gamityPurple transition-colors rounded-full hover:bg-surfaceLight">
                    <svg id="themeIconDark" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    <svg id="themeIconLight" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                </button>
                <div class="h-10 w-10 rounded-full bg-neon-gradient p-[2px]">
                    <div class="h-full w-full rounded-full bg-surface flex items-center justify-center font-bold text-sm text-white profile-initials overflow-hidden">
                        <img id="headerAvatar" src="" class="w-full h-full object-cover hidden">
                        <span id="headerInitials"><?php echo $initials; ?></span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Contenido Scrollable -->
        <div class="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 w-full">
            <div class="max-w-4xl mx-auto pb-24 md:pb-20 w-full">

                <h1 class="text-3xl font-bold mb-8">Editar Perfil</h1>

                <!-- Profile Banner + Avatar Header -->
                <div class="relative w-full rounded-2xl overflow-hidden mb-10">
                    <!-- Gradient Banner -->
                    <div class="w-full h-36 md:h-44" style="background: linear-gradient(135deg, #0a0a0b 0%, #1e1033 50%, #3b1d6b 100%);"></div>

                    <!-- Avatar overlapping the banner -->
                    <div class="flex flex-col items-center -mt-16 md:-mt-20 relative z-10">
                        <!-- Circle with camera overlay on hover -->
                        <div class="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer group" onclick="openAvatarModal()">
                            <img id="profileAvatar" src="https://ui-avatars.com/api/?name=<?php echo urlencode($username); ?>&background=18181b&color=fff&size=200" 
                                 class="w-full h-full rounded-full border-4 border-white object-cover shadow-2xl">
                            <!-- Small camera overlay - only visible on hover, stays inside the circle -->
                            <div class="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <svg class="w-7 h-7 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <div class="mt-4 flex flex-col items-center pb-6">
                            <h2 class="text-2xl md:text-3xl font-black text-white"><?php echo htmlspecialchars($username); ?></h2>
                            <p class="text-gamityGreen font-medium mt-1 flex items-center gap-2 text-sm" id="profileEmailDisplay">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                Cargando...
                            </p>
                    </div>
                </div>