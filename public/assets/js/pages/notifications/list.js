pages['notifications/list'] = {
    state: {
        notifications: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
    },

    timeAgo(dateStr) {
        if (!dateStr) return '';
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        const diffWeek = Math.floor(diffDay / 7);
        const diffMonth = Math.floor(diffDay / 30);

        if (diffSec < 60) return 'Baru saja';
        if (diffMin < 60) return `${diffMin} menit lalu`;
        if (diffHour < 24) return `${diffHour} jam lalu`;
        if (diffDay < 7) return `${diffDay} hari lalu`;
        if (diffWeek < 4) return `${diffWeek} minggu lalu`;
        return `${diffMonth} bulan lalu`;
    },

    async render(params) {
        header.setTitle('Notifikasi');
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-gray-800">Notifikasi</h1>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">Pemberitahuan dan aktivitas terbaru</p>
                </div>
                <button id="btn-mark-all-read"
                    onclick="pages['notifications/list'].markAllRead()"
                    class="inline-flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-600 font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Tandai Semua Dibaca
                </button>
            </div>

            <div id="notification-list" class="space-y-3"></div>

            <div id="notification-pagination" class="mt-6"></div>
        `;

        await this.loadNotifications();
    },

    async loadNotifications() {
        if (this.state.loading) return;
        this.state.loading = true;

        const container = document.getElementById('notification-list');
        if (!container) return;
        if (this.state.notifications.length === 0) {
            container.innerHTML = skeleton.notificationCard(4);
        }

        try {
            const res = await api.get(`/notifications?page=${this.state.currentPage}`);
            this.state.notifications = res.data || [];
            const pagination = res.pagination;
            this.state.currentPage = pagination?.current_page || 1;
            this.state.lastPage = pagination?.total_pages || 1;
            this.state.total = pagination?.total || 0;
        } catch (err) {
            toast.error(err.message || 'Gagal memuat notifikasi');
            this.state.notifications = [];
        }

        this.state.loading = false;
        this.renderList();
    },

    renderList() {
        const container = document.getElementById('notification-list');
        if (!container) return;
        const notifications = this.state.notifications;

        if (!notifications.length) {
            container.innerHTML = `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <svg class="w-16 h-16 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <p class="text-gray-400 font-medium">Tidak ada notifikasi</p>
                    <p class="text-sm text-gray-300 mt-1">Semua sudah dibaca</p>
                </div>
            `;
            document.getElementById('notification-pagination').innerHTML = '';
            return;
        }

        container.innerHTML = notifications.map(n => {
            const isRead = n.is_read || n.read_at;
            const cardClass = isRead
                ? 'bg-white border-gray-100'
                : 'bg-blue-50/50 border-blue-100 border-l-4 border-l-blue-400';

            const titleClass = isRead
                ? 'text-gray-700 font-medium'
                : 'text-gray-900 font-semibold';

            const messageClass = isRead
                ? 'text-gray-400'
                : 'text-gray-500';

            const dotHtml = isRead
                ? ''
                : '<span class="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></span>';

            const typeIcon = this.getTypeIcon(n.type);

            return `
                <div class="${cardClass} rounded-2xl shadow-sm border p-5 cursor-pointer hover:shadow-md transition"
                    onclick="pages['notifications/list'].markRead(${n.id}, this)">
                    <div class="flex items-start gap-4">
                        <div class="${isRead ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                            ${typeIcon}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                ${dotHtml}
                                <h3 class="${titleClass} text-sm truncate">${n.title || 'Notifikasi'}</h3>
                            </div>
                            <p class="${messageClass} text-sm leading-relaxed line-clamp-2">${n.message || n.body || ''}</p>
                            <p class="text-xs text-gray-300 mt-2">${this.timeAgo(n.created_at)}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.renderPagination();
    },

    getTypeIcon(type) {
        const icons = {
            booking: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
            payment: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
            system: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
            alert: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
        };
        return icons[type] || icons.system;
    },

    renderPagination() {
        const container = document.getElementById('notification-pagination');
        if (this.state.lastPage <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = `<div class="flex items-center justify-between text-sm text-gray-500">
            <span>Halaman ${this.state.currentPage} dari ${this.state.lastPage} (${this.state.total} notifikasi)</span>
            <div class="flex gap-1">`;

        if (this.state.currentPage > 1) {
            html += `<button onclick="pages['notifications/list'].goToPage(${this.state.currentPage - 1})" class="px-3 py-1 border rounded-lg hover:bg-gray-50 transition">Prev</button>`;
        }
        if (this.state.currentPage < this.state.lastPage) {
            html += `<button onclick="pages['notifications/list'].goToPage(${this.state.currentPage + 1})" class="px-3 py-1 border rounded-lg hover:bg-gray-50 transition">Next</button>`;
        }

        html += '</div></div>';
        container.innerHTML = html;
    },

    async markRead(notificationId, el) {
        const notification = this.state.notifications.find(n => n.id === notificationId);
        if (!notification || (notification.is_read || notification.read_at)) return;

        try {
            await api.put(`/notifications/${notificationId}/read`);
            notification.is_read = true;
            notification.read_at = new Date().toISOString();

            // Update card styling in place
            if (el) {
                el.classList.remove('bg-blue-50/50', 'border-blue-100', 'border-l-4', 'border-l-blue-400');
                el.classList.add('bg-white', 'border-gray-100');
                const dot = el.querySelector('.bg-blue-500');
                if (dot) dot.remove();
                const iconWrapper = el.querySelector('.bg-blue-100');
                if (iconWrapper) {
                    iconWrapper.classList.remove('bg-blue-100', 'text-blue-600');
                    iconWrapper.classList.add('bg-gray-100', 'text-gray-400');
                }
            }
            header.loadNotificationCount();
        } catch (err) {
            toast.error(err.message || 'Gagal menandai notifikasi');
        }
    },

    async markAllRead() {
        try {
            await api.put('/notifications/read-all');
            this.state.notifications.forEach(n => {
                n.is_read = true;
                n.read_at = new Date().toISOString();
            });
            this.renderList();
            header.loadNotificationCount();
            toast.success('Semua notifikasi ditandai dibaca');
        } catch (err) {
            toast.error(err.message || 'Gagal menandai semua notifikasi');
        }
    },

    goToPage(page) {
        this.state.currentPage = page;
        this.loadNotifications();
    }
};
