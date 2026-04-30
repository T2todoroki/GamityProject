/**
 * GAMITY - profile.js
 * Lógica exclusiva del perfil: carga de datos, guardado,
 * añadir filas de juegos, toggle de tema.
 */

// --- Avatar Modal Logic ---
let selectedAvatarSrc = null;

window.openAvatarModal = function() {
    const modal = document.getElementById('avatarModal');
    if (modal) {
        modal.classList.remove('hidden');
        selectedAvatarSrc = null;
        document.querySelectorAll('.avatar-option').forEach(el => {
            el.classList.remove('border-gamityPurple');
            el.classList.add('border-transparent');
        });
        const btn = document.getElementById('confirmAvatarBtn');
        if (btn) {
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
};

window.closeAvatarModal = function() {
    const modal = document.getElementById('avatarModal');
    if (modal) modal.classList.add('hidden');
};

window.selectAvatar = function(src, element) {
    selectedAvatarSrc = src;
    
    // 1. Quitar la clase CSS de selección a todos y añadirla al clickeado
    document.querySelectorAll('.avatar-option').forEach(el => {
        el.classList.remove('border-gamityPurple', 'scale-110');
        el.classList.add('border-transparent');
    });
    element.classList.remove('border-transparent');
    element.classList.add('border-gamityPurple', 'scale-110');
    
    // 2. Feedback visual inmediato en el perfil principal (Preview)
    const profileAvatarPreview = document.getElementById('profileAvatar');
    if (profileAvatarPreview) profileAvatarPreview.src = src;
    
    const headerAvatarPreview = document.getElementById('headerAvatar');
    if (headerAvatarPreview) headerAvatarPreview.src = src;
    
    const btn = document.getElementById('confirmAvatarBtn');
    if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
};

window.saveAvatar = async function() {
    if (!selectedAvatarSrc) return;
    
    // 1. Actualizar las imágenes de preview locales
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) profileAvatar.src = selectedAvatarSrc;
    
    const headerAvatar = document.getElementById('headerAvatar');
    if (headerAvatar) {
        headerAvatar.src = selectedAvatarSrc;
        headerAvatar.classList.remove('hidden');
        const headerInitials = document.getElementById('headerInitials');
        if (headerInitials) headerInitials.classList.add('hidden');
    }
    
    // 2. Cerrar el modal
    window.closeAvatarModal();
    
    // 3. Avisar al usuario visualmente (Toast opcional)
    if (typeof showToast === 'function') {
        showToast('Avatar preview fijado. Dale a "Guardar Cambios" abajo para aplicarlo.', 'success');
    }
};

// ===== ADD GAME ROW =====
function addGameRow(selectedGame = "", selectedRank = "") {
    const container = document.getElementById("gamesContainer");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "profile-game-row grid grid-cols-1 md:grid-cols-2 gap-4 group mb-4";
    row.innerHTML = `
        <div>
            <label class="profile-label flex items-center gap-2">
                <svg class="w-4 h-4 text-gamityPurple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
                Juego Principal
            </label>
            <select name="main_game[]" class="input-gamity w-full appearance-none cursor-pointer">
                <option value="" ${selectedGame === "" ? "selected" : ""}>Ninguno seleccionado</option>
                <option value="Valorant" ${selectedGame === "Valorant" ? "selected" : ""}>Valorant</option>
                <option value="LoL" ${selectedGame === "LoL" ? "selected" : ""}>League of Legends</option>
                <option value="CS2" ${selectedGame === "CS2" ? "selected" : ""}>Counter Strike 2</option>
                <option value="Minecraft" ${selectedGame === "Minecraft" ? "selected" : ""}>Minecraft</option>
                <option value="Fortnite" ${selectedGame === "Fortnite" ? "selected" : ""}>Fortnite</option>
            </select>
        </div>
        <div>
            <label class="profile-label flex items-center gap-2">
                <svg class="w-4 h-4 text-gamityGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                Rango Actual
            </label>
            <select name="game_rank[]" class="input-gamity w-full appearance-none cursor-pointer">
                <option value="" ${selectedRank === "" ? "selected" : ""}>Sin clasificar</option>
                <option value="Hierro" ${selectedRank === "Hierro" ? "selected" : ""}>Hierro</option>
                <option value="Bronce" ${selectedRank === "Bronce" ? "selected" : ""}>Bronce</option>
                <option value="Plata" ${selectedRank === "Plata" ? "selected" : ""}>Plata</option>
                <option value="Oro" ${selectedRank === "Oro" ? "selected" : ""}>Oro</option>
                <option value="Platino" ${selectedRank === "Platino" ? "selected" : ""}>Platino</option>
                <option value="Diamante" ${selectedRank === "Diamante" ? "selected" : ""}>Diamante</option>
                <option value="Ascendente" ${selectedRank === "Ascendente" ? "selected" : ""}>Ascendente</option>
                <option value="Inmortal" ${selectedRank === "Inmortal" ? "selected" : ""}>Inmortal</option>
                <option value="Radiante/Global" ${selectedRank === "Radiante/Global" ? "selected" : ""}>Top / Global Elite</option>
            </select>
        </div>
        <button type="button" class="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-lg" onclick="this.parentElement.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    `;
    container.appendChild(row);
}
