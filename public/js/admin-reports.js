// admin-reports.js
window.allReports = [];
window.currentReportFilter = 'all';
window.currentReportsPage = 1;
const reportsPerPage = 10;

function filterReports(status) {
    window.currentReportFilter = status;
    window.currentReportsPage = 1;
    const statuses = ['all', 'pending', 'reviewed', 'dismissed'];
    statuses.forEach(s => {
        const btn = document.getElementById(`btnReportFilter-${s}`);
        if (btn) {
            if (s === status) {
                btn.className = 'px-3 py-1.5 rounded-full text-xs font-semibold bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20 transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]';
            } else {
                let hoverClasses = '';
                if (s === 'pending') hoverClasses = 'hover:bg-yellow-500/10 hover:border-yellow-500/30 hover:text-yellow-400';
                else if (s === 'reviewed') hoverClasses = 'hover:bg-gamityGreen/10 hover:border-gamityGreen/30 hover:text-gamityGreen';
                else if (s === 'dismissed') hoverClasses = 'hover:bg-gray-500/20 hover:border-gray-500/50 hover:text-gray-300';
                btn.className = `px-3 py-1.5 rounded-full text-xs font-semibold bg-surfaceLight text-gray-400 border border-white/5 hover:text-white transition-all ${hoverClasses}`;
            }
        }
    });
    renderPaginatedReports();
}

function renderReportsTable(reports) {
    window.allReports = reports;
    window.currentReportsPage = 1;
    renderPaginatedReports();
    initReportsChart(reports);
}

function renderPaginatedReports() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    const filteredReports = window.allReports.filter(r => {
        if (window.currentReportFilter === 'all') return true;
        return r.status === window.currentReportFilter;
    });

    document.getElementById('reportsCount').textContent = `${filteredReports.length} reportes`;

    const totalPages = Math.ceil(filteredReports.length / reportsPerPage) || 1;
    if (window.currentReportsPage > totalPages) window.currentReportsPage = totalPages;

    const startIndex = (window.currentReportsPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    const currentReports = filteredReports.slice(startIndex, endIndex);

    document.getElementById('reportsPaginationInfo').textContent = `Mostrando ${currentReports.length > 0 ? startIndex + 1 : 0} a ${Math.min(endIndex, filteredReports.length)} de ${filteredReports.length} reportes`;
    document.getElementById('reportsPageIndicator').textContent = `${window.currentReportsPage} / ${totalPages}`;

    document.getElementById('prevReportsPageBtn').disabled = window.currentReportsPage === 1;
    document.getElementById('nextReportsPageBtn').disabled = window.currentReportsPage === totalPages;

    if (currentReports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-10 text-center text-gray-500">No hay reportes en esta categoría.</td></tr>';
        return;
    }

    tbody.innerHTML = currentReports.map(r => {
        const statusBadge = {
            'pending': '<span class="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">Pendiente</span>',
            'reviewed': '<span class="px-2 py-1 rounded-full bg-gamityGreen/20 text-gamityGreen text-xs font-bold">Revisado</span>',
            'dismissed': '<span class="px-2 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">Descartado</span>'
        };
        const date = new Date(r.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

        return `
            <tr class="user-row neon-border-b cursor-pointer hover:bg-white/[0.02] transition-colors" onclick="openReportDetails(${r.id})">
                <td class="px-6 py-4 text-gray-400 font-mono">#${r.id}</td>
                <td class="px-6 py-4 font-semibold">${r.reporter_name}</td>
                <td class="px-6 py-4 text-red-400 font-semibold">${r.reported_name}</td>
                <td class="px-6 py-4 text-gray-300 max-w-xs truncate">${r.reason}</td>
                <td class="px-6 py-4">${statusBadge[r.status] || r.status}</td>
                <td class="px-6 py-4 text-gray-400 text-xs">${date}</td>
                <td class="px-6 py-4 text-center" onclick="event.stopPropagation()">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="openReportDetails(${r.id})" class="p-2 rounded-lg text-gray-400 hover:text-gamityPurple hover:bg-gamityPurple/10 transition-colors" title="Ver Detalles">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                        ${r.status === 'pending' ? `
                            <button onclick="updateReportStatus(${r.id}, 'reviewed')" class="p-2 rounded-lg text-gray-400 hover:text-gamityGreen hover:bg-gamityGreen/10 transition-colors" title="Marcar revisado">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                            <button onclick="updateReportStatus(${r.id}, 'dismissed')" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Descartar">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        ` : '-'}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function changeReportsPage(direction) {
    window.currentReportsPage += direction;
    renderPaginatedReports();
}

function openReportDetails(reportId) {
    const report = (window.allReports || []).find(r => r.id === reportId);
    if (!report) return;

    document.getElementById('detailReportId').textContent = `#${report.id}`;
    document.getElementById('detailReporterName').textContent = report.reporter_name;
    document.getElementById('detailReporterId').textContent = report.reporter_id ? `ID: #${report.reporter_id}` : 'ID: N/A';
    document.getElementById('detailReportedName').textContent = report.reported_name;
    document.getElementById('detailReportedId').textContent = report.reported_id ? `ID: #${report.reported_id}` : 'ID: N/A';

    const previousReportsCount = window.allReports.filter(r => r.reported_id === report.reported_id && r.id !== report.id).length;
    const badge = document.getElementById('detailRecidivismBadge');
    const badgeText = document.getElementById('detailRecidivismText');
    
    if (previousReportsCount > 0) {
        badge.classList.remove('hidden');
        badge.classList.add('flex');
        badgeText.textContent = `Atención: Este usuario tiene ${previousReportsCount} reporte(s) previo(s) registrado(s).`;
    } else {
        badge.classList.add('hidden');
        badge.classList.remove('flex');
    }

    const date = new Date(report.created_at).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    document.getElementById('detailReportDate').textContent = date;
    document.getElementById('detailReportReason').textContent = report.reason;
    document.getElementById('detailReportEvidence').textContent = report.evidence || 'No se adjuntó evidencia.';

    const statusBadgeContainer = document.getElementById('detailReportStatusBadge');
    const statusBadges = {
        'pending': '<span class="px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> Pendiente de Revisión</span>',
        'reviewed': '<span class="px-3 py-1.5 rounded-full bg-gamityGreen/20 text-gamityGreen text-xs font-bold inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gamityGreen"></span> Revisado</span>',
        'dismissed': '<span class="px-3 py-1.5 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold inline-flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gray-500"></span> Descartado</span>'
    };
    statusBadgeContainer.innerHTML = statusBadges[report.status] || report.status;

    const actionsContainer = document.getElementById('detailReportActions');
    if (report.status === 'pending') {
        actionsContainer.innerHTML = `
            <button onclick="updateReportStatus(${report.id}, 'dismissed'); closeReportDetailsModal();" 
                class="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all text-sm font-medium">
                Denegar
            </button>
            <button onclick="updateReportStatus(${report.id}, 'reviewed'); closeReportDetailsModal();" 
                class="px-4 py-2 bg-gamityGreen/10 hover:bg-gamityGreen border border-gamityGreen/30 text-gamityGreen hover:text-white rounded-xl text-sm font-bold transition-all">
                Aceptar
            </button>
            ${report.reported_id ? `
                <button onclick="deleteUserFromReport(${report.reported_id}, '${report.reported_name}', ${report.id})" 
                    class="px-4 py-2 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-500 hover:text-white rounded-xl text-sm font-bold transition-all">
                    Sancionar y Eliminar
                </button>
            ` : ''}
        `;
    } else {
        actionsContainer.innerHTML = `
            <span class="text-xs text-gray-400 font-medium italic self-center">Procesado</span>
        `;
    }

    const modal = document.getElementById('reportDetailsModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeReportDetailsModal() {
    const modal = document.getElementById('reportDetailsModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function deleteUserFromReport(userId, username, reportId) {
    if (!confirm(`¿Eliminar al usuario "${username}"? Esta acción no se puede deshacer y resolverá el reporte.`)) return;

    apiFetch(`/admin/users/${userId}`, {
        method: 'DELETE'
    })
    .then(data => {
        if (data.success) {
            showToast(`Usuario "${username}" eliminado y reporte resuelto`, 'success');
            closeReportDetailsModal();
            if(typeof loadDashboard === 'function') loadDashboard();
        } else {
            showToast(data.error || 'Error al eliminar usuario', 'error');
        }
    })
    .catch(() => {});
}

function updateReportStatus(reportId, newStatus) {
    const label = newStatus === 'reviewed' ? 'revisado' : 'descartado';
    apiFetch(`/admin/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
    })
    .then(data => {
        if (data.success) {
            showToast(`Reporte marcado como ${label}`, 'success');
            if(typeof loadDashboard === 'function') loadDashboard();
        } else {
            showToast(data.error || 'Error al actualizar reporte', 'error');
        }
    })
    .catch(() => {});
}

let reportsChartInstance = null;

function initReportsChart(reports) {
    if (!reports || reports.length === 0 || !document.getElementById('reportsReasonChart')) return;
    
    // Group by reason
    const reasonsCount = {};
    reports.forEach(r => {
        const reason = (r.reason || 'Desconocido').substring(0, 20) + (r.reason && r.reason.length > 20 ? '...' : ''); 
        reasonsCount[reason] = (reasonsCount[reason] || 0) + 1;
    });

    const labels = Object.keys(reasonsCount);
    const data = Object.values(reasonsCount);

    const ctx = document.getElementById('reportsReasonChart').getContext('2d');
    
    if (reportsChartInstance) reportsChartInstance.destroy();
    reportsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',   // Red
                    'rgba(245, 158, 11, 0.8)',  // Amber
                    'rgba(139, 92, 246, 0.8)',  // Purple
                    'rgba(59, 130, 246, 0.8)',  // Blue
                    'rgba(16, 185, 129, 0.8)'   // Green
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'right', labels: { color: '#9ca3af', boxWidth: 12, font: { size: 10 } } }
            }
        }
    });
}

function exportReportsCSV() {
    if (!window.allReports || window.allReports.length === 0) {
        showToast('No hay reportes para exportar', 'error');
        return;
    }

    const headers = ['ID', 'Reportado Por', 'ID Reportado Por', 'Usuario Reportado', 'ID Usuario Reportado', 'Motivo', 'Estado', 'Fecha'];
    const csvRows = [headers.join(',')];

    window.allReports.forEach(r => {
        const date = new Date(r.created_at).toISOString();
        const row = [
            r.id,
            `"${r.reporter_name}"`,
            r.reporter_id || '',
            `"${r.reported_name}"`,
            r.reported_id || '',
            `"${(r.reason || '').replace(/"/g, '""')}"`,
            `"${r.status}"`,
            `"${date}"`
        ];
        csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gamity_reportes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Historial de reportes exportado', 'success');
}

function scrollToReports() {
    const container = document.getElementById('reportsPanelContainer');
    const content = document.getElementById('reportsPanelContent');
    
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    container.classList.add('shadow-[0_0_50px_rgba(239,68,68,0.3)]', 'border-red-500/50', 'scale-[1.01]');
    setTimeout(() => {
        container.classList.remove('shadow-[0_0_50px_rgba(239,68,68,0.3)]', 'border-red-500/50', 'scale-[1.01]');
    }, 1000);
    
    if (content.classList.contains('hidden')) {
        toggleReportsPanel();
    }
}

function toggleReportsPanel() {
    const content = document.getElementById('reportsPanelContent');
    const icon = document.getElementById('reportsToggleIcon');
    const container = document.getElementById('reportsPanelContainer');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        void content.offsetWidth;
        content.classList.remove('opacity-0', '-translate-y-4');
        icon.classList.add('rotate-180');
        container.classList.add('border-red-500/30', 'shadow-[0_0_30px_rgba(239,68,68,0.1)]');
        container.classList.remove('border-white/5');
    } else {
        content.classList.add('opacity-0', '-translate-y-4');
        icon.classList.remove('rotate-180');
        container.classList.remove('border-red-500/30', 'shadow-[0_0_30px_rgba(239,68,68,0.1)]');
        container.classList.add('border-white/5');
        
        setTimeout(() => {
            content.classList.add('hidden');
        }, 300);
    }
}
