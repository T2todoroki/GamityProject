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
