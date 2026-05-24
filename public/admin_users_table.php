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
