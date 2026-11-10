pages['bookings/list'] = {
    state: {
        page: 1,
        filters: {
            date: '',
            status: '',
            search: ''
        }
    },

    render(params, queryString) {
        header.setTitle('Bookings');

        // Parse query string for initial filters
        if (queryString) {
            const qs = new URLSearchParams(queryString);
            if (qs.get('page')) this.state.page = parseInt(qs.get('page'));
            if (qs.get('status')) this.state.filters.status = qs.get('status');
            if (qs.get('search')) this.state.filters.search = qs.get('search');
        }

        const container = document.getElementById('page-content');
        container.innerHTML = `
            <div class="space-y-4">
                <!-- Filter Bar -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <!-- Mobile filter toggle -->
                    <button id="filter-toggle" class="md:hidden w-full flex items-center justify-between py-2 text-sm font-medium text-gray-700"
                        onclick="document.getElementById('filter-fields').classList.toggle('hidden'); this.querySelector('.chevron').classList.toggle('rotate-180');">
                        <span class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                            Filter & Pencarian
                        </span>
                        <svg class="w-4 h-4 chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div id="filter-fields" class="hidden md:flex flex-wrap gap-3 items-end">
                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
                            <input type="date" id="filter-date" value="${this.state.filters.date}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
                            <select id="filter-status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Semua Status</option>
                                <option value="pending" ${this.state.filters.status === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="confirmed" ${this.state.filters.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="in_progress" ${this.state.filters.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                <option value="completed" ${this.state.filters.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="cancelled" ${this.state.filters.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                <option value="no_show" ${this.state.filters.status === 'no_show' ? 'selected' : ''}>No Show</option>
                            </select>
                        </div>
                        <div class="flex-[2] min-w-[200px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Cari</label>
                            <input type="text" id="filter-search" placeholder="Cari kode, customer, layanan..."
                                value="${this.state.filters.search}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <a href="#/bookings/new"
                            class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-xl transition text-sm whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            <span class="hidden sm:inline">New Booking</span><span class="sm:hidden">+ Booking</span>
                        </a>
                    </div>
                </div>

                <!-- Mobile add button (always visible) -->
                <a href="#/bookings/new"
                    class="md:hidden flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-xl transition text-sm shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Booking Baru
                </a>

                <!-- Table Container -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div id="bookings-table-container"></div>
                </div>
            </div>
        `;

        this.bindFilterEvents();
        form.initTomSelect('#filter-status');
        this.loadBookings();
    },

    bindFilterEvents() {
        const self = this;

        document.getElementById('filter-date').addEventListener('change', function () {
            self.state.filters.date = this.value;
            self.state.page = 1;
            self.loadBookings();
        });

        document.getElementById('filter-status').addEventListener('change', function () {
            self.state.filters.status = this.value;
            self.state.page = 1;
            self.loadBookings();
        });

        let searchTimeout;
        document.getElementById('filter-search').addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                self.state.filters.search = this.value;
                self.state.page = 1;
                self.loadBookings();
            }, 400);
        });
    },

    async loadBookings() {
        const container = document.getElementById('bookings-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(8, 6);

        try {
            const queryParams = new URLSearchParams({ page: this.state.page });
            if (this.state.filters.date) queryParams.set('date', this.state.filters.date);
            if (this.state.filters.status) queryParams.set('status', this.state.filters.status);
            if (this.state.filters.search) queryParams.set('search', this.state.filters.search);

            const res = await api.get('/bookings?' + queryParams.toString());
            const { data: bookings, pagination } = res;

            const statusLabels = {
                pending: 'Pending',
                confirmed: 'Confirmed',
                in_progress: 'In Progress',
                awaiting_payment: 'Menunggu Bayar',
                completed: 'Completed',
                cancelled: 'Cancelled',
                no_show: 'No Show'
            };

            const sourceLabels = {
                walk_in: 'Walk-in',
                whatsapp: 'WA',
                phone: 'Telp',
                online: 'Online'
            };

            const formatCurrency = (num) => new Intl.NumberFormat('id-ID').format(num);
            const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '-';

            const columns = [
                { label: 'Kode', render: (row) => `<span class="font-mono text-xs font-semibold text-primary-600">${row.booking_code || row.code}</span>` },
                { label: 'Customer', render: (row) => row.customer_name || '-' },
                { label: 'Layanan', render: (row) => row.service_names || row.service_name || '-' },
                { label: 'Terapis', render: (row) => row.therapist_name || '-' },
                { label: 'Ruangan', render: (row) => row.room_name || '-' },
                { label: 'Tanggal', render: (row) => formatDate(row.booking_date) },
                { label: 'Waktu', render: (row) => row.end_time ? `${formatTime(row.start_time)} - ${formatTime(row.end_time)}` : formatTime(row.start_time) },
                {
                    label: 'Status',
                    render: (row) => `<span class="badge badge-${row.status}">${statusLabels[row.status] || row.status}</span>`
                },
                {
                    label: 'Sumber',
                    render: (row) => `<span class="badge badge-source-${row.source}">${sourceLabels[row.source] || row.source || '-'}</span>`
                }
            ];

            const isOwner = auth.getRole() === 'owner';
            const actions = (row) => `
                <button onclick="window.location.hash='#/bookings/${row.id}'" title="Lihat Detail"
                    class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                ${row.status === 'pending' ? `<button onclick="window.location.hash='#/bookings/${row.id}/edit'" title="Edit"
                    class="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>` : ''}
                ${(isOwner || row.status === 'pending') ? `<button onclick="pages['bookings/list'].deleteBooking(${row.id}, '${(row.booking_code || row.code || '').replace(/'/g, "\\'")}')" title="Hapus"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>` : ''}
            `;

            const self = this;
            const paginationConfig = pagination ? {
                current_page: pagination.current_page,
                total_pages: pagination.total_pages || Math.ceil((pagination.total || 0) / (pagination.per_page || 10)),
                total: pagination.total || 0,
                onPrev: "pages['bookings/list'].goToPage(" + (pagination.current_page - 1) + ")",
                onNext: "pages['bookings/list'].goToPage(" + (pagination.current_page + 1) + ")"
            } : null;

            container.innerHTML = table.render({
                columns,
                data: bookings,
                pagination: paginationConfig,
                actions,
                emptyText: 'Tidak ada booking ditemukan'
            });

        } catch (err) {
            container.innerHTML = `
                <div class="text-center py-12 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat data</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                    <button onclick="pages['bookings/list'].loadBookings()" class="mt-3 text-sm text-primary-600 hover:underline">Coba lagi</button>
                </div>
            `;
        }
    },

    goToPage(page) {
        this.state.page = page;
        this.loadBookings();
    },

    deleteBooking(id, code) {
        confirmDialog.show(
            'Hapus Booking',
            `Apakah Anda yakin ingin menghapus booking "${code}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/bookings/${id}`);
                    toast.success('Booking berhasil dihapus');
                    this.loadBookings();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus booking');
                }
            },
            'Hapus'
        );
    }
};
