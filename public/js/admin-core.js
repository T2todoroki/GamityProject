// admin-core.js
function showToast(message, type = 'success') {
    const colors = {
        success: 'bg-gamityGreen/20 border-gamityGreen/40 text-gamityGreen',
        error: 'bg-red-500/20 border-red-500/40 text-red-400',
        info: 'bg-gamityPurple/20 border-gamityPurple/40 text-gamityPurple'
    };
    const icons = {
        success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>',
        error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>',
        info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    };
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-md shadow-2xl text-sm font-medium transition-all duration-300 translate-x-20 opacity-0 ${colors[type]}`;
    toast.innerHTML = `<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icons[type]}</svg><span>${message}</span>`;
    document.getElementById('toastContainer').appendChild(toast);
    requestAnimationFrame(() => { toast.classList.remove('translate-x-20', 'opacity-0'); });
    setTimeout(() => {
        toast.classList.add('translate-x-20', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            window.currentUsersPage = 1;
            renderPaginatedUsers();
        });
    }
});

async function apiFetch(endpoint, options = {}) {
    const url = `${window.GAMITY_API_URL}${endpoint}`;
    const headers = {
        'X-User-Id': window.USER_ID,
        'X-User-Hash': window.USER_HASH,
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error("No tienes permisos o tu sesión ha expirado (403/401).");
            }
            if (response.status === 500) {
                throw new Error("Error interno del servidor backend (500).");
            }
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`[API Fetch Error en ${endpoint}]:`, error);
        if (error instanceof TypeError) {
            showToast('Error de red o bloqueo de CORS. Verifica la consola.', 'error');
        } else {
            showToast(error.message, 'error');
        }
        throw error;
    }
}

function loadDashboard() {
    apiFetch('/admin/dashboard')
    .then(data => {
        if (data.success) {
            document.getElementById('statUsers').textContent = data.stats.total_users;
            document.getElementById('statOnline').textContent = data.stats.online_users;
            document.getElementById('statConnections').textContent = data.stats.active_connections;
            document.getElementById('statMessages').textContent = data.stats.total_messages;
            document.getElementById('statReports').textContent = data.stats.pending_reports;
            
            if(typeof renderUsersTable === 'function') renderUsersTable(data.users);
            if(typeof renderReportsTable === 'function') renderReportsTable(data.reports || []);
            if(typeof renderDisputedMatches === 'function') renderDisputedMatches(data.disputed_matches || []);
            
            initCharts(data.stats);
        } else {
            showToast(data.error || 'Error al cargar el panel', 'error');
        }
    })
    .catch(() => {});
}

let usersChartInstance = null;
let activityChartInstance = null;

function initCharts(stats) {
    if (!document.getElementById('usersChart') || !document.getElementById('activityChart')) return;

    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    // Gráfico de Usuarios (Donut)
    const usersCtx = document.getElementById('usersChart').getContext('2d');
    const offlineUsers = stats.total_users - stats.online_users;
    
    if (usersChartInstance) usersChartInstance.destroy();
    usersChartInstance = new Chart(usersCtx, {
        type: 'doughnut',
        data: {
            labels: ['Online', 'Offline'],
            datasets: [{
                data: [stats.online_users, offlineUsers],
                backgroundColor: ['#10B981', '#4B5563'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            }
        }
    });

    // Gráfico de Actividad (Bar)
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    
    if (activityChartInstance) activityChartInstance.destroy();
    activityChartInstance = new Chart(activityCtx, {
        type: 'bar',
        data: {
            labels: ['Conexiones', 'Mensajes', 'Reportes', 'Disputas'],
            datasets: [{
                label: 'Métricas Totales',
                data: [stats.active_connections, stats.total_messages, stats.pending_reports, stats.disputed_matches || 0],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // blue
                    'rgba(234, 179, 8, 0.8)',  // yellow
                    'rgba(239, 68, 68, 0.8)',  // red
                    'rgba(139, 92, 246, 0.8)'  // purple
                ],
                borderRadius: 6,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });
}
