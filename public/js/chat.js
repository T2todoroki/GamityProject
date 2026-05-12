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

    // Load Contacts, cargo los contactos (desde Spring Boot)
    async function loadContacts() {
        try {
            const res = await fetch(`${API_BASE}/friendships/friends/${currentUserId}`, {
                headers: { 'X-User-Id': currentUserId }
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
                    rank: f.gameRank
                }));
                renderContacts(friends);
                
                // Si hay un param user_id por URL (desde Index/Social), se abre esa conversación directamente
                if (prepopulatedUserId) {
                    const friendObj = friends.find(f => f.user_id == prepopulatedUserId);
                    if (friendObj) {
                        openConversation(friendObj);
                    }
                }
            }
        } catch(e) { console.error('Error cargando contactos:', e); }
    }

    function renderContacts(friends) {
        if(friends.length === 0) {
            contactsList.innerHTML = `<div class="p-6 text-center text-gray-500 text-sm">No tienes contactos disponibles.</div>`;
            return;
        }

        contactsList.innerHTML = friends.map(friend => {
            const avatarUrl = friend.avatar || `https://ui-avatars.com/api/?name=${encodeURI(friend.username)}&background=18181b&color=fff`;
            const isOnline = friend.status === 'online';
            
            return `
                <div class="contact-item p-4 neon-border-b cursor-pointer flex items-center gap-4 ${currentReceiverIdInput.value == friend.user_id ? 'contact-active' : ''}" onclick='openConversation(${JSON.stringify(friend).replace(/'/g, "&#39;")})'>
                    <div class="w-12 h-12 rounded-full overflow-hidden border border-white/10 relative flex-shrink-0">
                        <img src="${avatarUrl}" class="w-full h-full object-cover">
                        <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${isOnline ? 'bg-gamityGreen' : 'bg-gray-500'}"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-white font-bold truncate ${currentReceiverIdInput.value == friend.user_id ? 'text-gamityPurple' : ''}">${friend.username}</h4>
                        <p class="text-xs text-gray-400 truncate mt-0.5">
                            <span class="${isOnline ? 'text-gamityGreen' : 'text-gray-500'}">●</span> ${friend.game || 'Cualquier juego'}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }

    window.openConversation = (friend) => {
        // Mostrar sección de chat y ocultar mensaje de "selecciona un chat"
        noChatSelected.classList.add('hidden');
        chatHeader.classList.remove('hidden');
        chatMessages.classList.remove('hidden');
        chatInputSection.classList.remove('hidden');

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
        
        // Form hidden input para saber a quién enviar el mensaje
        currentReceiverIdInput.value = friend.user_id;
        messageInput.focus();

        //Actualiza los estilos de la lista de contactos para marcar el activo
        loadContacts(); //recargo la lista de contactos para actualizar el estado activo.

        //Cargo los mensajes
        fetchMessages(friend.user_id);
        
        // Limpiamos cualquier intervalo previo para evitar peticiones duplicadas        
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(() => fetchMessages(friend.user_id, true), 3000); // Poll cada 3s para nuevos mensajes
    };

    async function fetchMessages(otherId, isPolling = false) {
        try {
            // Mostrar estado de carga si no es polling
            if (!isPolling && chatMessages.innerHTML === '') {
                chatMessages.innerHTML = `<div class="flex-1 flex justify-center items-center"><svg class="animate-spin h-8 w-8 text-gamityPurple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>`;
            }

            const res = await fetch(`${API_BASE}/messages/history/${currentUserId}/${otherId}`, {
                headers: { 'X-User-Id': currentUserId }
            });
            
            if (res.status === 401 || res.status === 403) {
                window.location.href = 'auth.php';
                return;
            }
            
            const data = await res.json();
            
            if(data.success) {
                const previousCount = chatMessages.children.length;
                renderMessages(data.messages);
                
                //Solo scrollear abajo si no es polling pasivo O si llegaron nuevos mensajes
                if (!isPolling || chatMessages.children.length > previousCount) {
                    setTimeout(() => { chatMessages.scrollTop = chatMessages.scrollHeight; }, 100);
                }
            }
        } catch(e) { console.error(e); }
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
                return `
                <div class="flex w-full justify-end group">
                    <div class="max-w-[70%] flex flex-col items-end">
                        <div class="bg-messageMe text-white px-5 py-3 rounded-2xl bubble-me shadow-[0_5px_15px_rgba(139,92,246,0.2)]">
                            <p class="text-sm leading-relaxed">${escapeHTML(msg.content)}</p>
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

    sendMessageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();
        const receiverId = currentReceiverIdInput.value;
        
        if(!content || !receiverId) return;

        // Limpiar input inmediatamente para mejorar la experiencia del usuario, el mensaje se agregará al chat cuando la respuesta del servidor confirme que se envió correctamente
        messageInput.value = '';
        
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
                    'X-User-Id': currentUserId
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
    });

    // Permite enviar el mensaje con Enter (sin Shift), y hacer un salto de línea con Shift+Enter
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageForm.dispatchEvent(new Event('submit'));
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
