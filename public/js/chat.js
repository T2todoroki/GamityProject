document.addEventListener('DOMContentLoaded', () => {

    //API base URL inyectada desde PHP
    const API_BASE = window.GAMITY_API_URL || window.apiBaseUrl;
    const currentUserId = window.currentUserId;
    const prepopulatedUserId = window.prepopulatedUserId;
    
    const contactsList = document.getElementById('contactsList');
    const chatHeader = document.getElementById('chatHeader');
    const chatMessages = document.getElementById('chatMessages');
    const chatInputSection = document.getElementById('chatInputSection');
    const noChatSelected = document.getElementById('noChatSelected');
    const sendMessageForm = document.getElementById('sendMessageForm');
    const messageInput = document.getElementById('messageInput');
    const currentReceiverIdInput = document.getElementById('currentReceiverId');
    
    let pollInterval = null;
    let isBlockedByMe = false;
    let hasBlockedMe = false;
    window.currentActiveChatId = null;

    // Load Contacts, cargo los contactos (desde Spring Boot)
    async function loadContacts() {
        try {
            const res = await fetch(`${API_BASE}/friendships/friends/${currentUserId}`, {
                headers: { 
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            
            if (res.status === 401 || res.status === 403) {
                window.location.href = 'auth.php';
                return;
            }
            
            const data = await res.json();
            
            if (Array.isArray(data)) {
                //Adapto los campos del DTO de Java al formato esperado por renderContacts (que es el mismo que el de la base de datos original, para no tener que tocar esa parte)
                const friends = data.map(f => ({
                    user_id: f.id,
                    username: f.username,
                    avatar: f.avatar,
                    status: f.status || 'offline',
                    game: f.mainGame,
                    rank: f.gameRank,
                    unreadCount: f.unreadCount || 0
                }));
                renderContacts(friends);
                
                // Si hay un param user_id por URL (desde Index/Social), se abre esa conversación directamente
                if (prepopulatedUserId && !window.currentActiveChatId) {
                    const friendObj = friends.find(f => f.user_id == prepopulatedUserId);
                    if (friendObj) {
                        openConversation(friendObj);
                    }
                }
                return friends;
            }
        } catch(e) { console.error('Error cargando contactos:', e); return []; }
    }

    function renderContacts(friends) {
        if(friends.length === 0) {
            contactsList.innerHTML = `<div class="p-6 text-center text-gray-500 text-sm">No tienes contactos disponibles.</div>`;
            return;
        }

        contactsList.innerHTML = friends.map(friend => {
            const avatarUrl = friend.avatar || `https://ui-avatars.com/api/?name=${encodeURI(friend.username)}&background=18181b&color=fff`;
            const isOnline = friend.status === 'online';
            
            const unreadBadge = friend.unreadCount > 0 
                ? `<span class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/4 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse border-2 border-surface z-20">${friend.unreadCount}</span>` 
                : '';

            return `
                <div class="contact-item p-4 neon-border-b cursor-pointer flex items-center gap-4 ${window.currentActiveChatId == friend.user_id ? 'contact-active' : ''}" onclick='openConversation(${JSON.stringify(friend).replace(/'/g, "&#39;")})'>
                    <div class="relative w-12 h-12 flex-shrink-0">
                        <div class="w-full h-full rounded-full overflow-hidden border border-white/10">
                            <img src="${avatarUrl}" class="w-full h-full object-cover">
                        </div>
                        <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${isOnline ? 'bg-gamityGreen' : 'bg-gray-500'} z-10"></div>
                        ${unreadBadge}
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-white font-bold truncate ${window.currentActiveChatId == friend.user_id ? 'text-gamityPurple' : ''}">${friend.username}</h4>
                        <p class="text-xs text-gray-400 truncate mt-0.5">
                            <span class="${isOnline ? 'text-gamityGreen' : 'text-gray-500'}">●</span> ${friend.game || 'Cualquier juego'}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.openConversation = (friend) => {
        // Resetear variables de estado para el nuevo chat
        previousHasBlockedMe = null;
        previousFriendStatus = null;
        
        // Mostrar sección de chat y ocultar mensaje de "selecciona un chat"
        noChatSelected.classList.add('hidden');
        chatHeader.classList.remove('hidden');
        chatMessages.classList.remove('hidden');
        chatInputSection.classList.remove('hidden');

        // Cerrar menú de opciones si estaba abierto
        document.getElementById('chatOptionsMenu').classList.add('hidden');

        // Actualizar header del chat
        document.getElementById('chatName').textContent = friend.username;
        document.getElementById('chatAvatar').src = friend.avatar || `https://ui-avatars.com/api/?name=${encodeURI(friend.username)}&background=18181b&color=fff`;
        
        const isOnline = friend.status === 'online';
        document.getElementById('chatStatusDot').className = `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${isOnline ? 'bg-gamityGreen' : 'bg-gray-500'}`;
        
        let subtitleHtml = '';
        if(isOnline) subtitleHtml = `<span class="w-1.5 h-1.5 rounded-full bg-gamityGreen mr-1.5 shadow-[0_0_5px_#10b981]"></span> En línea`;
        else subtitleHtml = `<span class="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span> Desconectado`;
        
        if (friend.game) {
            subtitleHtml += `<span class="text-gray-500 ml-2 border-l border-white/10 pl-2 font-medium"><span class="${friend.game==='Valorant'?'text-red-400':(friend.game==='LoL'?'text-blue-400':(friend.game==='CS2'?'text-yellow-400':''))}">${friend.game}</span>${friend.rank?' - '+friend.rank:''}</span>`;
        }

        document.getElementById('chatSubtitle').innerHTML = subtitleHtml;
        
        // Guardar a quién enviar el mensaje
        window.currentActiveChatId = friend.user_id;
        if(currentReceiverIdInput) currentReceiverIdInput.value = friend.user_id;
        messageInput.focus();

        //Actualiza los estilos de la lista de contactos para marcar el activo
        loadContacts(); //recargo la lista de contactos para actualizar el estado activo.

        //Cargo los mensajes y verifico estado de bloqueo
        checkBlockStatus(friend.user_id);
        fetchMessages(friend.user_id);
        
        // Limpiamos cualquier intervalo previo para evitar peticiones duplicadas        
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(() => {
            fetchMessages(friend.user_id, true);
            checkBlockStatus(friend.user_id);
        }, 3000); // Poll cada 3s para nuevos mensajes
    };

    // Funciones de Dropdown
    document.getElementById('chatOptionsBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('chatOptionsMenu').classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        document.getElementById('chatOptionsMenu').classList.add('hidden');
    });

    // SISTEMA DE BLOQUEO Y ESTADO EN TIEMPO REAL
    let previousHasBlockedMe = null;
    let previousFriendStatus = null;

    async function checkBlockStatus(otherId) {
        try {
            const res = await fetch(`${API_BASE}/blocks/status/${currentUserId}/${otherId}`, {
                headers: { 
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                isBlockedByMe = data.isBlockedByMe;
                hasBlockedMe = data.hasBlockedMe;
                
                // Si el estado de ser bloqueado cambia en tiempo real, actualizamos el header y recargamos contactos
                if (previousHasBlockedMe !== null && previousHasBlockedMe !== hasBlockedMe) {
                    if (hasBlockedMe) {
                        // El otro usuario nos acaba de bloquear, forzamos privacidad inmediatamente
                        document.getElementById('chatAvatar').src = 'img/default.png';
                        document.getElementById('chatStatusDot').className = 'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface bg-gray-500';
                        document.getElementById('chatSubtitle').innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span> Desconectado';
                        loadContacts();
                    } else {
                        // Nos acaban de desbloquear, restauramos la información real
                        loadContacts().then(friends => {
                            if (friends) {
                                const friend = friends.find(f => f.user_id == otherId);
                                if (friend) {
                                    document.getElementById('chatAvatar').src = friend.avatar || `https://ui-avatars.com/api/?name=${encodeURI(friend.username)}&background=18181b&color=fff`;
                                    
                                    const isOnline = friend.status === 'online';
                                    document.getElementById('chatStatusDot').className = `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${isOnline ? 'bg-gamityGreen' : 'bg-gray-500'}`;
                                    
                                    let subtitleHtml = '';
                                    if(isOnline) subtitleHtml = `<span class="w-1.5 h-1.5 rounded-full bg-gamityGreen mr-1.5 shadow-[0_0_5px_#10b981]"></span> En línea`;
                                    else subtitleHtml = `<span class="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span> Desconectado`;
                                    
                                    if (friend.game) {
                                        subtitleHtml += `<span class="text-gray-500 ml-2 border-l border-white/10 pl-2 font-medium"><span class="${friend.game==='Valorant'?'text-red-400':(friend.game==='LoL'?'text-blue-400':(friend.game==='CS2'?'text-yellow-400':''))}">${friend.game}</span>${friend.rank?' - '+friend.rank:''}</span>`;
                                    }
                                    document.getElementById('chatSubtitle').innerHTML = subtitleHtml;
                                }
                            }
                        });
                    }
                } else if (!hasBlockedMe && previousFriendStatus !== null && previousFriendStatus !== data.friendStatus) {
                    // Si el estado de conexión del amigo cambió (y no estamos bloqueados)
                    const isOnline = data.friendStatus === 'online';
                    document.getElementById('chatStatusDot').className = `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${isOnline ? 'bg-gamityGreen' : 'bg-gray-500'}`;
                    
                    // Solo actualizamos el estado base, mantenemos el juego si ya estaba
                    const subtitleContainer = document.getElementById('chatSubtitle');
                    const currentSubtitle = subtitleContainer.innerHTML;
                    const gameHtml = currentSubtitle.includes('<span class="text-gray-500 ml-2 border-l') 
                        ? currentSubtitle.substring(currentSubtitle.indexOf('<span class="text-gray-500 ml-2 border-l'))
                        : '';
                        
                    let newSubtitleHtml = '';
                    if(isOnline) newSubtitleHtml = `<span class="w-1.5 h-1.5 rounded-full bg-gamityGreen mr-1.5 shadow-[0_0_5px_#10b981]"></span> En línea`;
                    else newSubtitleHtml = `<span class="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span> Desconectado`;
                    
                    subtitleContainer.innerHTML = newSubtitleHtml + gameHtml;
                    loadContacts(); // Recargar contactos para que cambie la bolita en el sidebar también
                }

                previousHasBlockedMe = hasBlockedMe;
                previousFriendStatus = data.friendStatus;

                updateChatUIForBlock();
            }
        } catch (e) { console.error('Error checking block status', e); }
    }

    function updateChatUIForBlock() {
        const blockBtnText = document.querySelector('#blockUserBtn span');
        if (isBlockedByMe) {
            blockBtnText.textContent = 'Desbloquear';
            chatInputSection.innerHTML = `<div class="p-4 text-center text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 text-sm font-medium">Has bloqueado a este usuario. Desbloquéalo para enviar mensajes.</div>`;
        } else {
            blockBtnText.textContent = 'Bloquear';
            // Restaurar input siempre que no lo hayamos bloqueado nosotros
            chatInputSection.innerHTML = `
                <form id="sendMessageForm" class="flex gap-4 items-end bg-surfaceLight rounded-2xl border border-white/10 p-2 relative shadow-lg">
                    <textarea id="messageInput" name="content" rows="1" placeholder="Escribe un mensaje..." class="flex-1 bg-transparent border-none focus:ring-0 resize-none text-white placeholder-gray-500 py-3 block w-full"></textarea>
                    <button type="submit" class="p-3 bg-gamityPurple text-white rounded-xl hover:bg-gamityPurple/80 transition transform hover:scale-105 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                        <svg class="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                    </button>
                </form>
            `;
            // Re-vincular eventos al nuevo form
            const newForm = document.getElementById('sendMessageForm');
            const newInput = document.getElementById('messageInput');
            newForm.addEventListener('submit', handleSendMessage);
            newInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); newForm.dispatchEvent(new Event('submit')); }
            });
        }
    }

    window.toggleBlockUser = async () => {
        const otherId = window.currentActiveChatId;
        const method = isBlockedByMe ? 'DELETE' : 'POST';
        try {
            const res = await fetch(`${API_BASE}/blocks/${currentUserId}/${otherId}`, { 
                method,
                headers: { 
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            if (res.ok) {
                checkBlockStatus(otherId);
            }
        } catch (e) { console.error('Error toggling block', e); }
    };

    // VACIAR CHAT
    window.confirmClearChat = () => {
        document.getElementById('clearChatModal').classList.remove('hidden');
    };

    window.executeClearChat = async () => {
        const otherId = window.currentActiveChatId;
        try {
            const res = await fetch(`${API_BASE}/messages/clear/${currentUserId}/${otherId}`, { 
                method: 'DELETE',
                headers: { 
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            if (res.ok) {
                document.getElementById('clearChatModal').classList.add('hidden');
                chatMessages.innerHTML = '';
            }
        } catch (e) { console.error('Error clearing chat', e); }
    };

    // REPORTAR
    window.reportUser = () => {
        document.getElementById('reportModal').classList.remove('hidden');
    };

    window.executeReport = async () => {
        const otherId = window.currentActiveChatId;
        const reason = document.getElementById('reportReason').value;
        try {
            // Capturar la evidencia (últimos 10 mensajes)
            let evidenceText = "No hay mensajes recientes.";
            const historyRes = await fetch(`${API_BASE}/messages/history/${currentUserId}/${otherId}`, {
                headers: { 
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            if (historyRes.ok) {
                const historyData = await historyRes.json();
                if (historyData.success && historyData.messages) {
                    const lastMessages = historyData.messages.slice(-10);
                    if (lastMessages.length > 0) {
                        evidenceText = lastMessages.map(m => {
                            const date = new Date(m.created_at);
                            const timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                            return `[${timeStr}] ${m.sender_name}: ${m.content}`;
                        }).join('\n');
                    }
                }
            }

            await fetch(`${API_BASE}/reports`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                },
                body: JSON.stringify({ 
                    reporter_id: currentUserId, 
                    reported_user_id: parseInt(otherId), 
                    reason: reason,
                    evidence: evidenceText
                })
            });
            document.getElementById('reportModal').classList.add('hidden');
            alert('Reporte enviado correctamente. Nuestro equipo lo revisará pronto.');
        } catch (e) { console.error('Error reporting', e); }
    };

    async function fetchMessages(otherId, isPolling = false) {
        try {
            // Mostrar estado de carga si no es polling
            if (!isPolling && chatMessages.innerHTML === '') {
                chatMessages.innerHTML = `<div class="flex-1 flex justify-center items-center"><svg class="animate-spin h-8 w-8 text-gamityPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`;
            }

            const res = await fetch(`${API_BASE}/messages/history/${currentUserId}/${otherId}`, {
                headers: { 
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
            
            if (res.status === 401 || res.status === 403) {
                window.location.href = 'auth.php';
                return;
            }
            
            const data = await res.json();
            
            if(data.success) {
                const previousCount = chatMessages.children.length;
                renderMessages(data.messages);
                
                // Marcar como leídos si no está scrolleado muy arriba
                if (chatMessages.scrollHeight - chatMessages.scrollTop <= chatMessages.clientHeight + 100) {
                    // Verificar si hay mensajes no leídos del otro usuario en esta carga
                    const hasUnread = data.messages.some(m => m.sender_id == otherId && !m.is_read);
                    if (hasUnread) {
                        markMessagesAsRead(otherId).then(() => {
                            // Una vez marcados como leídos en la BD, recargamos la lista de contactos para que desaparezca la bolita
                            loadContacts();
                            // Y recargamos la bolita global del menú izquierdo
                            if (typeof window.checkUnreadMessages === 'function') {
                                window.checkUnreadMessages();
                            }
                        });
                    }
                }
                
                //Solo scrollear abajo si no es polling pasivo O si llegaron nuevos mensajes
                if (!isPolling || chatMessages.children.length > previousCount) {
                    setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 100);
                }
            }
        } catch(e) { console.error(e); }
    }

    async function markMessagesAsRead(otherId) {
        try {
            return await fetch(`${API_BASE}/messages/read/${otherId}/${currentUserId}`, { 
                method: 'PUT',
                headers: { 
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                }
            });
        } catch (e) { console.error('Error marking as read', e); }
    }

    function renderMessages(messages) {
        if(messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-10">
                    <span class="bg-surfaceLight px-4 py-1 rounded-full text-xs font-medium border border-white/5 shadow-inner">Hoy</span>
                    <p class="mt-4 text-sm font-medium">Esta es la historia de vuestra conversación.</p>
                </div>
            `;
            return;
        }

        // Genera el HTML
        const htmlArray = messages.map(msg => {
            const isMe = parseInt(msg.sender_id) === currentUserId;
            const time = new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            if (isMe) {
                let checkIcon = '<svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'; // Enviado
                if (msg.is_read) {
                    checkIcon = '<div class="flex -space-x-1.5"><svg class="w-3 h-3 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg><svg class="w-3 h-3 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg></div>'; // Leído (Doble check morado)
                } else if (msg.is_delivered) {
                    checkIcon = '<div class="flex -space-x-1.5"><svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>'; // Entregado (Doble check gris)
                }

                return `
                <div class="flex w-full justify-end group">
                    <div class="max-w-[70%] flex flex-col items-end">
                        <div class="bg-messageMe text-white px-5 py-3 rounded-2xl bubble-me shadow-[0_5px_15px_rgba(139,92,246,0.2)] flex items-end gap-2">
                            <p class="text-sm leading-relaxed">${escapeHTML(msg.content)}</p>
                            <span class="inline-flex items-center self-end mb-0.5 ml-1">${checkIcon}</span>
                        </div>
                        <span class="text-[10px] text-gray-500 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity">${time}</span>
                    </div>
                </div>
                `;
            } else {
                //Otro usuario
                return `
                <div class="flex w-full justify-start items-end gap-2 group">
                    <div class="w-6 h-6 rounded-full overflow-hidden border border-white/10 mb-5 flex-shrink-0">
                        <img src="${document.getElementById('chatAvatar').src}" class="w-full h-full object-cover">
                    </div>
                    <div class="max-w-[70%] flex flex-col items-start">
                        <div class="bg-messageOther text-gray-200 px-5 py-3 rounded-2xl border border-white/5 bubble-other">
                            <p class="text-sm leading-relaxed">${escapeHTML(msg.content)}</p>
                        </div>
                        <span class="text-[10px] text-gray-500 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">${time}</span>
                    </div>
                </div>
                `;
            }
        });

        chatMessages.innerHTML = htmlArray.join('');
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const content = document.getElementById('messageInput').value.trim();
        const receiverId = window.currentActiveChatId;
        
        if(!content || !receiverId || isBlockedByMe) return;

        // Limpiar input inmediatamente para mejorar la experiencia del usuario, el mensaje se agregará al chat cuando la respuesta del servidor confirme que se envió correctamente
        document.getElementById('messageInput').value = '';
        
        const payload = {
            sender_id: currentUserId,
            receiver_id: parseInt(receiverId),
            content: content
        };
        
        try {
            const res = await fetch(`${API_BASE}/messages/send`, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Id': currentUserId,
                    'X-User-Hash': window.currentUserHash || ''
                },
                body: JSON.stringify(payload) 
            });
            
            if (res.status === 401 || res.status === 403) {
                window.location.href = 'auth.php';
                return;
            }
            
            const data = await res.json();
            if(data.success) {
                fetchMessages(receiverId); //Refresca los mensajes para mostrar el nuevo mensaje enviado (y cualquier otro que haya llegado)
            } else {
                alert('Error al enviar: ' + data.error);
            }
        } catch(e) { 
            console.error('Error enviando mensaje: ', e); 
            alert('Falló el envío del mensaje');
        }
    };

    if(sendMessageForm) sendMessageForm.addEventListener('submit', handleSendMessage);

    // Permite enviar el mensaje con Enter (sin Shift), y hacer un salto de línea con Shift+Enter
    if(messageInput) messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('sendMessageForm').dispatchEvent(new Event('submit'));
        }
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Carga inicial de contactos
    loadContacts();
});
