document.addEventListener('DOMContentLoaded', () => {

    const contentBracket = document.getElementById('contentBracket');

    // Estado de chat
    window.premierChatInterval = null;
    window.premierCurrentTeamChatId = null;

    window.loadHallOfFame = function() {
        contentBracket.innerHTML = `
            <div class="bg-surface p-8 rounded-2xl border border-white/10 text-center py-16 animate-pulse">
                <i class="fa-solid fa-spinner fa-spin text-4xl text-gamityPurple/50 mb-4"></i>
                <p class="text-gray-400 text-sm">Cargando Campeones...</p>
            </div>
        `;
        
        fetch(`${window.GAMITY_API_URL}/tournaments/champions`, {
            headers: { 
                'X-User-Id': window.currentUserId,
                'X-User-Hash': window.currentUserHash || ''
            }
        })
            .then(async res => {
                const text = await res.text();
                if (!text) return null;
                try { return JSON.parse(text); } 
                catch (e) { console.error("Invalid JSON:", text); return null; }
            })
            .then(data => {
                if (!data || data.length === 0) {
                    contentBracket.innerHTML = `
                        <div class="bg-surface p-12 rounded-3xl border border-white/10 text-center py-20 animate-premierFadeIn relative overflow-hidden">
                            <i class="fa-solid fa-ghost text-6xl text-gray-600 mb-6 relative z-10"></i>
                            <h3 class="text-2xl font-bold text-gray-300 mb-2 relative z-10">Aún no hay campeones en Matchmaking</h3>
                            <p class="text-gray-500 max-w-md mx-auto relative z-10">¡Entra a la cola, gana tu primera partida 5v5 y graba tu nombre en la historia de Gamity!</p>
                        </div>
                    `;
                    return;
                }

                let historyHtml = data.map((c, index) => {
                    const isLatest = index === 0;
                    return `
                    <div class="flex items-center justify-between p-5 bg-surfaceLight rounded-2xl border ${isLatest ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/5 hover:border-gamityPurple/30'} transition-all group">
                        <div class="flex items-center gap-5">
                            <div class="relative">
                                <img src="${c.avatar}" class="w-14 h-14 rounded-xl object-cover border-2 ${isLatest ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'border-gamityPurple/50'}" />
                                ${isLatest ? '<div class="absolute -top-3 -right-3 text-yellow-500 text-xl drop-shadow-md"><i class="fa-solid fa-crown"></i></div>' : ''}
                            </div>
                            <div>
                                <h4 class="font-black ${isLatest ? 'text-yellow-500 text-xl' : 'text-white text-lg'}">${c.username}</h4>
                                <p class="text-xs text-gray-400 flex items-center gap-2 mt-1 font-bold">
                                    <i class="fa-solid fa-medal text-gamityPurple"></i> ${c.premier_wins} Victorias en la Temporada
                                </p>
                            </div>
                        </div>
                        <div class="text-right hidden sm:block">
                            <span class="inline-block px-4 py-1.5 rounded-lg ${isLatest ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-gamityPurple/10 text-gamityPurple border border-gamityPurple/20'} text-xs font-bold tracking-wider uppercase">
                                TOP #${index + 1}
                            </span>
                        </div>
                    </div>
                `}).join('');

                contentBracket.innerHTML = `
                <div class="bg-surface p-8 md:p-10 rounded-3xl border border-white/10 animate-premierFadeIn shadow-xl">
                    <div class="flex flex-col md:flex-row items-center justify-between mb-10 pb-8 border-b border-white/5 gap-4">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-gamityPurple/10 rounded-2xl border border-gamityPurple/30 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                                <i class="fa-solid fa-medal text-4xl text-gamityPurple"></i>
                            </div>
                            <div>
                                <h3 class="text-3xl font-black text-white tracking-tight">Salón de la Fama</h3>
                                <p class="text-sm text-gray-400 mt-1">Los últimos campeones del Matchmaking Express</p>
                            </div>
                        </div>
                    </div>
                    <div class="space-y-4 max-w-4xl mx-auto">
                        ${historyHtml}
                    </div>
                </div>
            `;
            })
            .catch(err => {
                console.error(err);
                contentBracket.innerHTML = `
                    <div class="bg-surface p-8 rounded-2xl border border-red-500/20 text-center text-red-400 py-10">
                        <i class="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
                        <p>Error al cargar el Salón de la Fama.</p>
                    </div>
                `;
            });
    }

    // Chat Logic
    window.openTeamChat = function (teamId) {
        window.premierCurrentTeamChatId = teamId;
        if (window.premierChatInterval) clearInterval(window.premierChatInterval);

        document.getElementById('chat-modal').classList.remove('hidden');
        fetchMessages(teamId); // Fetch immediately

        window.premierChatInterval = setInterval(() => {
            fetchMessages(teamId);
        }, 3000);
    };

    window.closeChat = function () {
        if (window.premierChatInterval) clearInterval(window.premierChatInterval);
        window.premierCurrentTeamChatId = null;
        document.getElementById('chat-modal').classList.add('hidden');
    };

    function fetchMessages(teamId) {
        fetch(`${window.GAMITY_API_URL}/tournaments/team/${teamId}/chat`, {
            headers: { 
                'X-User-Id': window.currentUserId,
                'X-User-Hash': window.currentUserHash || ''
            }
        })
            .then(async res => {
                const text = await res.text();
                if (!text) return null;
                try { return JSON.parse(text); } 
                catch (e) { console.error("Invalid JSON:", text); return null; }
            })
            .then(messages => {
                if (!messages || !Array.isArray(messages)) return;
                const container = document.getElementById('chat-messages');
                container.innerHTML = messages.map(m => {
                    const isMe = (m.user_id || m.sender_id) == window.currentUserId;
                    const timeStr = m.created_at ? new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
                    
                    if (isMe) {
                        return `
                        <div class="flex justify-end mb-2 w-full">
                            <div class="bg-gamityPurple text-white px-3 py-1.5 rounded-xl rounded-tr-sm shadow-md max-w-[85%] flex flex-col">
                                <p class="text-sm leading-relaxed">${m.content}</p>
                                <span class="text-[10px] text-white/70 text-right mt-0.5 ml-4 flex items-center justify-end gap-1">${timeStr} <i class="fa-solid fa-check-double text-[10px]"></i></span>
                            </div>
                        </div>
                        `;
                    } else {
                        const colors = ['text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-pink-400', 'text-cyan-400'];
                        const nameColor = colors[(m.user_id || m.sender_id || 0) % colors.length];
                        
                        return `
                        <div class="flex justify-start mb-2 w-full">
                            <div class="bg-surfaceLight border border-white/5 text-gray-200 px-3 py-1.5 rounded-xl rounded-tl-sm shadow-md max-w-[85%] flex flex-col">
                                <span class="text-xs font-bold mb-0.5 ${nameColor}">${m.username || 'Usuario'}</span>
                                <p class="text-sm leading-relaxed">${m.content}</p>
                                <span class="text-[10px] text-white/40 text-right mt-0.5 ml-4">${timeStr}</span>
                            </div>
                        </div>
                        `;
                    }
                }).join('');
                container.scrollTop = container.scrollHeight;
            })
            .catch(err => console.error('Error fetching chat', err));
    }

    function sendTeamMessage() {
        const input = document.getElementById('chat-input');
        if (!input) return;
        const content = input.value.trim();
        if (!content || !window.premierCurrentTeamChatId) return;

        input.value = '';

        fetch(`${window.GAMITY_API_URL}/tournaments/team/${window.premierCurrentTeamChatId}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Id': window.currentUserId,
                'X-User-Hash': window.currentUserHash || ''
            },
            body: JSON.stringify({ content: content })
        })
            .then(async res => {
                const text = await res.text();
                if (!text) return null;
                try { return JSON.parse(text); } 
                catch (e) { console.error("Invalid JSON:", text); return null; }
            })
            .then(data => {
                if (data?.success) {
                    fetchMessages(window.premierCurrentTeamChatId);
                }
            });
    }

    document.getElementById('chat-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        sendTeamMessage();
    });

    const chatInputElem = document.getElementById('chat-input');
    if (chatInputElem) {
        chatInputElem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendTeamMessage();
            }
        });
    }

});
