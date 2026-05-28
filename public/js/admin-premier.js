// admin-premier.js
function renderDisputedMatches(matches) {
    const premierSection = document.getElementById('premierSection');
    const tbody = document.getElementById('disputedMatchesBody');
    if (!premierSection || !tbody) return;

    document.getElementById('disputedCount').textContent = `${matches.length} disputas`;

    if (matches.length > 0) {
        premierSection.classList.remove('hidden');
    } else {
        premierSection.classList.add('hidden');
        return;
    }

    tbody.innerHTML = matches.map(m => {
        const team1ReportedWinner = m.team1_reported_winner ? 'Ganador: Equipo ' + m.team1_reported_winner : 'No reportado';
        const team2ReportedWinner = m.team2_reported_winner ? 'Ganador: Equipo ' + m.team2_reported_winner : 'No reportado';

        return `
            <tr class="user-row neon-border-b hover:bg-white/[0.02] transition-colors">
                <td class="px-6 py-4 text-yellow-400 font-mono">#${m.id}</td>
                <td class="px-6 py-4 font-bold text-white">${m.team1_name}</td>
                <td class="px-6 py-4 font-bold text-white">${m.team2_name}</td>
                <td class="px-6 py-4 text-gray-300">
                    <span class="px-3 py-1 bg-surfaceLight border border-white/5 rounded-lg text-xs font-medium block w-max">${team1ReportedWinner}</span>
                </td>
                <td class="px-6 py-4 text-gray-300">
                    <span class="px-3 py-1 bg-surfaceLight border border-white/5 rounded-lg text-xs font-medium block w-max">${team2ReportedWinner}</span>
                </td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="resolveDisputedMatch(${m.id}, ${m.team1_id})" class="px-3 py-2 rounded-xl bg-gamityPurple/10 hover:bg-gamityPurple/30 text-gamityPurple border border-gamityPurple/20 transition-all text-xs font-bold" title="Dar victoria al Equipo 1">
                            Gana Eq 1
                        </button>
                        <button onclick="resolveDisputedMatch(${m.id}, ${m.team2_id})" class="px-3 py-2 rounded-xl bg-gamityGreen/10 hover:bg-gamityGreen/30 text-gamityGreen border border-gamityGreen/20 transition-all text-xs font-bold" title="Dar victoria al Equipo 2">
                            Gana Eq 2
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function resolveDisputedMatch(matchId, winnerTeamId) {
    if (!confirm('¿Estás seguro de resolver esta disputa dando la victoria a este equipo?')) return;

    apiFetch(`/admin/matches/${matchId}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ winner_team_id: winnerTeamId })
    })
    .then(data => {
        if (data.success) {
            showToast('Disputa resuelta correctamente', 'success');
            if(typeof loadDashboard === 'function') loadDashboard();
        } else {
            showToast(data.error || 'Error al resolver la disputa', 'error');
        }
    })
    .catch(() => {});
}
