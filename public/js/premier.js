document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los botones de los tabs
    const tabTournament = document.getElementById('tabTournament');
    const tabMyTeam = document.getElementById('tabMyTeam');
    const tabBracket = document.getElementById('tabBracket');

    // Referencias a los contenedores
    const contentTournament = document.getElementById('contentTournament');
    const contentMyTeam = document.getElementById('contentMyTeam');
    const contentBracket = document.getElementById('contentBracket');

    // Estado global de Premier
    let activeTournamentId = null;

    // Sistema de notificaciones Toast (reemplaza alert())
    function showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            info: 'fa-circle-info',
            warning: 'fa-triangle-exclamation'
        };
        const colors = {
            success: 'border-green-500/40 bg-green-500/10 text-green-400',
            error: 'border-red-500/40 bg-red-500/10 text-red-400',
            info: 'border-gamityPurple/40 bg-gamityPurple/10 text-gamityPurple',
            warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
        };

        const toast = document.createElement('div');
        toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[type] || colors.info} animate-premierFadeIn transition-all duration-500`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.info} text-xl"></i>
            <span class="text-sm font-semibold text-white">${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 500);
        }, duration);
    }

    // Pantalla de Celebración Victoria/Derrota
    function showCelebration(isWinner) {
        const modal = document.getElementById('celebration-modal');
        const inner = document.getElementById('celebration-inner');
        if (!modal || !inner) return;

        if (isWinner) {
            inner.innerHTML = `
                <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 border-2 border-yellow-500/50 flex items-center justify-center animate-bounce">
                    <i class="fa-solid fa-trophy text-5xl text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]"></i>
                </div>
                <h2 class="text-3xl font-black text-white mb-2">¡VICTORIA!</h2>
                <p class="text-yellow-400 font-bold text-lg mb-1">+1 Victoria Premier</p>
                <p class="text-gray-400 text-sm mb-8">Tu estadística se ha actualizado automáticamente en tu perfil.</p>
                <div class="flex gap-2 justify-center flex-wrap">
                    <span class="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold rounded-full"><i class="fa-solid fa-star mr-1"></i> Premier Win</span>
                    <span class="px-3 py-1 bg-gamityPurple/10 border border-gamityPurple/30 text-gamityPurple text-xs font-bold rounded-full"><i class="fa-solid fa-medal mr-1"></i> Badge CHAMPION</span>
                </div>
                <button onclick="closeCelebrationAndReset()" class="mt-8 w-full py-3 rounded-xl bg-gamityPurple text-white font-bold hover:bg-purple-600 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                    <i class="fa-solid fa-arrow-right mr-2"></i> Volver al Lobby
                </button>
            `;
        } else {
            inner.innerHTML = `
                <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center">
                    <i class="fa-solid fa-skull text-5xl text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]"></i>
                </div>
                <h2 class="text-3xl font-black text-white mb-2">DERROTA</h2>
                <p class="text-red-400 font-bold text-lg mb-1">Mejor suerte la próxima</p>
                <p class="text-gray-400 text-sm mb-8">No te desanimes, cada partida es una oportunidad de mejorar.</p>
                <button onclick="closeCelebrationAndReset()" class="mt-4 w-full py-3 rounded-xl bg-surfaceLight text-white font-bold hover:bg-white/10 transition-colors">
                    <i class="fa-solid fa-rotate-right mr-2"></i> Buscar Nueva Partida
                </button>
            `;
        }

        modal.classList.remove('hidden');
    }

    window.closeCelebrationAndReset = function() {
        const modal = document.getElementById('celebration-modal');
        if (modal) modal.classList.add('hidden');
        // Resetear al lobby para buscar nueva partida
        activeTournamentId = null;
        switchTab(tabTournament, contentTournament);
        loadActiveTournament();
    };

    // Lógica de Tabs
    function switchTab(activeBtn, activeContent) {
        // Reiniciar botones
        [tabTournament, tabMyTeam, tabBracket].forEach(btn => {
            btn.classList.remove('tab-active', 'bg-gamityPurple', 'text-white');
            btn.classList.add('tab-inactive', 'text-gray-400', 'hover:text-white');
        });

        // Activar el botón actual
        activeBtn.classList.remove('tab-inactive', 'text-gray-400', 'hover:text-white');
        activeBtn.classList.add('tab-active', 'bg-gamityPurple', 'text-white');

        // Ocultar todos los contenedores
        [contentTournament, contentMyTeam, contentBracket].forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('animate-premierFadeIn');
        });

        // Mostrar el contenedor seleccionado
        activeContent.classList.remove('hidden');
        activeContent.classList.add('animate-premierFadeIn');
    }

    tabTournament.addEventListener('click', () => switchTab(tabTournament, contentTournament));
    tabMyTeam.addEventListener('click', () => {
        switchTab(tabMyTeam, contentMyTeam);
        if (activeTournamentId) loadMyTeam(activeTournamentId);
    });
    tabBracket.addEventListener('click', () => {
        switchTab(tabBracket, contentBracket);
        loadHallOfFame();
    });

    // Cargar Torneo Activo al inicio
    loadActiveTournament();

    let matchmakingInterval = null;

    function loadActiveTournament() {
        fetch(`${window.GAMITY_API_URL}/tournaments/active`, {
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
                if (!data || data.success === false || data.status === 'idle' || !data.tournament) {
                    // El servidor está vacío o devolvió error de no encontrado. Estado normal de reposo.
                    renderMatchmakingQueue({ tournament: { id: null, maxPlayers: 10 }, registered: false, current_players: 0 });
                    if (matchmakingInterval) { clearInterval(matchmakingInterval); matchmakingInterval = null; }
                    return; // Cortocircuito para que no intente leer data.active
                }
                
                if (data.active && data.tournament) {
                    activeTournamentId = data.tournament.id;
                    window.isRegisteredToActive = data.registered;

                    if (data.tournament.status === 'active' || data.tournament.status === 'finished' || data.tournament.status === 'awaiting_reports') {
                        if (matchmakingInterval) { clearInterval(matchmakingInterval); matchmakingInterval = null; }
                        switchTab(tabMyTeam, contentMyTeam);
                        loadMyTeam(activeTournamentId);
                    } else {
                        renderMatchmakingQueue(data);
                        if (data.registered && !matchmakingInterval) {
                            matchmakingInterval = setInterval(loadActiveTournament, 3000);
                        } else if (!data.registered && matchmakingInterval) {
                            clearInterval(matchmakingInterval);
                            matchmakingInterval = null;
                        }
                    }
                } else {
                    renderMatchmakingQueue({ tournament: { id: null, maxPlayers: 10 }, registered: false, current_players: 0 });
                }
            })
            .catch(err => {
                console.error(err);
                renderMatchmakingQueue({ tournament: { id: null, maxPlayers: 10 }, registered: false, current_players: 0 });
            });
    }

    function renderMatchmakingQueue(data) {
        const t = data?.tournament || { id: null, maxPlayers: 10 };
        let actionHtml = '';

        if (data?.registered) {
            actionHtml = `
                <div class="relative w-full max-w-sm mx-auto mt-8 p-1 rounded-2xl shimmer-bg">
                    <div class="bg-surface rounded-xl p-6 text-center border border-gamityPurple/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden">
                        
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-gamityPurple/20 rounded-full blur-[30px]"></div>
                        
                        <div class="relative z-10">
                            <div class="w-16 h-16 mx-auto mb-4 border-2 border-gamityPurple/30 rounded-full flex items-center justify-center relative">
                                <div class="absolute inset-0 border-t-2 border-gamityPurple rounded-full radar-spin"></div>
                                <i class="fa-solid fa-satellite-dish text-gamityPurple animate-pulse"></i>
                            </div>
                            
                            <h4 class="text-white font-bold text-lg mb-1 glow-text">Buscando jugadores...</h4>
                            <p class="text-3xl font-black text-gamityPurple font-mono tracking-widest mt-2">${data.current_players}<span class="text-gray-500 text-xl">/${t.maxPlayers || 10}</span></p>
                            <p class="text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">Buscando una partida equilibrada</p>
                            <button onclick="cancelarMatchmaking(${t.id})" class="mt-6 w-full py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500/20 transition-colors">
                                Cancelar Búsqueda
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const btnAction = t.id ? `onclick="buscarPartida(${t.id})"` : `onclick="forceMatchmaking()"`;
            actionHtml = `
                <button ${btnAction} class="btn-premier-glow group relative w-full max-w-sm mx-auto mt-8 py-5 rounded-2xl bg-gamityPurple text-white font-black text-xl overflow-hidden transition-all transform hover:scale-[1.02]">
                    <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <span class="relative z-10 flex items-center justify-center gap-3">
                        <i class="fa-solid fa-play"></i>
                        BUSCAR PARTIDA PREMIER
                    </span>
                </button>
            `;
        }

        contentTournament.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-b from-gamityPurple/10 to-transparent rounded-3xl border border-gamityPurple/20 relative overflow-hidden animate-premierFadeIn">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200px] bg-gamityPurple/20 blur-[100px] rounded-full pointer-events-none"></div>
                
                <i class="fa-solid fa-crosshairs text-7xl text-gamityPurple mb-6 drop-shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-pulse"></i>
                <h3 class="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">MATCHMAKING <span class="text-gamityPurple">EXPRESS</span></h3>
                <p class="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed">Encuentra una partida 5v5 equilibrada al instante. Gana, acumula victorias y conquista el Salón de la Fama.</p>
                
                <div class="w-full relative z-10">
                    ${actionHtml}
                    
                    <button onclick="forceMatchmaking()" class="mt-8 text-xs text-gray-500 hover:text-gamityPurple hover:underline transition-colors flex items-center justify-center gap-2 mx-auto">
                        <i class="fa-solid fa-terminal"></i> [Dev] Forzar Matchmaking (Añadir 9 Bots)
                    </button>
                </div>
            </div>
        `;
    }

    window.buscarPartida = function (id) {
        if (!id) return;
        fetch(`${window.GAMITY_API_URL}/tournaments/${id}/register`, {
            method: 'POST',
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
                if (data?.success) {
                    loadActiveTournament();
                } else {
                    showToast(data?.message || 'Error al buscar partida', 'error');
                }
            })
            .catch(err => console.error(err));
    };

    window.cancelarMatchmaking = function (id) {
        if (!id) return;
        fetch(`${window.GAMITY_API_URL}/tournaments/${id}/register`, {
            method: 'DELETE',
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
                if (data?.success) {
                    loadActiveTournament();
                } else {
                    showToast(data?.message || 'Error al cancelar la cola', 'error');
                }
            })
            .catch(err => console.error(err));
    };

    window.forceMatchmaking = function () {
        fetch(`${window.GAMITY_API_URL}/tournaments/matchmaking/force`, {
            method: 'POST',
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
                if (data?.success) {
                    loadActiveTournament();
                } else {
                    showToast(data?.message || 'Error al forzar matchmaking', 'error');
                }
            })
            .catch(err => console.error(err));
    };

    function loadMyTeam(id) {
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
                                <div class="absolute -right-6 -bottom-6 text-gamityPurple/5 text-9xl pointer-events-none group-hover:text-gamityPurple/10 transition-colors">
                                    <i class="fa-solid fa-comments"></i>
                                </div>
                                <div class="relative z-10">
                                    <h4 class="text-gamityPurple font-black text-xl mb-2 flex items-center gap-2">
                                        <i class="fa-solid fa-message"></i> Centro de Mando
                                    </h4>
                                    <p class="text-sm text-gray-400 mb-6 leading-relaxed">Comunícate con tus compañeros para planear estrategias y ganar la partida.</p>
                                    <button onclick="openTeamChat(${team.id})" class="w-full py-4 bg-gamityPurple/10 border border-gamityPurple/30 text-gamityPurple font-bold rounded-xl text-sm transition-all duration-300 ease-in-out hover:bg-gamityPurple hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2">
                                        Abrir Chat Grupal <i class="fa-solid fa-arrow-right"></i>
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
        if (!activeTournamentId) return;

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

            fetch(`${window.GAMITY_API_URL}/tournaments/${activeTournamentId}/bracket`, {
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
                        showToast('Error de conexión al cargar la partida.', 'error');
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
                                        showCelebration(isWinner);
                                    } else if (reportData.matchStatus === 'disputed') {
                                        showToast('⚠️ Los reportes no coinciden. Partida en disputa.', 'warning', 6000);
                                    } else {
                                        showToast('Reporte enviado. Esperando al otro equipo...', 'info', 5000);
                                    }
                                    loadMyTeam(activeTournamentId);
                                } else {
                                    showToast(reportData?.message || 'Error al reportar', 'error');
                                }
                            })
                            .catch(err => { console.error(err); closeReportModal(); });
                    } else {
                        showToast('No se encontró la partida activa.', 'warning');
                        closeReportModal();
                    }
                }).catch(err => { console.error(err); closeReportModal(); });
        };

        winBtn.onclick = () => processReport(myTeamId, winBtn);
        lossBtn.onclick = () => processReport('other', lossBtn);
    };


    window.loadHallOfFame = function() {
        contentBracket.innerHTML = `
            <div class="bg-surface p-8 rounded-2xl border border-white/10 text-center py-16 animate-pulse">
                <i class="fa-solid fa-spinner fa-spin text-4xl text-gamityPurple/50 mb-4"></i>
                <p class="text-gray-400 text-sm">Cargando Campeones...</p>
            </div>
        `;
        
        fetch(`${window.GAMITY_API_URL}/tournaments/champions`)
            .then(async res => {
                const text = await res.text();
                if (!text) return null;
                try { return JSON.parse(text); } 
                catch (e) { console.error("Invalid JSON:", text); return null; }
            })
            .then(data => {
                if (!data || data.length === 0) {
                    contentBracket.innerHTML = `
                        <div class="bg-surface p-12 rounded-3xl border border-white/10 text-center py-20 animate-premierFadeIn relative overflow-hidden">
                            <i class="fa-solid fa-ghost text-6xl text-gray-600 mb-6 relative z-10"></i>
                            <h3 class="text-2xl font-bold text-gray-300 mb-2 relative z-10">Aún no hay campeones en Matchmaking</h3>
                            <p class="text-gray-500 max-w-md mx-auto relative z-10">¡Entra a la cola, gana tu primera partida 5v5 y graba tu nombre en la historia de Gamity!</p>
                        </div>
                    `;
                    return;
                }

                let historyHtml = data.map((c, index) => {
                    const isLatest = index === 0;
                    return `
                    <div class="flex items-center justify-between p-5 bg-surfaceLight rounded-2xl border ${isLatest ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/5 hover:border-gamityPurple/30'} transition-all group">
                        <div class="flex items-center gap-5">
                            <div class="w-14 h-14 rounded-xl ${isLatest ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-surface border border-white/10 text-gamityPurple group-hover:border-gamityPurple/50'} flex items-center justify-center transition-colors">
                                <i class="fa-solid fa-crown text-2xl ${isLatest ? 'drop-shadow-md' : ''}"></i>
                            </div>
                            <div>
                                <h4 class="font-black ${isLatest ? 'text-yellow-500 text-xl' : 'text-white text-lg'}">${c.winner_team || 'Equipo Campeón'}</h4>
                                <p class="text-xs text-gray-400 flex items-center gap-2 mt-1">
                                    <i class="fa-solid fa-calendar text-gray-500"></i> ${new Date(c.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div class="text-right hidden sm:block">
                            <span class="inline-block px-4 py-1.5 rounded-lg ${isLatest ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20'} text-xs font-bold tracking-wider uppercase">
                                <i class="fa-solid fa-trophy mr-1"></i> Victoria 5v5
                            </span>
                        </div>
                    </div>
                `}).join('');

                contentBracket.innerHTML = `
                <div class="bg-surface p-8 md:p-10 rounded-3xl border border-white/10 animate-premierFadeIn shadow-xl">
                    <div class="flex flex-col md:flex-row items-center justify-between mb-10 pb-8 border-b border-white/5 gap-4">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-gamityPurple/10 rounded-2xl border border-gamityPurple/30 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                                <i class="fa-solid fa-medal text-4xl text-gamityPurple"></i>
                            </div>
                            <div>
                                <h3 class="text-3xl font-black text-white tracking-tight">Salón de la Fama</h3>
                                <p class="text-sm text-gray-400 mt-1">Los últimos campeones del Matchmaking Express</p>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4 max-w-4xl mx-auto">
                        ${historyHtml}
                    </div>
                </div>
            `;
            })
            .catch(err => {
                console.error(err);
                contentBracket.innerHTML = `
                    <div class="bg-surface p-8 rounded-2xl border border-red-500/20 text-center text-red-400 py-10">
                        <i class="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
                        <p>Error al cargar el Salón de la Fama.</p>
                    </div>
                `;
            });
    }

    // Chat Logic
    let chatInterval = null;
    let currentTeamChatId = null;

    window.openTeamChat = function (teamId) {
        currentTeamChatId = teamId;
        if (chatInterval) clearInterval(chatInterval);

        document.getElementById('chat-modal').classList.remove('hidden');
        fetchMessages(teamId); // Fetch immediately

        chatInterval = setInterval(() => {
            fetchMessages(teamId);
        }, 3000);
    };

    window.closeChat = function () {
        if (chatInterval) clearInterval(chatInterval);
        currentTeamChatId = null;
        document.getElementById('chat-modal').classList.add('hidden');
    };

    function fetchMessages(teamId) {
        fetch(`${window.GAMITY_API_URL}/tournaments/teams/${teamId}/chat`, {
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
            .then(messages => {
                if (!messages || !Array.isArray(messages)) return;
                const container = document.getElementById('chat-messages');
                container.innerHTML = messages.map(m => {
                    const isMe = m.user_id == window.currentUserId;
                    return `
                    <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                        <div class="flex gap-3 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}">
                            <img src="${m.avatar}" class="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10 mt-1">
                            <div class="${isMe ? 'bg-gamityPurple text-white' : 'bg-surfaceLight border border-white/5 text-gray-200'} px-4 py-2.5 rounded-2xl ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'} shadow-sm">
                                ${!isMe ? `<p class="text-[11px] ${isMe ? 'text-white/70' : 'text-gamityPurple'} font-bold mb-1 tracking-wide">${m.username}</p>` : ''}
                                <p class="text-sm leading-relaxed">${m.content}</p>
                            </div>
                        </div>
                    </div>
                `;
                }).join('');
                container.scrollTop = container.scrollHeight;
            })
            .catch(err => console.error('Error fetching chat', err));
    }

    document.getElementById('chat-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const content = input.value.trim();
        if (!content || !currentTeamChatId) return;

        fetch(`${window.GAMITY_API_URL}/tournaments/teams/${currentTeamChatId}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': window.currentUserId,
                'X-User-Hash': window.currentUserHash || ''
            },
            body: JSON.stringify({ content: content })
        })
            .then(async res => {
                const text = await res.text();
                if (!text) return null;
                try { return JSON.parse(text); } 
                catch (e) { console.error("Invalid JSON:", text); return null; }
            })
            .then(data => {
                if (data?.success) {
                    input.value = '';
                    fetchMessages(currentTeamChatId);
                }
            });
    });

});
