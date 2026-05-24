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
    <div class="stat-card bg-surface rounded-2xl p-6 border border-red-500/20 cursor-pointer hover:bg-red-500/5 transition-colors group" onclick="scrollToReports()">
        <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
