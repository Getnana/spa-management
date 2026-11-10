const auth = {
    user: null,

    async login(username, password, extra = {}) {
        const res = await api.post('/auth/login', { username, password, ...extra });
        if (res.status) {
            auth.user = res.data;
            return res;
        }
        throw res;
    },

    async logout() {
        auth.user = null;
        try { await api.post('/auth/logout'); } catch (e) {}
        window.location.hash = '#/login';
    },

    async check() {
        try {
            const res = await api.get('/auth/me');
            if (res.status) {
                auth.user = res.data;
                return true;
            }
        } catch (e) {}
        auth.user = null;
        return false;
    },

    isLoggedIn() {
        return auth.user !== null;
    },

    getRole() {
        return auth.user?.role || null;
    },

    getUserId() {
        return auth.user?.id || null;
    },

    getTherapistId() {
        return auth.user?.therapist_id || null;
    },

    getFullName() {
        return auth.user?.full_name || '';
    },

    getInitial() {
        const name = auth.getFullName();
        return name ? name.charAt(0).toUpperCase() : '?';
    }
};
