document.addEventListener('DOMContentLoaded', async () => {
    

    // Fetch del perfil global para mostrar el avatar en el header
    try {
        if (typeof currentUserId !== 'undefined' && currentUserId !== null) {
            const globalRes = await fetch(`http://localhost:8082/api/v1/users/${currentUserId}/profile`, {
                headers: { 'X-User-Id': currentUserId }
            });
            const globalData = await globalRes.json();
            if(globalData.success && globalData.profile.avatar) {
                document.getElementById('headerAvatar').src = globalData.profile.avatar;
            }
        }
    } catch(e) {}

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
            const response = await fetch(`http://localhost:8082/api/matches?${params.toString()}`, {
                headers: { 'X-User-Id': currentUserId }
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
                status: 'offline', // Spring envía solo lo esencial en DTO
                friendship_status: null // La query de Java ya descarta amigos y pendientes! Magia PURA.
            }));

            renderUsers(adaptedUsers);
        } catch (error) {
            console.error("Error fetching matches from Java API:", error);
            usersGrid.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Error de conexión con el Matchmaking Server (Spring Boot).</div>`;
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
                try { games = JSON.parse(user.main_game); } catch(e) { games = [user.main_game]; }
            }
            if (user.game_rank && user.game_rank !== 'null') {
                try { ranks = JSON.parse(user.game_rank); } catch(e) { ranks = [user.game_rank]; }
            }
            if (!Array.isArray(games)) games = games ? [games] : [];
            if (!Array.isArray(ranks)) ranks = ranks ? [ranks] : [];

            // Función para obtener clase e ícono según el juego
            function getGameBadge(gameName) {
                if(gameName === 'Valorant') return { cls: 'badge-valorant', icon: '🔥' };
                if(gameName === 'LoL' || gameName === 'League of Legends') return { cls: 'badge-lol', icon: '⚔️' };
                if(gameName === 'CS2') return { cls: 'badge-cs2', icon: '🎯' };
                if(gameName === 'Minecraft') return { cls: 'badge-minecraft', icon: '⛏️' };
                if(gameName === 'Fortnite') return { cls: 'badge-fortnite', icon: '🎮' };
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
            // Determinar clase y texto de estado
            const isOnline = user.status === 'online';
            const statusClass = isOnline ? 'status-online' : 'status-offline';
            const statusText = isOnline ? 'Online' : 'Offline';
            
            // Determinar URL de avatar (fallback a UI Avatars si no hay avatar personalizado)
            const avatarUrl = user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURI(user.username)}&background=18181b&color=fff`;
            const attitudeHTML = user.attitude ? `<span class="text-xs text-red-500 font-medium ml-2">${user.attitude}</span>` : '';

           // Escapar comillas simples para evitar romper los atributos onclick
            const safeMainGame = (user.main_game || '').replace(/'/g, '\\&#39;');
            const safeGameRank = (user.game_rank || '').replace(/'/g, '\\&#39;');
            const safeBio = (user.bio || '').replace(/'/g, '\\&#39;');

            return `
                <div class="bg-surface rounded-2xl p-6 border border-white/5 card-hover relative flex flex-col group h-full">
                    
                    <!-- Report Button -->
                    <button onclick="event.stopPropagation(); openReportModal(${user.id}, '${user.username}')"
                            class="absolute top-3 right-3 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors z-10 opacity-0 group-hover:opacity-100"
                            title="Reportar usuario">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                    </button>

                    <!-- Header de tarjeta (clickable) -->
                    <div class="flex items-start gap-4 mb-4 cursor-pointer" onclick="openPlayerModal(${user.id}, '${user.username}', '${safeBio}', '${safeMainGame}', '${safeGameRank}', '${user.attitude || ''}', '${user.avatar || ''}', '${user.status}')">
                        <div class="relative">
                            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-gamityPurple/50">
                                <img src="${avatarUrl}" alt="${user.username}" class="w-full h-full object-cover">
                            </div>
                            <div class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface ${statusClass}"></div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="text-white font-bold text-lg truncate pr-4">${user.username}</h3>
                            <div class="flex items-center text-xs mt-1">
                                <span class="${isOnline ? 'text-gamityGreen' : 'text-gray-500'} font-medium">${statusText}</span>
                                ${attitudeHTML}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Badges (multiple games) -->
                    <div class="mb-4 flex flex-wrap gap-2">
                        ${badgesHTML}
                    </div>
                    
                    <!-- Description -->
                    <p class="text-gray-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                        ${user.bio || 'Jugador dispuesto a formar equipo y pasarlo bien. Sin descripción.'}
                    </p>
                    
                    <!-- Action Button -->
                    ${user.friendship_status === 'pending' ? `
                        <button disabled class="mt-auto w-full py-2.5 rounded-xl bg-surfaceLight border border-gamityGreen/30 text-gamityGreen font-medium flex items-center justify-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Pendiente
                        </button>
                    ` : user.friendship_status === 'accepted' ? `
                        <button disabled class="mt-auto w-full py-2.5 rounded-xl bg-surfaceLight border border-gamityPurple/30 text-gamityPurple font-medium flex items-center justify-center gap-2 opacity-60">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            Amigos
                        </button>
                    ` : `
                        <button onclick="sendRequest(${user.id}, this)" class="mt-auto w-full py-2.5 rounded-xl bg-gamityPurple/10 border border-gamityPurple/30 text-gamityPurple font-medium hover:bg-gamityPurple hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(155,93,229,0.3)]">
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
        if(filter === filters.search) {
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
    const API_BASE = window.apiBaseUrl || 'http://localhost:8082/api/v1';
    const senderId = window.currentUserId || currentUserId;

    try {
        // Estado de carga
        const originalContent = btnElement.innerHTML;
        btnElement.innerHTML = `<svg class="animate-spin h-5 w-5 text-gamityPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
        btnElement.disabled = true;

        const response = await fetch(`${API_BASE}/friendships/send`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-User-Id': senderId
            },
            body: JSON.stringify({ senderId: senderId, receiverId: receiverId })
        });
        const data = await response.json();

        // Actualizamos el botón según la respuesta
        if (data.success) {
            btnElement.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Pendiente`;
            btnElement.classList.replace('text-gamityPurple', 'text-gamityGreen');
            btnElement.classList.replace('border-gamityPurple/30', 'border-gamityGreen/30');
        } else {
            btnElement.innerHTML = originalContent;
            btnElement.disabled = false;
            alert(data.error || 'Error al enviar solicitud. Revisa la consola.');
        }
        // Opcional: Refrescar la lista de usuarios para actualizar estados (podría optimizarse solo para el usuario afectado)
    } catch (error) {
        btnElement.innerHTML = originalContent;
        btnElement.disabled = false;
        console.error('Error sending request:', error);
    }
};