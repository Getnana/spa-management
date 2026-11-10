pages['therapist-portal/ratings'] = {
    state: {
        page: 1,
        ratings: [],
        summary: null
    },

    render(params) {
        header.setTitle('Rating Saya');
        const container = document.getElementById('page-content');

        container.innerHTML = `
            <div class="space-y-6">
                <!-- Summary Card -->
                <div id="rating-summary"></div>

                <!-- Rating List -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-base font-semibold text-gray-800 mb-4">Daftar Rating</h3>
                    <div id="rating-list-container"></div>
                </div>
            </div>
        `;

        this.loadRatings();
    },

    renderStars(rating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                html += '<svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            } else {
                html += '<svg class="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
            }
        }
        return html;
    },

    async loadRatings() {
        const summaryEl = document.getElementById('rating-summary');
        const listEl = document.getElementById('rating-list-container');

        summaryEl.innerHTML = `
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="skeleton-pulse w-20 h-3 rounded-lg mb-2"></div>
                    <div class="skeleton-pulse w-16 h-8 rounded-lg"></div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="skeleton-pulse w-24 h-3 rounded-lg mb-2"></div>
                    <div class="skeleton-pulse w-12 h-8 rounded-lg"></div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="skeleton-pulse w-20 h-3 rounded-lg mb-2"></div>
                    <div class="skeleton-pulse w-16 h-8 rounded-lg"></div>
                </div>
            </div>`;
        listEl.innerHTML = skeleton.notificationCard(5);

        try {
            const res = await api.get(`/therapist/my-ratings?page=${this.state.page}`);
            this.state.ratings = res.data || [];
            this.state.summary = res.summary || null;

            this.renderSummary();
            this.renderList(res.pagination);
        } catch (err) {
            summaryEl.innerHTML = '';
            listEl.innerHTML = `
                <div class="text-center py-12 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat data</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                    <button onclick="pages['therapist-portal/ratings'].loadRatings()" class="mt-3 text-sm text-primary-600 hover:underline">Coba lagi</button>
                </div>
            `;
        }
    },

    renderSummary() {
        const el = document.getElementById('rating-summary');
        const s = this.state.summary;

        if (!s) {
            el.innerHTML = '';
            return;
        }

        const avg = (s.average_rating || 0).toFixed(1);
        const total = s.total_ratings || 0;

        el.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="text-center">
                        <p class="text-5xl font-bold text-gray-800">${avg}</p>
                        <div class="flex justify-center mt-2">${this.renderStars(Math.round(s.average_rating || 0))}</div>
                        <p class="text-sm text-gray-500 mt-1">${total} rating</p>
                    </div>
                    <div class="flex-1 w-full">
                        ${this.renderDistribution(s.distribution || {})}
                    </div>
                </div>
            </div>
        `;
    },

    renderDistribution(dist) {
        let html = '<div class="space-y-1.5">';
        for (let i = 5; i >= 1; i--) {
            const count = dist[i] || 0;
            const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
            const pct = Math.round((count / total) * 100);
            html += `
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-500 w-3">${i}</span>
                    <svg class="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <div class="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div class="bg-yellow-400 h-full rounded-full transition-all" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-xs text-gray-500 w-8 text-right">${count}</span>
                </div>
            `;
        }
        html += '</div>';
        return html;
    },

    renderList(pagination) {
        const el = document.getElementById('rating-list-container');
        const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

        if (this.state.ratings.length === 0) {
            el.innerHTML = '<p class="text-center text-sm text-gray-400 py-8">Belum ada rating</p>';
            return;
        }

        let html = '<div class="divide-y divide-gray-100">';

        this.state.ratings.forEach(r => {
            html += `
                <div class="py-4 first:pt-0 last:pb-0">
                    <div class="flex items-start justify-between mb-1">
                        <div>
                            <p class="font-medium text-gray-800 text-sm">Customer</p>
                            <p class="text-xs text-gray-500">${r.service_name || '-'}</p>
                        </div>
                        <span class="text-xs text-gray-400">${formatDate(r.created_at)}</span>
                    </div>
                    <div class="flex items-center gap-1 mb-1">
                        ${this.renderStars(r.rating || 0)}
                        <span class="text-xs text-gray-500 ml-1">${r.rating || 0}/5</span>
                    </div>
                    ${r.comment ? `<p class="text-sm text-gray-600 mt-1">${r.comment}</p>` : ''}
                </div>
            `;
        });

        html += '</div>';

        // Pagination
        if (pagination && pagination.total_pages > 1) {
            html += `
                <div class="flex items-center justify-center gap-2 mt-6">
                    <button onclick="pages['therapist-portal/ratings'].goToPage(${pagination.current_page - 1})"
                        ${pagination.current_page <= 1 ? 'disabled' : ''}
                        class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 ${pagination.current_page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'} transition">
                        Sebelumnya
                    </button>
                    <span class="text-sm text-gray-500">${pagination.current_page} / ${pagination.total_pages}</span>
                    <button onclick="pages['therapist-portal/ratings'].goToPage(${pagination.current_page + 1})"
                        ${pagination.current_page >= pagination.total_pages ? 'disabled' : ''}
                        class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 ${pagination.current_page >= pagination.total_pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'} transition">
                        Selanjutnya
                    </button>
                </div>
            `;
        }

        el.innerHTML = html;
    },

    goToPage(page) {
        this.state.page = page;
        this.loadRatings();
    }
};
