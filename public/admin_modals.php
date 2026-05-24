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
            <div id="detailRecidivismBadge" class="hidden p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl items-center gap-3 animate-pulse">
                <svg class="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <p class="text-sm text-yellow-400 font-bold" id="detailRecidivismText"></p>
            </div>
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
