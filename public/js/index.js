document.addEventListener('DOMContentLoaded', async () => {


    // Fetch del perfil global para mostrar el avatar en el header
    try {
        if (typeof currentUserId !== 'undefined' && currentUserId !== null) {
            const globalRes = await fetch(`${window.GAMITY_API_URL}/users/${currentUserId}/profile`, {
                headers: {
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            const globalData = await globalRes.json();
            if (globalData.success && globalData.profile.avatar) {
                document.getElementById('headerAvatar').src = globalData.profile.avatar;
            }
        }
    } catch (e) { }

    // Elementos del DOM
    const usersGrid = document.getElementById('usersGrid');
    const playerCount = document.getElementById('playerCount');
    const filters = {
        game: document.getElementById('filterGame'),
        rank: document.getElementById('filterRank'),
        attitude: document.getElementById('filterAttitude'),
        search: document.getElementById('searchInput')
    };
    // Función para obtener usuarios desde la API de Java con filtros
    const fetchUsers = async () => {
        if (typeof currentUserId === 'undefined' || currentUserId === null) return;

        // Construimos los parámetros de consulta basados en los filtros seleccionados
        const params = new URLSearchParams();
        if (filters.game.value) params.append('game', filters.game.value);
        if (filters.rank.value) params.append('rankGroup', filters.rank.value);
        if (filters.attitude.value) params.append('attitude', filters.attitude.value);
        params.append('currentUserId', currentUserId);


        try {
            const API_BASE = window.GAMITY_API_URL ? window.GAMITY_API_URL.replace('/v1', '') : '';
            const response = await fetch(`${API_BASE}/matches?${params.toString()}`, {
                headers: {
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            if (!response.ok) throw new Error("Error en la conexión a Java");
            const data = await response.json();

            // Mapeamos el DTO de Spring Boot al formato de las Cards del Front
            //
            const adaptedUsers = data.map(u => ({
                id: u.id,
                username: u.username,
                avatar: u.avatar,
                main_game: u.game,
                game_rank: u.rank,
                attitude: u.attitude,
                status: u.status || 'offline', 
                friendship_status: null,
                badges: u.badges || [],
                premier_wins: u.premierWins || 0
            }));

            renderUsers(adaptedUsers);
        } catch (error) {
            console.error("Error fetching matches from Java API:", error);
            usersGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Error de conexión con el Matchmaking Server (Spring Boot).<br><small class="text-gray-400">Detalle: ${error.message}</small></div>`;
        }
    };
    // Función para renderizar las cards de usuario en el DOM
    const renderUsers = (users) => {
        playerCount.textContent = `${users.length} jugadores`;

        if (users.length === 0) {
            usersGrid.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                    <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                    <p>No se encontraron jugadores con esos filtros.</p>
                </div>
            `;
            return;
        }
        // Renderizamos cada usuario en una card
        usersGrid.innerHTML = users.map(user => {
            // Parse games and ranks from JSON
            let games = [];
            let ranks = [];
            if (user.main_game && user.main_game !== 'null') {
                try { games = JSON.parse(user.main_game); } catch (e) { games = [user.main_game]; }
            }
            if (user.game_rank && user.game_rank !== 'null') {
                try { ranks = JSON.parse(user.game_rank); } catch (e) { ranks = [user.game_rank]; }
            }
            if (!Array.isArray(games)) games = games ? [games] : [];
            if (!Array.isArray(ranks)) ranks = ranks ? [ranks] : [];

            // Función para obtener clase e ícono según el juego
            function getGameBadge(gameName) {
                if (gameName === 'Valorant') return { cls: 'badge-valorant', icon: '🔥' };
                if (gameName === 'LoL' || gameName === 'League of Legends') return { cls: 'badge-lol', icon: '⚔️' };
                if (gameName === 'CS2') return { cls: 'badge-cs2', icon: '🎯' };
                if (gameName === 'Minecraft') return { cls: 'badge-minecraft', icon: '⛏️' };
                if (gameName === 'Fortnite') return { cls: 'badge-fortnite', icon: '🎮' };
                return { cls: 'badge-default', icon: '🎲' };
            }

            // Build badges HTML
            let badgesHTML = '';
            if (games.length === 0) {
                badgesHTML = `<div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold badge-default"><span class="mr-1.5">🎲</span>Cualquier Juego - Unranked</div>`;
            } else {
                badgesHTML = games.map((g, i) => {
                    if (!g) return '';
                    const badge = getGameBadge(g);
                    const rank = ranks[i] || 'N/A';
                    return `<div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.cls}"><span class="mr-1.5">${badge.icon}</span>${g} - ${rank}</div>`;
                }).filter(Boolean).join('');
                if (!badgesHTML) {
                    badgesHTML = `<div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold badge-default"><span class="mr-1.5">🎲</span>Cualquier Juego - Unranked</div>`;
                }
            }

            const escapeJSString = (str) => {
                if (!str) return '';
                return str.toString()
                    .replace(/\\/g, '\\\\')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, "\\'")
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r');
            };

            const escapeHTML = (str) => {
                if (!str) return '';
                return str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
            };

            // Determinar clase y texto de estado
            const isOnline = user.status === 'online';
            const statusClass = isOnline ? 'status-online' : 'status-offline';
            const statusText = isOnline ? 'Online' : 'Offline';

            // Determinar URL de avatar (fallback a UI Avatars si no hay avatar personalizado)
            const avatarUrl = user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURI(user.username)}&background=18181b&color=fff`;
            const attitudeHTML = user.attitude ? `<span class="text-xs text-red-500 font-medium ml-2">${escapeHTML(user.attitude)}</span>` : '';

            // Generate Premier Badges
            let premierBadgesHTML = '';
            if (user.badges && user.badges.length > 0) {
                const uniqueBadges = [...new Set(user.badges)];
                uniqueBadges.forEach(badge => {
                    if (badge === 'CHAMPION') {
                        premierBadgesHTML += `<span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold text-[10px] shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center gap-1"><i class="fa-solid fa-gem text-cyan-300"></i> Campeón</span>`;
                    } else if (badge === 'PREMIER_GOLD') {
                        premierBadgesHTML += `<span class="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-bold text-[10px] shadow-[0_0_10px_rgba(234,179,8,0.3)] flex items-center gap-1"><i class="fa-solid fa-medal text-yellow-400"></i> Oro</span>`;
                    } else if (badge === 'PREMIER_SILVER') {
                        premierBadgesHTML += `<span class="px-2 py-0.5 rounded-full bg-gray-400/20 text-gray-300 border border-gray-400/40 font-bold text-[10px] shadow-[0_0_5px_rgba(156,163,175,0.3)] flex items-center gap-1"><i class="fa-solid fa-medal text-gray-300"></i> Plata</span>`;
                    } else if (badge === 'VETERAN') {
                        premierBadgesHTML += `<span class="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold text-[10px] shadow-[0_0_5px_rgba(249,115,22,0.3)] flex items-center gap-1"><i class="fa-solid fa-shield-halved text-orange-400"></i> Veterano</span>`;
                    }
                });
            }
            if (user.premier_wins && user.premier_wins > 0) {
                premierBadgesHTML += `<span class="px-2 py-0.5 rounded-full bg-gamityPurple/20 text-gamityPurple border border-gamityPurple/30 font-bold text-[10px] flex items-center gap-1"><i class="fa-solid fa-trophy text-gamityPurple"></i> ${user.premier_wins} Victorias</span>`;
            }
            if (premierBadgesHTML !== '') {
                premierBadgesHTML = `<div class="flex flex-wrap gap-1 mt-2">${premierBadgesHTML}</div>`;
            }



            const safeUsername = escapeJSString(user.username);
            const safeBio = escapeJSString(user.bio);
            const safeMainGame = escapeJSString(user.main_game);
            const safeGameRank = escapeJSString(user.game_rank);
            const safeAttitude = escapeJSString(user.attitude);
            const safeAvatar = escapeJSString(user.avatar);
            const safeStatus = escapeJSString(user.status);

            return `
                <div class="player-card card-hover">

                    <button onclick="event.stopPropagation(); openReportModal(${user.id}, '${safeUsername}')"
                            class="player-card__report-btn" title="Reportar usuario">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                        </svg>
                    </button>

                    <div class="player-card__header" onclick="openPlayerModal(${user.id}, '${safeUsername}', '${safeBio}', '${safeMainGame}', '${safeGameRank}', '${safeAttitude}', '${safeAvatar}', '${safeStatus}')">
                        <div class="player-card__avatar-wrap">
                            <div class="player-card__avatar">
                                <img src="${avatarUrl}" alt="${escapeHTML(user.username)}">
                            </div>
                            <div class="player-card__status-dot ${statusClass}"></div>
                        </div>
                        <div class="player-card__info">
                            <h3 class="player-card__name">${escapeHTML(user.username)}</h3>
                            <div style="display:flex;align-items:center;font-size:0.75rem;margin-top:0.25rem;">
                                <span style="color:${isOnline ? '#10b981' : '#6b7280'};font-weight:500;">${statusText}</span>
                                ${attitudeHTML}
                            </div>
                            ${premierBadgesHTML}
                        </div>
                    </div>

                    <div class="player-card__badges">${badgesHTML}</div>

                    <p class="player-card__bio">
                        ${escapeHTML(user.bio) || 'Jugador dispuesto a formar equipo y pasarlo bien. Sin descripción.'}
                    </p>

                    ${user.friendship_status === 'pending' ? `
                        <button disabled class="btn-friend btn-friend--pending">
                            <span class="status-pulse-red"></span> Pendiente
                        </button>
                    ` : user.friendship_status === 'accepted' ? `
                        <button disabled class="btn-friend btn-friend--accepted">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Amigos
                        </button>
                    ` : `
                        <button onclick="sendRequest(${user.id}, this)" class="btn-friend btn-friend--request">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            Enviar solicitud
                        </button>
                    `}
                </div>
            `;
        }).join('');
    };

    // Agregamos event listeners a los filtros para refetch cada vez que cambien
    Object.values(filters).forEach(filter => {
        filter.addEventListener('change', fetchUsers);
        if (filter === filters.search) {
            filter.addEventListener('keyup', (e) => {
                // debounce o delay podría ir aquí
                fetchUsers();
            });
        }
    });

    // Fetch inicial de usuarios
    fetchUsers();
});

// Enviar solicitud de amistad (via Spring Boot)
window.sendRequest = async (receiverId, btnElement) => {
    const API_BASE = window.GAMITY_API_URL || window.apiBaseUrl;
    const senderId = window.currentUserId || currentUserId;

    try {
        // Estado de carga
        const originalContent = btnElement.innerHTML;
        btnElement.innerHTML = `<svg class="animate-spin h-5 w-5 text-gamityPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
        btnElement.disabled = true;

        const response = await fetch(`${API_BASE}/friendships/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': senderId,
                'X-User-Hash': window.currentUserHash || ''
            },
            body: JSON.stringify({ senderId: senderId, receiverId: receiverId })
        });
        const data = await response.json();

        // Actualizamos el boton según la respuesta
        if (data.success) {
            btnElement.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]"></span> Pendiente`;
            btnElement.classList.replace('text-gamityPurple', 'text-red-400');
            btnElement.classList.replace('border-gamityPurple/30', 'border-red-500/20');
        } else {
            btnElement.innerHTML = originalContent;
            btnElement.disabled = false;
            alert(data.error || 'Error al enviar solicitud. Revisa la consola.');
        }
       
    } catch (error) {
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
        console.error('Error sending request:', error);
    }
};