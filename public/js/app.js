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
            gamesContainer.innerHTML = '<p class="text-gray-400 text-sm">Sin juegos configurados</p>';
        } else {
            gamesContainer.innerHTML = games.map((g, i) => {
                if (!g) return '';
                const rank = ranks[i] || 'N/A';
                let badgeCls = 'border-gray-500/30 bg-gray-500/5';
                let iconEmoji = '🎲';
                if (g === 'Valorant') { badgeCls = 'border-red-500/30 bg-red-500/5'; iconEmoji = '🔥'; }
                else if (g === 'LoL' || g === 'League of Legends') { badgeCls = 'border-blue-500/30 bg-blue-500/5'; iconEmoji = '⚔️'; }
                else if (g === 'CS2') { badgeCls = 'border-yellow-500/30 bg-yellow-500/5'; iconEmoji = '🎯'; }
                else if (g === 'Minecraft') { badgeCls = 'border-green-500/30 bg-green-500/5'; iconEmoji = '⛏️'; }
                else if (g === 'Fortnite') { badgeCls = 'border-purple-500/30 bg-purple-500/5'; iconEmoji = '🎮'; }
                return `<div class="flex items-center justify-between p-2.5 rounded-xl border ${badgeCls}">
                    <div class="flex items-center gap-2">
                        <span class="text-base">${iconEmoji}</span>
                        <span class="text-sm font-bold text-white">${g}</span>
                    </div>
                    <span class="text-xs font-semibold text-gamityGreen bg-gamityGreen/10 px-2.5 py-1 rounded-full">${rank}</span>
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

    document.getElementById('reportUserId').value = userId;
    document.getElementById('reportUsername').textContent = username;
    document.getElementById('reportReason').value = '';

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
    const userId = document.getElementById('reportUserId').value;
    const reason = document.getElementById('reportReason').value.trim();

    if (!reason) {
        showToast('Escribe el motivo del reporte.', 'error');
        return;
    }

    try {
        const API_BASE = window.apiBaseUrl || 'http://localhost:8082/api/v1';
        const reporterId = window.currentUserId || (typeof currentUserId !== 'undefined' ? currentUserId : null);
        const res = await fetch(`${API_BASE}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': reporterId
            },
            body: JSON.stringify({ reportedUserId: userId, reason: reason })
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
    async function checkPendingRequests() {
        const API_BASE = window.apiBaseUrl || 'http://localhost:8082/api/v1';
        const userId = window.currentUserId || (typeof currentUserId !== 'undefined' ? currentUserId : null);
        if (!userId) return;

        try {
            const res = await fetch(`${API_BASE}/friendships/pending/${userId}`);
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
        } catch (e) { }
    }

    // Check periodically every 15s and immediately on load
    setInterval(checkPendingRequests, 15000);
    checkPendingRequests();
});
