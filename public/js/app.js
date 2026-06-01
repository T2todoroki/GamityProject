function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    const colors = {
        success: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
        error: 'border-red-500 bg-red-500/10 text-red-400',
        info: 'border-violet-500 bg-violet-500/10 text-violet-400'
    };
    const icons = {
        success: '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
        error: '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
        info: '<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };

    toast.className = `flex items-center gap-3 px-5 py-3 rounded-xl border ${colors[type]} backdrop-blur-md shadow-2xl text-sm font-medium transform translate-x-full opacity-0 transition-all duration-500 max-w-sm`;
    container.innerHTML = '';
    toast.innerHTML = `${icons[type]}<span>${message}</span>`;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    });

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'fixed top-6 right-6 z-[9999] flex flex-col gap-3';
    document.body.appendChild(container);
    return container;
}

// ===== PLAYER PROFILE MODAL =====
function openPlayerModal(userId, username, bio, mainGame, gameRank, attitude, avatar, status) {
    const modal = document.getElementById('playerModal');
    if (!modal) return;

    const isOnline = status === 'online';
    const statusHTML = isOnline
        ? '<span class="flex items-center gap-1.5 text-emerald-400 text-sm font-medium"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online</span>'
        : '<span class="flex items-center gap-1.5 text-gray-500 text-sm font-medium"><span class="w-2 h-2 rounded-full bg-gray-500"></span> Offline</span>';

    const avatarUrl = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=18181b&color=fff&size=200`;

    document.getElementById('modalAvatar').src = avatarUrl;
    document.getElementById('modalUsername').textContent = username;
    document.getElementById('modalStatus').innerHTML = statusHTML;
    document.getElementById('modalBio').textContent = bio || 'Sin biografía definida por ahora.';

    // Parse multiple games and ranks
    let games = [];
    let ranks = [];
    try { games = JSON.parse(mainGame); } catch (e) { games = mainGame ? [mainGame] : []; }
    try { ranks = JSON.parse(gameRank); } catch (e) { ranks = gameRank ? [gameRank] : []; }

    const gamesContainer = document.getElementById('modalGamesContainer');
    if (gamesContainer) {
        if (games.length === 0) {
            gamesContainer.innerHTML = '<p class="text-sm" style="color:#6b7280;">Sin juegos configurados</p>';
        } else {
            gamesContainer.innerHTML = games.map((g, i) => {
                if (!g) return '';
                const rank = ranks[i] || 'N/A';
                // Colores sólidos por juego
                let borderColor = '#4b5563';
                let accentColor = '#9ca3af';
                let rankBg = 'rgba(75,85,99,0.3)';
                let iconEmoji = '🎲';
                if (g === 'Valorant') { borderColor = '#ef4444'; accentColor = '#f87171'; rankBg = 'rgba(239,68,68,0.2)'; iconEmoji = '🔥'; }
                else if (g === 'LoL' || g === 'League of Legends') { borderColor = '#3b82f6'; accentColor = '#60a5fa'; rankBg = 'rgba(59,130,246,0.2)'; iconEmoji = '⚔️'; }
                else if (g === 'CS2') { borderColor = '#f59e0b'; accentColor = '#fbbf24'; rankBg = 'rgba(245,158,11,0.2)'; iconEmoji = '🎯'; }
                else if (g === 'Minecraft') { borderColor = '#10b981'; accentColor = '#34d399'; rankBg = 'rgba(16,185,129,0.2)'; iconEmoji = '⛏️'; }
                else if (g === 'Fortnite') { borderColor = '#8b5cf6'; accentColor = '#a78bfa'; rankBg = 'rgba(139,92,246,0.2)'; iconEmoji = '🎮'; }
                else if (g === 'Apex Legends') { borderColor = '#ef4444'; accentColor = '#f87171'; rankBg = 'rgba(239,68,68,0.2)'; iconEmoji = '🔫'; }
                return `<div class="flex items-center justify-between p-2.5 rounded-xl" style="background-color:#1a1d2e; border: 1px solid ${borderColor}40;">
                    <div class="flex items-center gap-2">
                        <span class="text-base">${iconEmoji}</span>
                        <span class="text-sm font-bold" style="color:#f3f4f6;">${g}</span>
                    </div>
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full" style="color:${accentColor}; background:${rankBg};">${rank}</span>
                </div>`;
            }).filter(Boolean).join('');
        }
    }

    document.getElementById('modalAttitude').textContent = attitude || 'Desconocida';
    document.getElementById('modalUserId').value = userId;

    // Chat button
    document.getElementById('modalChatBtn').onclick = () => {
        window.location.href = `chat.php?user_id=${userId}`;
    };

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Animate content
    const content = modal.querySelector('.modal-content');
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
}

function closePlayerModal() {
    const modal = document.getElementById('playerModal');
    if (!modal) return;
    const content = modal.querySelector('.modal-content');
    content.classList.add('scale-95', 'opacity-0');
    content.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 200);
}

// ===== REPORT SYSTEM =====
function openReportModal(userId, username) {
    const modal = document.getElementById('reportModal');
    if (!modal) return;

    const reportUserId = document.getElementById('reportUserId');
    if (reportUserId) reportUserId.value = userId;
    
    const reportUsername = document.getElementById('reportUsername');
    if (reportUsername) reportUsername.textContent = username;

    const reasonInput = document.getElementById('reportReason');
    if (reasonInput) reasonInput.value = '';

    const reasonSelect = document.getElementById('reportReasonSelect');
    if (reasonSelect) reasonSelect.value = '';

    const detailsInput = document.getElementById('reportDetails');
    if (detailsInput) detailsInput.value = '';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function submitReport(e) {
    e.preventDefault();
    const userIdInput = document.getElementById('reportUserId');
    if (!userIdInput) return;
    const userId = userIdInput.value;

    let reason = '';
    const reasonSelect = document.getElementById('reportReasonSelect');
    const reasonText = document.getElementById('reportReason');
    const detailsText = document.getElementById('reportDetails');

    if (reasonSelect && reasonSelect.value) {
        reason = reasonSelect.value;
        if (detailsText && detailsText.value.trim()) {
             reason += " - Detalles: " + detailsText.value.trim();
        }
    } else if (reasonText) {
        reason = reasonText.value.trim();
    }

    if (!reason) {
        showToast('Escribe el motivo del reporte.', 'error');
        return;
    }

    try {
        const API_BASE = window.GAMITY_API_URL || window.apiBaseUrl;
        const reporterId = window.currentUserId || (typeof currentUserId !== 'undefined' ? currentUserId : null);
        const res = await fetch(`${API_BASE}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': reporterId,
                'X-User-Hash': window.currentUserHash || window.SESSION_USER_HASH || ''
            },
            body: JSON.stringify({ reported_user_id: parseInt(userId), reason: reason })
        });
        const data = await res.json();
        if (data.success) {
            closeReportModal();
            showToast('Reporte enviado correctamente. Gracias por ayudar a la comunidad.', 'success');
        } else {
            showToast(data.error || 'Error al enviar el reporte.', 'error');
        }
    } catch (err) {
        showToast('Error de conexión al enviar el reporte.', 'error');
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Report form handler
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
    }

    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closePlayerModal();
                closeReportModal();
            }
        });
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePlayerModal();
            closeReportModal();
        }
    });

    // Modo Claro/Oscuro Global Fallback
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");
    const iconDark = document.getElementById("themeIconDark");
    const iconLight = document.getElementById("themeIconLight");

    if (themeToggle && iconDark && iconLight) {
        if (localStorage.getItem("gamityTheme") === "light") {
            htmlElement.classList.add("light");
            htmlElement.classList.remove("dark");
            iconLight.classList.add("hidden");
            iconDark.classList.remove("hidden");
        } else {
            htmlElement.classList.add("dark");
            htmlElement.classList.remove("light");
            iconDark.classList.add("hidden");
            iconLight.classList.remove("hidden");
        }

        themeToggle.addEventListener("click", () => {
            if (htmlElement.classList.contains("dark")) {
                htmlElement.classList.remove("dark");
                htmlElement.classList.add("light");
                localStorage.setItem("gamityTheme", "light");
                iconLight.classList.add("hidden");
                iconDark.classList.remove("hidden");
            } else {
                htmlElement.classList.remove("light");
                htmlElement.classList.add("dark");
                localStorage.setItem("gamityTheme", "dark");
                iconDark.classList.add("hidden");
                iconLight.classList.remove("hidden");
            }
        });
    }

    // ===== NOTIFICACIONES SOCIALES GLOBALES =====
    let pollingInterval = null;

    async function checkPendingRequests() {
        const API_BASE = window.GAMITY_API_URL || window.apiBaseUrl;
        const userId = window.currentUserId || (typeof currentUserId !== 'undefined' ? currentUserId : null);
        if (!userId) return;

        try {
            const res = await fetch(`${API_BASE}/friendships/pending/${userId}`, {
                headers: {
                    'X-User-Id': userId,
                    'X-User-Hash': window.currentUserHash || window.SESSION_USER_HASH || ''
                }
            });

            // Si la sesión ha expirado o el usuario no está autorizado, detenemos el Polling
            if (res.status === 401 || res.status === 403) {
                if (pollingInterval) clearInterval(pollingInterval);
                return;
            }

            const data = await res.json();

            const socialLinks = document.querySelectorAll('a[href="social.php"]');

            if (Array.isArray(data) && data.length > 0) {
                const count = data.length;
                socialLinks.forEach(link => {
                    link.classList.add('relative');
                    let badge = link.querySelector('.social-badge-count');
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'social-badge-count absolute top-0 -right-1 md:top-2 md:right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse';
                        link.appendChild(badge);
                    }
                    badge.textContent = count;
                });
            } else {
                socialLinks.forEach(link => {
                    const badge = link.querySelector('.social-badge-count');
                    if (badge) badge.remove();
                });
            }
        } catch (e) {
            // Si hay error de red también podríamos detener el polling si falla muchas veces, pero por ahora lo dejamos intentar.
        }
    }

    window.checkUnreadMessages = async function() {
        const API_BASE = window.GAMITY_API_URL || window.apiBaseUrl;
        const userId = window.currentUserId || (typeof currentUserId !== 'undefined' ? currentUserId : null);
        if (!userId) return;

        try {
            const res = await fetch(`${API_BASE}/messages/unread/${userId}`, {
                headers: {
                    'X-User-Id': userId,
                    'X-User-Hash': window.currentUserHash || window.SESSION_USER_HASH || ''
                }
            });

            if (res.status === 401 || res.status === 403) return;

            const data = await res.json();

            const chatLinks = document.querySelectorAll('a[href="chat.php"]');
            const isOnChatPage = window.location.pathname.includes('chat.php');

            if (data.success && data.count > 0 && !isOnChatPage) {
                const count = data.count;
                chatLinks.forEach(link => {
                    link.classList.add('relative');
                    let badge = link.querySelector('.chat-badge-count');
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'chat-badge-count absolute top-0 -right-1 md:top-2 md:right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse';
                        link.appendChild(badge);
                    }
                    badge.textContent = count;
                });
            } else {
                chatLinks.forEach(link => {
                    const badge = link.querySelector('.chat-badge-count');
                    if (badge) badge.remove();
                });
            }
        } catch (e) { }
    }

    // mirar cada 15 segundos periodicamente para que aparezcan los iconos de notificaciones
    pollingInterval = setInterval(() => {
        checkPendingRequests();
        window.checkUnreadMessages();
    }, 15000);

    checkPendingRequests();
    window.checkUnreadMessages();
});
