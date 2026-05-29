document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los botones de los tabs
    const tabTournament = document.getElementById('tabTournament');
    const tabMyTeam = document.getElementById('tabMyTeam');
    const tabBracket = document.getElementById('tabBracket');

    // Referencias a los contenedores
    const contentTournament = document.getElementById('contentTournament');
    const contentMyTeam = document.getElementById('contentMyTeam');
    const contentBracket = document.getElementById('contentBracket');

    // Estado global compartido entre archivos
    window.premierActiveTournamentId = null;
    window.premierMatchmakingInterval = null;

    // Sistema de notificaciones Toast (reemplaza alert())
    window.showToast = function(message, type = 'info', duration = 4000) {
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
    window.showCelebration = function(isWinner) {
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
        window.premierActiveTournamentId = null;
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
        if (window.premierActiveTournamentId) window.loadMyTeam(window.premierActiveTournamentId);
    });
    tabBracket.addEventListener('click', () => {
        switchTab(tabBracket, contentBracket);
        loadHallOfFame();
    });

    // Cargar Torneo Activo al inicio
    loadActiveTournament();

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
                    if (window.premierMatchmakingInterval) { clearInterval(window.premierMatchmakingInterval); window.premierMatchmakingInterval = null; }
                    return; // Cortocircuito para que no intente leer data.active
                }
                
                if (data.active && data.tournament) {
                    window.premierActiveTournamentId = data.tournament.id;
                    window.isRegisteredToActive = data.registered;

                    if (data.tournament.status === 'active' || data.tournament.status === 'finished' || data.tournament.status === 'awaiting_reports') {
                        if (window.premierMatchmakingInterval) { clearInterval(window.premierMatchmakingInterval); window.premierMatchmakingInterval = null; }
                        switchTab(tabMyTeam, contentMyTeam);
                        window.loadMyTeam(window.premierActiveTournamentId);
                    } else {
                        renderMatchmakingQueue(data);
                        if (data.registered && !window.premierMatchmakingInterval) {
                            window.premierMatchmakingInterval = setInterval(loadActiveTournament, 3000);
                        } else if (!data.registered && window.premierMatchmakingInterval) {
                            clearInterval(window.premierMatchmakingInterval);
                            window.premierMatchmakingInterval = null;
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
                    
                    ${['admin', 'demo'].includes(window.currentUserRole) ? `
                    <button onclick="forceMatchmaking()" class="mt-8 text-xs text-gray-500 hover:text-gamityPurple hover:underline transition-colors flex items-center justify-center gap-2 mx-auto">
                        <i class="fa-solid fa-terminal"></i> [Dev] Forzar Matchmaking (Añadir 9 Bots)
                    </button>` : ''}
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
                    window.showToast(data?.message || 'Error al buscar partida', 'error');
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
                    window.showToast(data?.message || 'Error al cancelar la cola', 'error');
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
                    window.showToast(data?.message || 'Error al forzar matchmaking', 'error');
                }
            })
            .catch(err => console.error(err));
    };

});
