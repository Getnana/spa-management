const router = {
    routes: {},
    currentPage: null,
    currentParams: {},
    _tomSelectInstances: [],

    register(routes) {
        this.routes = routes;
    },

    async navigate(hash) {
        window.location.hash = hash;
    },

    async handleRoute() {
        this._navVersion = (this._navVersion || 0) + 1;
        const currentVersion = this._navVersion;

        const hash = window.location.hash || '#/login';
        const [path, queryString] = hash.split('?');
        const params = this.extractParams(path);

        // Find matching route
        let matchedRoute = null;
        for (const [pattern, config] of Object.entries(this.routes)) {
            const match = this.matchRoute(pattern, path);
            if (match) {
                matchedRoute = { config, params: match };
                break;
            }
        }

        if (!matchedRoute) {
            document.getElementById('page-content').innerHTML = '<div class="text-center py-20"><h2 class="text-2xl font-bold text-gray-400">404</h2><p class="text-gray-500 mt-2">Halaman tidak ditemukan</p></div>';
            return;
        }

        const { config, params: routeParams } = matchedRoute;
        this.currentParams = routeParams;

        // Check auth
        if (config.auth !== false && !auth.isLoggedIn()) {
            this.navigate('#/login');
            return;
        }

        // Check role
        if (config.roles && auth.getRole() && !config.roles.includes(auth.getRole())) {
            document.getElementById('page-content').innerHTML = '<div class="text-center py-20"><h2 class="text-2xl font-bold text-gray-400">403</h2><p class="text-gray-500 mt-2">Anda tidak memiliki akses ke halaman ini</p></div>';
            return;
        }

        // Toggle login/app shell
        if (hash === '#/login' || hash.startsWith('#/rating/')) {
            document.getElementById('login-page').classList.toggle('hidden', !hash.startsWith('#/login') && hash !== '#/login');
            document.getElementById('rating-page').classList.toggle('hidden', !hash.startsWith('#/rating/'));
            document.getElementById('app-shell').classList.add('hidden');
            document.getElementById('bottom-nav').classList.add('hidden');
        } else {
            document.getElementById('login-page').classList.add('hidden');
            document.getElementById('rating-page').classList.add('hidden');
            document.getElementById('app-shell').classList.remove('hidden');
            document.getElementById('bottom-nav').classList.remove('hidden');
            sidebar.render();
            header.render();
            header.loadNotificationCount();
        }

        // Load page
        const pageName = config.page;

        // Cleanup previous Tom Select instances
        router._tomSelectInstances.forEach(ts => {
            try { ts.destroy(); } catch {}
        });
        router._tomSelectInstances = [];

        if (typeof pages[pageName] === 'object' && typeof pages[pageName].render === 'function') {
            this.currentPage = pageName;
            await pages[pageName].render(routeParams, queryString);
            if (currentVersion !== this._navVersion) return;
        }
    },

    matchRoute(pattern, path) {
        const patternParts = pattern.split('/');
        const pathParts = path.split('/');
        if (patternParts.length !== pathParts.length) return null;

        const params = {};
        for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].substring(1)] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }
        return params;
    },

    extractParams(path) {
        return {};
    }
};

window.addEventListener('hashchange', () => router.handleRoute());
