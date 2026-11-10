const sidebar = {
    menuItems: {
        owner: [
            { label: 'Dashboard', icon: 'home', route: '#/' },
            { label: 'Bookings', icon: 'calendar', route: '#/bookings' },
            { label: 'Customers', icon: 'users', route: '#/customers' },
            { label: 'Layanan', icon: 'sparkles', route: '#/services', children: [
                { label: 'Daftar Layanan', route: '#/services' },
                { label: 'Kategori', route: '#/categories' },
            ]},
            { label: 'Terapis', icon: 'user-check', route: '#/therapists' },
            { label: 'Ruangan', icon: 'door', route: '#/rooms' },
            { label: 'Transaksi', icon: 'credit-card', route: '#/transactions' },
            { label: 'Laporan', icon: 'chart-bar', route: '#/reports/revenue', children: [
                { label: 'Pendapatan', route: '#/reports/revenue' },
                { label: 'Transaksi', route: '#/reports/transactions' },
                { label: 'Kinerja Terapis', route: '#/reports/therapist' },
            ]},
            { label: 'Users', icon: 'user-cog', route: '#/users' },
            { label: 'Pengaturan', icon: 'cog', route: '#/settings/recaptcha' },
            { label: 'Audit Log', icon: 'shield', route: '#/audit-logs' },
        ],
        staff: [
            { label: 'Bookings', icon: 'calendar', route: '#/bookings' },
            { label: '+ Booking Baru', icon: 'plus-circle', route: '#/bookings/new', highlight: true },
            { label: 'Customers', icon: 'users', route: '#/customers' },
            { label: 'Transaksi', icon: 'credit-card', route: '#/transactions' },
        ],
        therapist: [
            { label: 'Jadwal Saya', icon: 'calendar', route: '#/my-schedule' },
            { label: 'Booking Saya', icon: 'list', route: '#/my-bookings' },
            { label: 'Rating Saya', icon: 'star', route: '#/my-ratings' },
            { label: 'Performa', icon: 'trending-up', route: '#/my-performance' },
        ],
    },

    icons: {
        'home': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
        'calendar': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
        'users': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
        'sparkles': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
        'user-check': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
        'credit-card': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
        'chart-bar': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
        'user-cog': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
        'shield': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
        'plus-circle': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        'cash': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
        'list': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>',
        'star': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>',
        'trending-up': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
        'bell': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>',
        'door': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
        'cog': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    },

    renderNav(menu, activeHash) {
        return menu.map(item => {
            const isActive = activeHash.startsWith(item.route) || (item.children && item.children.some(c => activeHash.startsWith(c.route)));
            const activeClass = isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10';
            const highlightClass = item.highlight ? 'border border-primary-400 text-primary-300' : '';

            if (item.children) {
                const childrenHtml = item.children.map(child => {
                    const childActive = activeHash.startsWith(child.route);
                    return `<a href="${child.route}" class="block pl-12 pr-3 py-2 text-sm rounded-lg ${childActive ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}">${child.label}</a>`;
                }).join('');
                return `<div class="space-y-1">
                    <button onclick="this.nextElementSibling.classList.toggle('hidden')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeClass} transition text-sm font-medium">
                        ${this.icons[item.icon] || ''}<span class="flex-1 text-left">${item.label}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div class="${isActive ? '' : 'hidden'} space-y-0.5">${childrenHtml}</div>
                </div>`;
            }

            return `<a href="${item.route}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg ${activeClass} ${highlightClass} transition text-sm font-medium">
                ${this.icons[item.icon] || ''}<span>${item.label}</span>
            </a>`;
        }).join('');
    },

    render() {
        const role = auth.getRole();
        const menu = this.menuItems[role] || [];
        const hash = window.location.hash;
        const navHtml = this.renderNav(menu, hash);

        document.getElementById('sidebar-nav-desktop').innerHTML = navHtml;
        document.getElementById('sidebar-nav-mobile').innerHTML = navHtml;

        const roleLabels = { owner: 'Owner', staff: 'Staff', therapist: 'Terapis' };
        document.getElementById('sidebar-role-badge').textContent = roleLabels[role] || role;

        this.restoreDesktopState();

        // Bottom nav (first 4 items, no children) + hamburger toggle
        const bottomItems = menu.filter(i => !i.children).slice(0, 4);
        document.getElementById('bottom-nav-items').innerHTML = bottomItems.map(item => {
            const isActive = hash.startsWith(item.route);
            const activeClass = isActive ? 'text-primary-600' : 'text-gray-400';
            return `<a href="${item.route}" class="flex flex-col items-center gap-0.5 ${activeClass} transition">
                ${this.icons[item.icon] || ''}
                <span class="text-[10px] font-medium">${item.label.length > 10 ? item.label.substring(0, 8) + '..' : item.label}</span>
            </a>`;
        }).join('') + `
            <button onclick="document.getElementById('sidebar-mobile').classList.remove('hidden'); document.getElementById('sidebar-overlay').classList.remove('hidden'); document.body.classList.add('no-scroll');" class="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary-600 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                <span class="text-[10px] font-medium">Menu</span>
            </button>`;
    },

    toggleDesktop() {
        const sidebar = document.getElementById('sidebar-desktop');
        const icon = document.getElementById('sidebar-toggle-icon');
        const collapsed = sidebar.classList.toggle('sidebar-collapsed');
        icon.classList.toggle('rotated', collapsed);
        localStorage.setItem('sidebar-collapsed', collapsed);
    },

    restoreDesktopState() {
        const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
        const sidebar = document.getElementById('sidebar-desktop');
        const icon = document.getElementById('sidebar-toggle-icon');
        if (collapsed) {
            sidebar.classList.add('sidebar-collapsed');
            icon.classList.add('rotated');
        }
    }
};
