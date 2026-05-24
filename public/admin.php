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
    <?php include 'admin_sidebar.php'; ?>

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

                <?php include 'admin_stats.php'; ?>

                <?php include 'admin_users_table.php'; ?>

                <?php include 'admin_premier_section.php'; ?>

                <?php include 'admin_reports_section.php'; ?>

            </div>
        </div>
    </main>
    <?php include 'admin_modals.php'; ?>

    <!-- Toast Container -->
    <div id="toastContainer" class="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none"></div>

    <script>
        window.USER_ID = '<?php echo $_SESSION["user_id"]; ?>';
        window.USER_HASH = '<?php echo hash("sha256", $_SESSION["user_id"] . "GAMITY_TFG_SECRET_2024"); ?>';
    </script>
    <script src="js/admin-core.js"></script>
    <script src="js/admin-users.js"></script>
    <script src="js/admin-reports.js"></script>
    <script src="js/admin-premier.js"></script>

    <script src="js/app.js"></script>
</body>

</html>