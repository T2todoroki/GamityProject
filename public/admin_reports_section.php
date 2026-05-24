<!-- Reportes Section -->
<div class="bg-surface rounded-2xl border border-white/5 overflow-hidden mt-8 transition-all duration-500 shadow-lg relative group/panel" id="reportsPanelContainer">
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none group-hover/panel:bg-red-500/10 transition-colors duration-500"></div>
    
    <!-- Header Desplegable -->
    <div class="p-6 neon-border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors relative z-10" onclick="toggleReportsPanel()">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover/panel:bg-red-500/20 group-hover/panel:scale-105 transition-all duration-300 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9">
                    </path>
                </svg>
            </div>
            <div>
                <h2 class="text-xl font-bold flex items-center gap-2 group-hover/panel:text-red-400 transition-colors">
                    Panel de Reportes
                </h2>
                <p class="text-sm text-gray-400 mt-0.5">Gestiona y revisa las denuncias de la comunidad</p>
            </div>
            <span id="reportsCount"
                class="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full font-bold ml-2 shadow-[0_0_10px_rgba(239,68,68,0.2)] border border-red-500/30">0
                reportes</span>
        </div>
        <div class="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
            <!-- Filtros Rápidos de Reportes (Stop propagation so click doesn't toggle panel) -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" onclick="event.stopPropagation()">
                <button onclick="exportReportsCSV()" class="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 transition-all hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Exportar CSV
                </button>
                <div class="w-px h-4 bg-white/10 mx-1 hidden sm:block"></div>
                <button onclick="filterReports('all')" id="btnReportFilter-all"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]">Todos</button>
                <button onclick="filterReports('pending')" id="btnReportFilter-pending"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all hover:bg-yellow-500/10 hover:border-yellow-500/30 hover:text-yellow-400">Pendientes</button>
                <button onclick="filterReports('reviewed')" id="btnReportFilter-reviewed"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all hover:bg-gamityGreen/10 hover:border-gamityGreen/30 hover:text-gamityGreen">Revisados</button>
                <button onclick="filterReports('dismissed')" id="btnReportFilter-dismissed"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all hover:bg-gray-500/20 hover:border-gray-500/50 hover:text-gray-300">Descartados</button>
            </div>
            <button class="p-2 rounded-full bg-surfaceLight text-gray-400 group-hover/panel:text-white transition-colors border border-white/5 hover:bg-white/10" id="reportsToggleBtn">
                <svg id="reportsToggleIcon" class="w-5 h-5 transform transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
        </div>
    </div>

    <!-- Contenido del Panel -->
    <div id="reportsPanelContent" class="hidden opacity-0 transform -translate-y-4 transition-all duration-300 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-white/5 bg-black/10">
            <div class="col-span-1 flex flex-col items-center justify-center relative">
                <h3 class="text-xs font-bold text-gray-400 mb-2 w-full text-left uppercase tracking-wider">Motivos de Reporte</h3>
                <div class="w-full h-40 flex items-center justify-center">
                    <canvas id="reportsReasonChart"></canvas>
                </div>
            </div>
            <div class="col-span-1 md:col-span-2 flex flex-col justify-center">
                <div class="bg-surfaceLight/50 rounded-xl p-5 border border-white/5 text-sm text-gray-400 h-full flex flex-col justify-center">
                    <h4 class="text-white font-bold mb-3 flex items-center gap-2 text-base">
                        <svg class="w-5 h-5 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Resumen de Denuncias
                    </h4>
                    <p class="mb-3 leading-relaxed">Este panel te permite visualizar la distribución de los motivos por los que los usuarios están siendo reportados en la plataforma. Identifica patrones de comportamiento tóxico rápidamente.</p>
                    <p class="leading-relaxed">Al hacer clic en cualquier fila de la tabla inferior, podrás revisar el detalle del reporte, la evidencia adjunta, y verificar si el infractor cuenta con <strong>historial de reincidencia</strong> para tomar decisiones justas.</p>
                </div>
            </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="neon-border-b text-gray-400 uppercase text-xs tracking-wider bg-black/20">
                        <th class="px-6 py-4 text-left font-semibold">ID</th>
                        <th class="px-6 py-4 text-left font-semibold">Reportado por</th>
                        <th class="px-6 py-4 text-left font-semibold">Usuario reportado</th>
                        <th class="px-6 py-4 text-left font-semibold">Motivo</th>
                        <th class="px-6 py-4 text-left font-semibold">Estado</th>
                        <th class="px-6 py-4 text-left font-semibold">Fecha</th>
                        <th class="px-6 py-4 text-center font-semibold">Acciones</th>
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
        <div id="reportsPagination" class="p-4 border-t border-white/5 flex items-center justify-between bg-black/10">
            <span id="reportsPaginationInfo" class="text-xs text-gray-400">Mostrando 0 de 0 reportes</span>
            <div class="flex items-center gap-2">
                <button id="prevReportsPageBtn" onclick="changeReportsPage(-1)" disabled
                    class="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-gamityPurple/30 hover:bg-gamityPurple/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <span id="reportsPageIndicator"
                    class="text-xs font-bold text-gamityPurple bg-gamityPurple/10 px-3 py-1.5 rounded-full border border-gamityPurple/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">1
                    / 1</span>
                <button id="nextReportsPageBtn" onclick="changeReportsPage(1)" disabled
                    class="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-gamityPurple/30 hover:bg-gamityPurple/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
