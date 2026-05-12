/**
 * auth.js
 * Lógica de autenticación: login, registro,
 * animación de paneles, visibilidad de contraseña.
 */

const showRegisterBtn = document.getElementById('showRegisterBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const overlayPanel = document.getElementById('overlayPanel');
const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');
const overlayRightContent = document.getElementById('overlayRightContent');
const overlayLeftContent = document.getElementById('overlayLeftContent');

showRegisterBtn.addEventListener('click', () => {
    overlayPanel.style.transform = 'translateX(-100%)';
    document.getElementById('formsContainer').style.transform = 'translateX(100%)';
    
    // Ocultar login y quitar z-index
    loginFormContainer.classList.remove('opacity-100-custom', 'z-20');
    loginFormContainer.classList.add('opacity-0-custom', 'z-0');
    
    // Mostrar registro y darle prioridad de z-index
    registerFormContainer.classList.remove('opacity-0-custom', 'z-0');
    registerFormContainer.classList.add('opacity-100-custom', 'z-20');

    overlayRightContent.classList.remove('opacity-100');
    overlayRightContent.classList.add('opacity-0', 'pointer-events-none');
    
    overlayLeftContent.classList.remove('opacity-0', 'pointer-events-none');
    overlayLeftContent.classList.add('opacity-100');
});

showLoginBtn.addEventListener('click', () => {
    overlayPanel.style.transform = 'translateX(0)';
    document.getElementById('formsContainer').style.transform = 'translateX(0)';
    
    // Ocultar registro y quitar z-index
    registerFormContainer.classList.remove('opacity-100-custom', 'z-20');
    registerFormContainer.classList.add('opacity-0-custom', 'z-0');
    
    // Mostrar login y darle prioridad de z-index
    loginFormContainer.classList.remove('opacity-0-custom', 'z-0');
    loginFormContainer.classList.add('opacity-100-custom', 'z-20');

    overlayLeftContent.classList.remove('opacity-100');
    overlayLeftContent.classList.add('opacity-0', 'pointer-events-none');
    
    overlayRightContent.classList.remove('opacity-0', 'pointer-events-none');
    overlayRightContent.classList.add('opacity-100');
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('action', 'login');
    try {
        const res = await fetch('api/auth.php', { method: 'POST', body: formData });
        const data = await res.json();
        if(data.success) {
            window.location.href = 'index.php';
        } else {
            const msg = document.getElementById('loginMessage');
            msg.textContent = data.error || 'Error de inicio de sesión';
            msg.classList.remove('hidden');
        }
    } catch (err) {
        console.error(err);
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    //Fetch transformando el form a un JSON limpio asimilable por el DTO de Java
    const formData = new FormData(e.target);
    const jsonPayload = Object.fromEntries(formData.entries());

    const btn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = btn.innerText;
    btn.innerText = "Registrando...";
    btn.disabled = true;

    try {
        const res = await fetch(`${window.GAMITY_API_URL || 'http://localhost:8082/api/v1'}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonPayload)
        });
        const data = await res.json();

        if (res.ok && data.success) {
            // Hay éxito?: Nos lleva al panel de Login
            showLoginBtn.click();
            const msg = document.getElementById('loginMessage');
            msg.textContent = 'Registro exitoso. Ahora inicia sesión.';
            msg.classList.remove('hidden', 'text-red-500');
            msg.classList.add('text-green-500');
            document.getElementById('registerForm').reset();
            
            // Ocultar mensajes de error previos en register si existian
            document.getElementById('registerMessage').classList.add('hidden');
        } else {
            // Componente de error manejado con estética
            const msg = document.getElementById('registerMessage');
            msg.textContent = data.error || 'Error al registrar usuario';
            msg.classList.remove('hidden');
        }
    } catch (err) {
        console.error("Fallo de conexión Core Java:", err);
        const msg = document.getElementById('registerMessage');
        msg.textContent = 'Error de conexión con el servidor (Spring Boot).';
        msg.classList.remove('hidden');
    } finally {
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
});

// Función para la visibilidad de la contraseña con cambio de icono y efecto brillo
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        // Cambiar el icono visual a un "ojo tachado"
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
        `;
        // Efecto brillo de neón morado 
        button.classList.add('text-gamityPurple', 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]');
        button.classList.remove('text-gray-500');
    } else {
        input.type = 'password';
        // Volver al "ojo normal"
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        `;
        // Quitar el brillo de neón
        button.classList.remove('text-gamityPurple', 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]');
        button.classList.add('text-gray-500');
    }
}