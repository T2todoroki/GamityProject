// admin-users.js
window.allUsers = [];
window.currentUsersPage = 1;
const usersPerPage = 10;

function renderUsersTable(users) {
    window.allUsers = users;
    window.currentUsersPage = 1;
    document.getElementById('tableCount').textContent = `${users.length} usuarios`;
    renderPaginatedUsers();
}

function renderPaginatedUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    // Search filter logic
    const searchTerm = (document.getElementById('searchUsers').value || '').toLowerCase();
    const filteredUsers = window.allUsers.filter(u =>
        u.username.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        (u.game_rank && u.game_rank.toLowerCase().includes(searchTerm)) ||
        (u.main_game && u.main_game.toLowerCase().includes(searchTerm))
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
    if (window.currentUsersPage > totalPages) window.currentUsersPage = totalPages;

    const startIndex = (window.currentUsersPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    document.getElementById('paginationInfo').textContent = `Mostrando ${currentUsers.length > 0 ? startIndex + 1 : 0} a ${Math.min(endIndex, filteredUsers.length)} de ${filteredUsers.length} usuarios`;
    document.getElementById('pageIndicator').textContent = `${window.currentUsersPage} / ${totalPages}`;

    document.getElementById('prevPageBtn').disabled = window.currentUsersPage === 1;
    document.getElementById('nextPageBtn').disabled = window.currentUsersPage === totalPages;

    if (currentUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-10 text-center text-gray-500">No se encontraron usuarios.</td></tr>';
        return;
    }

    tbody.innerHTML = currentUsers.map(u => {
        const isOnline = u.status === 'online';
        const roleLabel = u.role === 'admin'
            ? '<span class="px-2 py-1 rounded-full bg-gamityPurple/20 text-gamityPurple text-xs font-bold">Admin</span>'
            : '<span class="px-2 py-1 rounded-full bg-surfaceLight text-gray-400 text-xs font-medium">Usuario</span>';
        const statusDot = isOnline
            ? '<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gamityGreen shadow-[0_0_8px_#10B981]"></span> Online</span>'
            : '<span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-gray-500"></span> Offline</span>';

        return `
            <tr class="user-row neon-border-b hover:bg-white/[0.02] transition-colors">
                <td class="px-6 py-4 text-gray-400 font-mono">#${u.id}</td>
                <td class="px-6 py-4 font-semibold flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gamityPurple/20 flex items-center justify-center text-gamityPurple font-bold text-xs">${u.username.substring(0, 2).toUpperCase()}</div>
                    ${u.username}
                </td>
                <td class="px-6 py-4 text-gray-300">${u.email}</td>
                <td class="px-6 py-4 text-gray-300">${u.main_game || '-'}</td>
                <td class="px-6 py-4 text-gray-300">${u.game_rank || '-'}</td>
                <td class="px-6 py-4">${roleLabel}</td>
                <td class="px-6 py-4 text-sm">${statusDot}</td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="openEdit(${u.id}, '${u.username}', '${u.email}', '${u.role === 'admin' ? 1 : 0}', '${u.status}')" class="p-2 rounded-lg text-gray-400 hover:text-gamityPurple hover:bg-gamityPurple/10 transition-colors" title="Editar">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button onclick="deleteUser(${u.id}, '${u.username}')" class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Eliminar">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function changeUsersPage(direction) {
    window.currentUsersPage += direction;
    renderPaginatedUsers();
}

function exportUsersCSV() {
    if (!window.allUsers || window.allUsers.length === 0) {
        showToast('No hay datos para exportar', 'error');
        return;
    }

    const headers = ['ID', 'Username', 'Email', 'Rol', 'Estado', 'Juego Principal', 'Rango'];
    const csvRows = [headers.join(',')];

    window.allUsers.forEach(u => {
        const row = [
            u.id,
            `"${u.username}"`,
            `"${u.email}"`,
            `"${u.role}"`,
            `"${u.status}"`,
            `"${u.main_game || ''}"`,
            `"${u.game_rank || ''}"`
        ];
        csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gamity_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV descargado con éxito', 'success');
}

function openEdit(id, username, email, role, status) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = role;
    document.getElementById('editStatus').value = status;
    const modal = document.getElementById('editModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = document.getElementById('editUserId').value;
            const body = {
                username: document.getElementById('editUsername').value,
                email: document.getElementById('editEmail').value,
                role: document.getElementById('editRole').value,
                status: document.getElementById('editStatus').value
            };

            apiFetch(`/admin/users/${userId}`, {
                method: 'PUT',
                body: JSON.stringify(body)
            })
            .then(data => {
                if (data.success) {
                    closeModal();
                    showToast('Usuario actualizado correctamente', 'success');
                    if (typeof loadDashboard === 'function') loadDashboard();
                } else {
                    showToast(data.error || 'Error al actualizar usuario', 'error');
                }
            })
            .catch(() => {});
        });
    }
});

function deleteUser(userId, username) {
    if (!confirm(`¿Eliminar a "${username}"? Esta acción no se puede deshacer.`)) return;

    apiFetch(`/admin/users/${userId}`, {
        method: 'DELETE'
    })
    .then(data => {
        if (data.success) {
            showToast(`Usuario "${username}" eliminado`, 'info');
            if (typeof loadDashboard === 'function') loadDashboard();
        } else {
            showToast(data.error || 'Error al eliminar usuario', 'error');
        }
    })
    .catch(() => {});
}
