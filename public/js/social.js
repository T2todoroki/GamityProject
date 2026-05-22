document.addEventListener('DOMContentLoaded', () => {
    // Función para escapar HTML y prevenir XSS
    const escapeHTML = (str) => {
        if (!str) return '';
        return str.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    // ── API base URL y userId inyectados desde PHP (social.php) ──
    const API_BASE = window.GAMITY_API_URL || window.apiBaseUrl;
    const USER_ID = window.currentUserId;

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

    // Buscador de amigos listener
    const searchFriendsInput = document.getElementById('searchFriendsInput');
    if (searchFriendsInput) {
        searchFriendsInput.addEventListener('input', () => {
            renderFriends(window.allFriends || []);
        });
    }

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

            // Agregar o eliminar indicador de solicitud pendiente en el Tab
            let badge = tabReq.querySelector('.pending-indicator-dot');
            if (Array.isArray(data) && data.length > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'pending-indicator-dot w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] ml-1';
                    tabReq.appendChild(badge);
                }

                contReq.innerHTML = data.map(req => {
                    const safeUsername = escapeHTML(req.senderUsername);
                    const safeMainGame = escapeHTML(req.senderMainGame);
                    const safeGameRank = escapeHTML(req.senderGameRank);
                    const avatarUrl = req.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURI(req.senderUsername)}&background=18181b&color=fff`;
                    return `
                    <div class="request-card p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-slide-in relative overflow-hidden group">
                        <!-- Brillo de fondo al pasar el ratón -->
                        <div class="absolute inset-0 bg-gradient-to-r from-gamityPurple/0 via-gamityPurple/5 to-gamityPurple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div class="flex items-center gap-4 relative z-10 w-full md:w-auto">
                            <div class="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gamityPurple/30 shadow-[0_0_15px_rgba(139,92,246,0.3)] relative">
                                <img src="${avatarUrl}" class="w-full h-full object-cover">
                                <span class="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-surface shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10"></span>
                            </div>
                            <div>
                                <h3 class="font-bold text-white text-lg drop-shadow-md">${safeUsername}</h3>
                                <p class="text-xs text-gamityPurple/80 font-medium tracking-wide uppercase mt-0.5">${safeMainGame}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 w-full md:w-auto relative z-10">
                            <button onclick="handleRequest(${req.id}, 'rejected')" class="flex-1 md:flex-none px-5 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                                Rechazar
                            </button>
                            <button onclick="handleRequest(${req.id}, 'accepted')" class="flex-1 md:flex-none px-5 py-2.5 bg-gamityGreen/10 hover:bg-gamityGreen border border-gamityGreen/30 hover:border-gamityGreen text-gamityGreen hover:text-white rounded-xl text-sm font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
                                Aceptar
                            </button>
                        </div>
                    </div>
                    `;
                }).join('');
            } else {
                if (badge) badge.remove();
                contReq.innerHTML = renderEmpty('No tienes solicitudes pendientes', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>');
            }
        } catch (e) {
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

            window.allFriends = Array.isArray(data) ? data : [];
            renderFriends(window.allFriends);
        } catch (e) {
            console.error('Error cargando amigos:', e);
        }
    }

    function renderFriends(friends) {
        const container = document.getElementById('friendsListContainer') || contFri;
        const query = (document.getElementById('searchFriendsInput')?.value || '').toLowerCase().trim();

        const filtered = friends.filter(friend => {
            return friend.username.toLowerCase().includes(query);
        });

        const onlineFriends = filtered.filter(f => f.status === 'online');
        const offlineFriends = filtered.filter(f => f.status !== 'online');

        let html = '';

        if (onlineFriends.length > 0) {
            html += `<h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-4">En línea — ${onlineFriends.length}</h4>`;
            html += onlineFriends.map(f => renderFriendCard(f)).join('');
        }

        if (offlineFriends.length > 0) {
            html += `<h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-6">Desconectados — ${offlineFriends.length}</h4>`;
            html += offlineFriends.map(f => renderFriendCard(f)).join('');
        }

        if (filtered.length > 0) {
            container.innerHTML = html;
        } else {
            container.innerHTML = renderEmpty(query ? 'No se encontraron amigos con ese nombre' : 'Aún no tienes amigos en tu lista', '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>');
        }
    }

    function renderFriendCard(friend) {
        const safeUsername = escapeHTML(friend.username);
        const safeMainGame = escapeHTML(friend.mainGame);
        const avatarUrl = friend.avatar || `https://ui-avatars.com/api/?name=${encodeURI(friend.username)}&background=18181b&color=fff`;
        const isOnline = friend.status === 'online';

        return `
        <div class="bg-surface p-4 rounded-xl border border-white/5 flex items-center justify-between request-card relative group">
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
            <div class="flex items-center gap-2">
                <a href="chat.php?user_id=${friend.id}" class="px-4 py-2 bg-gamityPurple/10 hover:bg-gamityPurple border border-gamityPurple/20 text-gamityPurple hover:text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    Chatear
                </a>
                
                <div class="relative">
                    <button onclick="toggleFriendMenu(${friend.id})" class="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </button>
                    <!-- Menú Desplegable -->
                    <div id="friendMenu-${friend.id}" class="absolute right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-2xl py-1 hidden z-50">
                        <button onclick="openReportModal(${friend.id}, '${safeUsername}')" class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                            <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Reportar
                        </button>
                        <button onclick="blockUser(${friend.id}, '${safeUsername}')" class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                            Bloquear
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    // Toggle menu
    window.toggleFriendMenu = (id) => {
        document.querySelectorAll('[id^="friendMenu-"]').forEach(menu => {
            if (menu.id !== `friendMenu-${id}`) menu.classList.add('hidden');
        });
        document.getElementById(`friendMenu-${id}`).classList.toggle('hidden');
    };

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[id^="friendMenu-"]') && !e.target.closest('button[onclick^="toggleFriendMenu"]')) {
            document.querySelectorAll('[id^="friendMenu-"]').forEach(m => m.classList.add('hidden'));
        }
    });

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
            if (data.success) {
                loadRequests(); // Reload
                if (typeof showToast === 'function') {
                    showToast(decision === 'accepted' ? 'Amistad aceptada' : 'Solicitud rechazada', 'success');
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.error || 'Error al procesar solicitud', 'error');
                } else {
                    alert(data.error || 'Error al procesar solicitud');
                }
            }
        } catch (e) {
            console.error('Error respondiendo a solicitud:', e);
            if (typeof showToast === 'function') {
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
            if (data.success) {
                if (typeof showToast === 'function') {
                    showToast('Solicitud de amistad enviada', 'success');
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast(data.error || 'Error al enviar solicitud', 'error');
                }
            }
            return data;
        } catch (e) {
            console.error('Error enviando solicitud:', e);
            if (typeof showToast === 'function') {
                showToast('Error de conexión con el servidor', 'error');
            }
            return { success: false };
        }
    };

    // ── Block User ──
    window.blockUser = async (friendId, friendName) => {
        if (!confirm(`¿Estás seguro de que quieres bloquear a ${friendName}? Desaparecerá de tu lista de amigos.`)) return;

        try {
            const res = await fetch(`${API_BASE}/blocks/${USER_ID}/${friendId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': USER_ID,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            const data = await res.json();
            if (data.success) {
                showToast(`Has bloqueado a ${friendName}`, 'success');
                loadFriends(); // Recargar lista
            } else {
                showToast(data.error || 'Error al bloquear usuario', 'error');
            }
        } catch (e) {
            showToast('Error de conexión con el servidor', 'error');
        }
    };

    // ── Report Modal Handling ──
    window.openReportModal = (userId, username) => {
        document.getElementById('reportUserId').value = userId;
        document.getElementById('reportUsername').value = username;
        document.getElementById('reportReasonSelect').value = '';
        document.getElementById('reportDetails').value = '';
        
        const modal = document.getElementById('reportModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    window.closeReportModal = () => {
        const modal = document.getElementById('reportModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    };

    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const reportedId = document.getElementById('reportUserId').value;
            const reasonBase = document.getElementById('reportReasonSelect').value;
            const details = document.getElementById('reportDetails').value;
            
            const fullReason = details ? `${reasonBase}: ${details}` : reasonBase;

            try {
                const res = await fetch(`${API_BASE}/reports`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-User-Id': USER_ID,
                        'X-User-Hash': window.currentUserHash || ''
                    },
                    body: JSON.stringify({
                        reportedUserId: parseInt(reportedId),
                        reason: fullReason,
                        evidence: '' // Optional
                    })
                });
                const data = await res.json();
                if (data.success) {
                    showToast('Reporte enviado correctamente. Será revisado por un administrador.', 'success');
                    closeReportModal();
                } else {
                    showToast(data.error || 'Error al enviar reporte', 'error');
                }
            } catch (err) {
                showToast('Error de conexión con la API', 'error');
            }
        });
    }

    // Initial Load
    loadRequests();
});