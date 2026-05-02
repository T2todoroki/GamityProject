document.addEventListener('DOMContentLoaded', () => {

    // ── API base URL y userId inyectados desde PHP (social.php) ──
    const API_BASE = window.apiBaseUrl || 'http://localhost:8082/api/v1';
    const USER_ID  = window.currentUserId;

    const tabReq = document.getElementById('tabRequests');
    const tabFri = document.getElementById('tabFriends');
    const contReq = document.getElementById('contentRequests');
    const contFri = document.getElementById('contentFriends');

    // Tab Switching
    tabReq.addEventListener('click', () => {
        tabReq.classList.replace('tab-inactive', 'tab-active');
        tabFri.classList.replace('tab-active', 'tab-inactive');
        contReq.classList.remove('hidden');
        contFri.classList.add('hidden');
        loadRequests();
    });

    tabFri.addEventListener('click', () => {
        tabFri.classList.replace('tab-inactive', 'tab-active');
        tabReq.classList.replace('tab-active', 'tab-inactive');
        contFri.classList.remove('hidden');
        contReq.classList.add('hidden');
        loadFriends();
    });

    const renderEmpty = (message, icon) => `
        <div class="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg class="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg>
            <p class="text-sm">${message}</p>
        </div>
    `;