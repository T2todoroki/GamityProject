document.addEventListener('DOMContentLoaded', () => {

    const contentMyTeam = document.getElementById('contentMyTeam');

    window.loadMyTeam = function(id) {
        fetch(`${window.GAMITY_API_URL}/tournaments/${id}/team`, {
            headers: { 
                'X-User-Id': window.currentUserId,
                'X-User-Hash': window.currentUserHash || ''
            }
        })
            .then(async res => {
                const text = await res.text();
                if (!text) return null;
                try { return JSON.parse(text); } 
                catch (e) { console.error("Invalid JSON:", text); return null; }
            })
            .then(data => {
                if (!data) return;
                if (!data.has_team) {
                    if (window.isRegisteredToActive) {
                        // El usuario está en cola
                        contentMyTeam.innerHTML = `
                            <div class="bg-surface p-10 rounded-2xl border border-gamityPurple/30 text-center animate-premierFadeIn shadow-[0_0_20px_rgba(139,92,246,0.1)] relative overflow-hidden">
                                <div class="absolute inset-0 shimmer-bg opacity-50"></div>
                                <div class="relative z-10">
                                    <i class="fa-solid fa-shield-halved text-6xl text-gamityPurple mb-6 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] animate-pulse"></i>
                                    <h3 class="text-2xl font-bold text-white mb-2">Construyendo Escuadrón</h3>
                                    <p class="text-gray-400 mb-6 max-w-md mx-auto">El algoritmo Snake está evaluando a los jugadores en la cola para asignarte el equipo más equilibrado posible.</p>
                                    <span class="text-xs text-gamityPurple font-bold bg-gamityPurple/10 border border-gamityPurple/20 inline-block px-4 py-2 rounded-full flex items-center justify-center gap-2 max-w-max mx-auto">
                                        <i class="fa-solid fa-microchip"></i> Matchmaking Activo
                                    </span>
                                </div>
                            </div>
                        `;
                    } else {
                        // El usuario no está en cola (Estado inicial - Se maneja en el HTML, pero por si acaso recarga)
                        contentMyTeam.innerHTML = `
                            <div class="bg-surface p-10 rounded-2xl border border-white/10 text-center animate-premierFadeIn">
                                <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gamityPurple/10 border border-gamityPurple/20 flex items-center justify-center">
                                    <i class="fa-solid fa-shield-halved text-4xl text-gamityPurple/50 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"></i>
                                </div>
                                <h3 class="text-xl font-bold text-white mb-2">Aún no estás en el campo de batalla.</h3>
                                <p class="text-gray-400 max-w-md mx-auto">Ve a la pestaña <span class="text-gamityPurple font-semibold">Buscar Partida</span> para unirte a la cola y ser asignado a un escuadrón.</p>
                            </div>
                        `;
                    }
                    return;
                }

                // El usuario ya tiene equipo
                const team = data.team;
                const isCaptain = team.captainId == window.currentUserId;

                let membersHtml = data.members.map(m => `
                <div class="flex items-center justify-between p-4 bg-surfaceLight rounded-xl border border-white/5 hover:border-gamityPurple/30 transition-colors group">
                    <div class="flex items-center gap-4">
                        <img src="${m.avatar}" class="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-gamityPurple transition-colors">
                        <div>
                            <p class="font-bold text-white text-lg">${m.username}</p>
                            ${team.captainId == m.id ? '<span class="text-xs text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded flex items-center gap-1 w-max mt-1"><i class="fa-solid fa-crown"></i> Capitán</span>' : '<span class="text-xs text-gray-500 font-medium mt-1 block">Miembro</span>'}
                        </div>
                    </div>
                </div>
            `).join('');

                const reportBtnHtml = isCaptain ? `
                    <button onclick="reportMatch(${team.id})" class="px-6 py-2 bg-gamityPurple/10 border border-gamityPurple/30 text-gamityPurple font-bold rounded-xl text-sm transition-all duration-300 ease-in-out hover:bg-gamityPurple hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center gap-2">
                        <i class="fa-solid fa-flag-checkered"></i> Reportar Resultado
                    </button>
                ` : `
                    <div class="px-6 py-2 bg-surfaceLight border border-white/5 text-gray-500 font-bold rounded-xl text-sm flex items-center gap-2" title="Solo el capitán puede reportar el resultado">
                        <i class="fa-solid fa-lock"></i> Reporte (Solo Capitán)
                    </div>
                `;

                contentMyTeam.innerHTML = `
                <div class="bg-surface rounded-2xl border border-white/5 overflow-hidden animate-premierFadeIn shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                    <div class="p-8 border-b border-white/5 bg-gradient-to-r from-surface to-surfaceLight flex justify-between items-center relative overflow-hidden">
                        <div class="absolute -right-20 -top-20 w-64 h-64 bg-gamityPurple/5 rounded-full blur-[50px] pointer-events-none"></div>
                        <div>
                            <h3 class="text-xs font-black text-gamityPurple tracking-widest uppercase mb-1 flex items-center gap-2">
                                <i class="fa-solid fa-shield-halved"></i> Tu Escuadrón
                            </h3>
                            <h2 class="text-4xl font-black text-white flex items-center gap-3">
                                <i class="fa-solid fa-users text-2xl text-gray-600"></i>
                                ${team.name}
                            </h2>
                        </div>
                        ${reportBtnHtml}
                    </div>
                    <div class="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2 space-y-4">
                            <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <i class="fa-solid fa-clipboard-user"></i> Roster
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                ${membersHtml}
                            </div>
                        </div>
                        <div class="space-y-6">
                            <div class="bg-surfaceLight border border-gamityPurple/20 p-6 rounded-2xl shadow-inner relative overflow-hidden group">
                                <div class="absolute -right-2 -bottom-2 text-gamityPurple/5 text-7xl pointer-events-none group-hover:text-gamityPurple/10 transition-colors z-0">
                                    <i class="fa-solid fa-comments"></i>
                                </div>
                                <div class="relative z-10">
                                    <h4 class="text-gamityPurple font-black text-xl mb-2 flex items-center gap-2">
                                        <i class="fa-solid fa-message"></i> Centro de Mando
                                    </h4>
                                    <p class="text-sm text-gray-400 mb-6 leading-relaxed">Comunícate con tus compañeros para planear estrategias y ganar la partida.</p>
                                    <button onclick="openTeamChat(${team.id})" class="w-full py-4 bg-gamityPurple/10 border border-gamityPurple/30 text-gamityPurple font-bold rounded-xl text-sm transition-all duration-300 ease-in-out hover:bg-gamityPurple hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2">
                                        Abrir Chat Grupal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            })
            .catch(err => console.error(err));
    }

    window.closeReportModal = function() {
        const modal = document.getElementById('report-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.reportMatch = function (myTeamId) {
        if (!window.premierActiveTournamentId) return;

        const modal = document.getElementById('report-modal');
        const winBtn = document.getElementById('confirmWinBtn');
        const lossBtn = document.getElementById('confirmLossBtn');
        
        if (!modal || !winBtn || !lossBtn) return;

        modal.classList.remove('hidden');

        const processReport = function(winnerId, btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
            btn.disabled = true;
            winBtn.disabled = true;
            lossBtn.disabled = true;

            fetch(`${window.GAMITY_API_URL}/tournaments/${window.premierActiveTournamentId}/bracket`, {
                headers: { 
                    'X-User-Id': window.currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            })
                .then(async res => {
                    const text = await res.text();
                    if (!text) return null;
                    try { return JSON.parse(text); } 
                    catch (e) { console.error("Invalid JSON:", text); return null; }
                })
                .then(data => {
                    if (!data) {
                        window.showToast('Error de conexión al cargar la partida.', 'error');
                        closeReportModal();
                        return;
                    }
                    if (data.matches && data.matches.length > 0) {
                        const match = data.matches[data.matches.length - 1];
                        const matchId = match.id;
                        
                        // Si reporta derrota, el ganador es el otro equipo
                        let finalWinnerId = winnerId;
                        if (winnerId === 'other') {
                            finalWinnerId = (match.team1Id == myTeamId) ? match.team2Id : match.team1Id;
                        }

                        fetch(`${window.GAMITY_API_URL}/tournaments/match/${matchId}/report`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-User-Id': window.currentUserId,
                                'X-User-Hash': window.currentUserHash || ''
                            },
                            body: JSON.stringify({ winnerTeamId: parseInt(finalWinnerId) })
                        })
                            .then(async res => {
                                const text = await res.text();
                                if (!text) return null;
                                try { return JSON.parse(text); } 
                                catch (e) { console.error("Invalid JSON:", text); return null; }
                            })
                            .then(reportData => {
                                closeReportModal();
                                if (reportData?.success) {
                                    if (reportData.tournamentFinished) {
                                        // ¡Partida terminada! Mostrar celebración
                                        const isWinner = reportData.winnerId == myTeamId;
                                        window.showCelebration(isWinner);
                                    } else if (reportData.matchStatus === 'disputed') {
                                        window.showToast('⚠️ Los reportes no coinciden. Partida en disputa.', 'warning', 6000);
                                    } else {
                                        window.showToast('Reporte enviado. Esperando al otro equipo...', 'info', 5000);
                                    }
                                    window.loadMyTeam(window.premierActiveTournamentId);
                                } else {
                                    window.showToast(reportData?.message || 'Error al reportar', 'error');
                                }
                            })
                            .catch(err => { console.error(err); closeReportModal(); });
                    } else {
                        window.showToast('No se encontró la partida activa.', 'warning');
                        closeReportModal();
                    }
                }).catch(err => { console.error(err); closeReportModal(); });
        };

        winBtn.onclick = () => processReport(myTeamId, winBtn);
        lossBtn.onclick = () => processReport('other', lossBtn);
    };

});
