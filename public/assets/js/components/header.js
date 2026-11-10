const header = {
    _pollInterval: null,

    render() {
        document.getElementById('user-avatar').textContent = auth.getInitial();
        document.getElementById('user-display-name').textContent = auth.getFullName();
        document.getElementById('dropdown-user-name').textContent = auth.getFullName();
        const roleLabels = { owner: 'Owner', staff: 'Staff / Resepsionis', therapist: 'Terapis' };
        document.getElementById('dropdown-user-role').textContent = roleLabels[auth.getRole()] || auth.getRole();
    },

    setTitle(title) {
        document.getElementById('page-title').textContent = title;
    },

    startNotificationPolling() {
        this.loadNotificationCount();
        if (this._pollInterval) clearInterval(this._pollInterval);
        this._pollInterval = setInterval(() => this.loadNotificationCount(), 30000);
    },

    stopNotificationPolling() {
        if (this._pollInterval) {
            clearInterval(this._pollInterval);
            this._pollInterval = null;
        }
    },

    async loadNotificationCount() {
        try {
            const res = await api.get('/notifications/unread-count');
            const count = res.data?.unread_count ?? 0;
            const badge = document.getElementById('notification-badge');
            if (count > 0) {
                badge.textContent = count > 9 ? '9+' : count;
                badge.classList.remove('hidden');
                badge.classList.add('flex');
            } else {
                badge.classList.add('hidden');
                badge.classList.remove('flex');
            }
        } catch (e) {}
    }
};

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('user-menu-dropdown');
    const container = document.getElementById('user-menu-container');
    if (dropdown && container && !container.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});
