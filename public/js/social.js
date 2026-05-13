document.addEventListener('DOMContentLoaded', () => {
    // Función para escapar HTML y prevenir XSS
    const escapeHTML = (str) => {
        if (!str) return '';
        return str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    // ── API base URL y userId inyectados desde PHP (social.php) ──
    const API_BASE = window.GAMITY_API_URL || window.apiBaseUrl;
    const USER_ID  = window.currentUserId;

    const tabReq = document.getElementById('tabRequests');
    const tabFri = document.getElementById('tabFriends');
    const contReq = document.getElementById('contentRequests');
    const contFri = document.getElementById('contentFriends');

    // Tab Switching
    tabReq.addEventListener('click', () => {
        tabReq.classList.replace('tab-inactive', 'tab-active');
        tabFri.classList.replace('tab-active', 'tab-inactive');
        contReq.classList.remove('hidden');
        contFri.classList.add('hidden');
        loadRequests();
    });

    tabFri.addEventListener('click', () => {
        tabFri.classList.replace('tab-inactive', 'tab-active');
        tabReq.classList.replace('tab-active', 'tab-inactive');
        contFri.classList.remove('hidden');
        contReq.classList.add('hidden');
        loadFriends();
    });

    const renderEmpty = (message, icon) => `
        <div class="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg class="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg>
            <p class="text-sm">${message}</p>
        </div>
    `;

     // ── Load Pending Requests (desde Spring Boot) ──
    async function loadRequests() {
        try {
            const res = await fetch(`${API_BASE}/friendships/pending/${USER_ID}`, {
                headers: { 
                    'X-User-Id': USER_ID,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            if (res.status === 401 || res.status === 403) { window.location.href = 'auth.php'; return; }
            const data = await res.json();

            // El backend devuelve un array de FriendshipResponseDTO directamente
            if(Array.isArray(data) && data.length > 0) {
                contReq.innerHTML = data.map(req => {
                    const safeUsername = escapeHTML(req.senderUsername);
                    const safeMainGame = escapeHTML(req.senderMainGame);
                    const safeGameRank = escapeHTML(req.senderGameRank);
                    const avatarUrl = req.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURI(req.senderUsername)}&background=18181b&color=fff`;
                    return `
                    <div class="bg-surface p-4 rounded-xl border border-white/5 flex items-center justify-between request-card">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full overflow-hidden border border-gamityPurple/30">
                                <img src="${avatarUrl}" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h3 class="font-bold text-white text-lg">${safeUsername}</h3>
                                <p class="text-xs text-gray-400 mt-1">${safeMainGame || 'Cualquier juego'}${safeGameRank ? ' · ' + safeGameRank : ''}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="handleRequest(${req.id}, 'accepted')" class="px-4 py-2 bg-gamityGreen/10 hover:bg-gamityGreen border border-gamityGreen/20 text-gamityGreen hover:text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                Aceptar
                            </button>
                            <button onclick="handleRequest(${req.id}, 'rejected')" class="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                Rechazar
                            </button>
                        </div>
                    </div>
                    `;
                }).join('');
            } else {
                contReq.innerHTML = renderEmpty('No tienes solicitudes pendientes', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>');
            }
        } catch(e) {
            console.error('Error cargando solicitudes:', e);
            contReq.innerHTML = renderEmpty('Error al cargar solicitudes', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>');
        }
    }

    // ── Load Friends (desde Spring Boot) ──
    async function loadFriends() {
        try {
            const res = await fetch(`${API_BASE}/friendships/friends/${USER_ID}`, {
                headers: { 
                    'X-User-Id': USER_ID,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            if (res.status === 401 || res.status === 403) { window.location.href = 'auth.php'; return; }
            const data = await res.json();
            
            if(Array.isArray(data) && data.length > 0) {
                contFri.innerHTML = data.map(friend => {
                    const safeUsername = escapeHTML(friend.username);
                    const safeMainGame = escapeHTML(friend.mainGame);
                    const avatarUrl = friend.avatar || `https://ui-avatars.com/api/?name=${encodeURI(friend.username)}&background=18181b&color=fff`;
                    const isOnline = friend.status === 'online';
                    
                    return `
                    <div class="bg-surface p-4 rounded-xl border border-white/5 flex items-center justify-between request-card">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full overflow-hidden border border-white/10 relative">
                                <img src="${avatarUrl}" class="w-full h-full object-cover">
                            </div>
                            <div>
                                <h3 class="font-bold text-white text-lg flex items-center gap-2">
                                    ${safeUsername}
                                    <span class="w-2 h-2 rounded-full ${isOnline ? 'bg-gamityGreen shadow-[0_0_5px_#10b981]' : 'bg-gray-500'}"></span>
                                </h3>
                                <p class="text-xs text-gray-400 mt-1">${safeMainGame || 'Cualquier juego'}</p>
                            </div>
                        </div>
                        <div>
                            <a href="chat.php?user_id=${friend.id}" class="px-4 py-2 bg-gamityPurple/10 hover:bg-gamityPurple border border-gamityPurple/20 text-gamityPurple hover:text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                Chatear
                            </a>
                        </div>
                    </div>
                    `;
                }).join('');
            } else {
                contFri.innerHTML = renderEmpty('Aún no tienes amigos en tu lista', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>');
            }
        } catch(e) { console.error('Error cargando amigos:', e); }
    }

    // ── Handle Accept / Reject (via Spring Boot) ──
    window.handleRequest = async (requestId, decision) => {
        try {
            const res = await fetch(`${API_BASE}/friendships/${requestId}/respond`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': window.currentUserHash || ''
                },
                body: JSON.stringify({ decision: decision })  // "accepted" o "rejected"
            });
            if (res.status === 401 || res.status === 403) { window.location.href = 'auth.php'; return; }
            const data = await res.json();
            if(data.success) {
                loadRequests(); // Reload
                if(typeof showToast === 'function') {
                    showToast(decision === 'accepted' ? 'Amistad aceptada' : 'Solicitud rechazada', 'success');
                }
            } else {
                if(typeof showToast === 'function') {
                    showToast(data.error || 'Error al procesar solicitud', 'error');
                } else {
                    alert(data.error || 'Error al procesar solicitud');
                }
            }
        } catch(e) {
            console.error('Error respondiendo a solicitud:', e);
            if(typeof showToast === 'function') {
                showToast('Error de conexión con el servidor', 'error');
            }
        }
    };

    // ── Send Friend Request (via Spring Boot) ── llamar desde index.js u otros módulos
    window.sendFriendRequest = async (receiverId) => {
        try {
            const res = await fetch(`${API_BASE}/friendships/send`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': window.currentUserHash || ''
                },
                body: JSON.stringify({ senderId: USER_ID, receiverId: receiverId })
            });
            if (res.status === 401 || res.status === 403) { window.location.href = 'auth.php'; return { success: false }; }
            const data = await res.json();
            if(data.success) {
                if(typeof showToast === 'function') {
                    showToast('Solicitud de amistad enviada', 'success');
                }
            } else {
                if(typeof showToast === 'function') {
                    showToast(data.error || 'Error al enviar solicitud', 'error');
                }
            }
            return data;
        } catch(e) {
            console.error('Error enviando solicitud:', e);
            if(typeof showToast === 'function') {
                showToast('Error de conexión con el servidor', 'error');
            }
            return { success: false };
        }
    };

    // Initial Load
    loadRequests();
});