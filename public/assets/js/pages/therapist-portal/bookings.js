pages['therapist-portal/bookings'] = {
    state: {
        page: 1,
        filters: {
            date: '',
            status: ''
        }
    },

    render(params) {
        header.setTitle('Booking Saya');
        const container = document.getElementById('page-content');

        container.innerHTML = `
            <div class="space-y-4">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div class="flex flex-wrap gap-3 items-end">
                        <div class="flex-1 min-w-[160px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
                            <input type="date" id="filter-date" value="${this.state.filters.date}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div class="flex-1 min-w-[160px]">
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
                    </div>
                </div>

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
    },

    async loadBookings() {
        const container = document.getElementById('bookings-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(6, 6);

        try {
            const queryParams = new URLSearchParams({ page: this.state.page });
            if (this.state.filters.date) queryParams.set('date', this.state.filters.date);
            if (this.state.filters.status) queryParams.set('status', this.state.filters.status);

            const res = await api.get('/therapist/my-bookings?' + queryParams.toString());
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

            const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '-';

            const columns = [
                { label: 'Kode', render: (row) => `<span class="font-mono text-xs font-semibold text-primary-600">${row.booking_code || row.code}</span>` },
                { label: 'Customer', render: (row) => row.customer_name || '-' },
                { label: 'Layanan', render: (row) => row.service_names || row.service_name || '-' },
                { label: 'Tanggal', render: (row) => formatDate(row.booking_date) },
                { label: 'Waktu', render: (row) => `${formatTime(row.start_time)} - ${formatTime(row.end_time)}` },
                {
                    label: 'Status',
                    render: (row) => `<span class="badge badge-${row.status}">${statusLabels[row.status] || row.status}</span>`
                }
            ];

            const actions = (row) => {
                let btns = `<button onclick="pages['therapist-portal/bookings'].viewDetail(${row.id})" class="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition">Detail</button>`;
                if (row.status === 'confirmed') {
                    btns += `<button onclick="pages['therapist-portal/bookings'].startTreatment(${row.id})" class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition">Mulai Treatment</button>`;
                }
                if (row.status === 'in_progress') {
                    btns += `<button onclick="pages['therapist-portal/bookings'].completeTreatment(${row.id})" class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition">Selesai Treatment</button>`;
                }
                return btns;
            };

            const paginationConfig = pagination ? {
                current_page: pagination.current_page,
                total_pages: pagination.total_pages || Math.ceil((pagination.total || 0) / (pagination.per_page || 10)),
                total: pagination.total || 0,
                onPrev: `pages['therapist-portal/bookings'].goToPage(${pagination.current_page - 1})`,
                onNext: `pages['therapist-portal/bookings'].goToPage(${pagination.current_page + 1})`
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
                    <button onclick="pages['therapist-portal/bookings'].loadBookings()" class="mt-3 text-sm text-primary-600 hover:underline">Coba lagi</button>
                </div>
            `;
        }
    },

    async startTreatment(id) {
        confirmDialog.show('Mulai Treatment', 'Apakah Anda ingin memulai treatment ini?', async () => {
            try {
                await api.put(`/bookings/${id}/treatment-status`, { status: 'in_progress' });
                toast.success('Treatment dimulai');
                this.loadBookings();
            } catch (err) {
                toast.error(err.message || 'Gagal memulai treatment');
            }
        });
    },

    async completeTreatment(id) {
        confirmDialog.show('Selesai Treatment', 'Apakah treatment sudah selesai?', async () => {
            try {
                await api.put(`/bookings/${id}/treatment-status`, { status: 'awaiting_payment' });
                toast.success('Treatment selesai. Menunggu pembayaran.');
                this.loadBookings();
            } catch (err) {
                toast.error(err.message || 'Gagal menyelesaikan treatment');
            }
        });
    },

    async viewDetail(id) {
        window.location.hash = '#/bookings/' + id;
    },

    goToPage(page) {
        this.state.page = page;
        this.loadBookings();
    }
};
