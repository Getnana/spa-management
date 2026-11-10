pages['transactions/list'] = {
    state: {
        page: 1,
        filters: {
            start_date: '',
            end_date: '',
            payment_status: '',
            payment_method: '',
            search: '',
        },
        transactions: [],
        lastPage: 1,
        total: 0,
        loading: false,
    },

    render(params, queryString) {
        header.setTitle('Transaksi');

        // Parse query string for initial filters
        if (queryString) {
            const qs = new URLSearchParams(queryString);
            if (qs.get('page')) this.state.page = parseInt(qs.get('page'));
            if (qs.get('start_date')) this.state.filters.start_date = qs.get('start_date');
            if (qs.get('end_date')) this.state.filters.end_date = qs.get('end_date');
            if (qs.get('payment_status')) this.state.filters.payment_status = qs.get('payment_status');
            if (qs.get('payment_method')) this.state.filters.payment_method = qs.get('payment_method');
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
                            <label class="block text-xs font-medium text-gray-500 mb-1">Tanggal Mulai</label>
                            <input type="date" id="filter-start-date" value="${this.state.filters.start_date}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Tanggal Akhir</label>
                            <input type="date" id="filter-end-date" value="${this.state.filters.end_date}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Status Bayar</label>
                            <select id="filter-payment-status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Semua Status</option>
                                <option value="unpaid" ${this.state.filters.payment_status === 'unpaid' ? 'selected' : ''}>Belum Bayar</option>
                                <option value="paid" ${this.state.filters.payment_status === 'paid' ? 'selected' : ''}>Lunas</option>
                                <option value="refunded" ${this.state.filters.payment_status === 'refunded' ? 'selected' : ''}>Refund</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Metode Bayar</label>
                            <select id="filter-payment-method"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Semua Metode</option>
                                <option value="cash" ${this.state.filters.payment_method === 'cash' ? 'selected' : ''}>Cash</option>
                                <option value="transfer" ${this.state.filters.payment_method === 'transfer' ? 'selected' : ''}>Transfer</option>
                                <option value="qris" ${this.state.filters.payment_method === 'qris' ? 'selected' : ''}>QRIS</option>
                                <option value="card" ${this.state.filters.payment_method === 'card' ? 'selected' : ''}>Kartu</option>
                                <option value="other" ${this.state.filters.payment_method === 'other' ? 'selected' : ''}>Lainnya</option>
                            </select>
                        </div>
                        <div class="flex-[2] min-w-[200px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Cari</label>
                            <input type="text" id="filter-search" placeholder="Cari kode, customer, layanan..."
                                value="${this.state.filters.search}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                </div>

                <!-- Table Container -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div id="transactions-table-container"></div>
                </div>
            </div>
        `;

        this.bindFilterEvents();
        form.initTomSelect('#filter-payment-status');
        form.initTomSelect('#filter-payment-method');
        this.loadTransactions();
    },

    bindFilterEvents() {
        const self = this;

        document.getElementById('filter-start-date').addEventListener('change', function () {
            self.state.filters.start_date = this.value;
            self.state.page = 1;
            self.loadTransactions();
        });

        document.getElementById('filter-end-date').addEventListener('change', function () {
            self.state.filters.end_date = this.value;
            self.state.page = 1;
            self.loadTransactions();
        });

        document.getElementById('filter-payment-status').addEventListener('change', function () {
            self.state.filters.payment_status = this.value;
            self.state.page = 1;
            self.loadTransactions();
        });

        document.getElementById('filter-payment-method').addEventListener('change', function () {
            self.state.filters.payment_method = this.value;
            self.state.page = 1;
            self.loadTransactions();
        });

        let searchTimeout;
        document.getElementById('filter-search').addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                self.state.filters.search = this.value;
                self.state.page = 1;
                self.loadTransactions();
            }, 400);
        });
    },

    async loadTransactions() {
        const container = document.getElementById('transactions-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(8, 6);

        try {
            const queryParams = new URLSearchParams({ page: this.state.page });
            if (this.state.filters.start_date) queryParams.set('date_from', this.state.filters.start_date);
            if (this.state.filters.end_date) queryParams.set('date_to', this.state.filters.end_date);
            if (this.state.filters.payment_status) queryParams.set('payment_status', this.state.filters.payment_status);
            if (this.state.filters.payment_method) queryParams.set('payment_method', this.state.filters.payment_method);
            if (this.state.filters.search) queryParams.set('search', this.state.filters.search);

            const res = await api.get('/transactions?' + queryParams.toString());
            const { data: transactions, pagination } = res;

            const formatCurrency = (num) => new Intl.NumberFormat('id-ID').format(num);
            const formatDate = (dateStr) => {
                if (!dateStr) return '-';
                return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            };

            const statusColors = {
                unpaid: 'bg-yellow-100 text-yellow-700',
                paid: 'bg-green-100 text-green-700',
                refunded: 'bg-gray-100 text-gray-600',
            };

            const statusLabels = {
                unpaid: 'Belum Bayar',
                paid: 'Lunas',
                refunded: 'Refund',
            };

            const methodLabels = {
                cash: 'Cash',
                transfer: 'Transfer',
                qris: 'QRIS',
                card: 'Kartu',
                other: 'Lainnya',
            };

            const columns = [
                {
                    label: 'Kode',
                    render: (row) => `<span class="font-mono text-xs font-semibold text-primary-600">${row.transaction_code || '-'}</span>`,
                },
                {
                    label: 'Customer',
                    render: (row) => row.customer_name || '-',
                },
                {
                    label: 'Layanan',
                    render: (row) => row.service_name || '-',
                },
                {
                    label: 'Terapis',
                    render: (row) => row.therapist_name || '-',
                },
                {
                    label: 'Jumlah',
                    render: (row) => `<span class="font-semibold text-gray-800">Rp ${formatCurrency(row.total_amount || 0)}</span>`,
                },
                {
                    label: 'Metode',
                    render: (row) => `<span class="text-gray-600">${methodLabels[row.payment_method] || row.payment_method || '-'}</span>`,
                },
                {
                    label: 'Status',
                    render: (row) => {
                        const status = row.payment_status || row.status || '-';
                        const color = statusColors[status] || 'bg-gray-100 text-gray-500';
                        const label = statusLabels[status] || status;
                        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${label}</span>`;
                    },
                },
                {
                    label: 'Tanggal',
                    render: (row) => formatDate(row.transaction_date || row.date || row.created_at),
                },
            ];

            const isOwner = auth.getRole() === 'owner';
            const actions = (row) => `
                <button onclick="window.location.hash='#/transactions/${row.id}'" title="Lihat Detail"
                    class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </button>
                ${isOwner ? `<button onclick="pages['transactions/list'].deleteTransaction(${row.id}, '${(row.transaction_code || '').replace(/'/g, "\\'")}')" title="Hapus"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>` : ''}
            `;

            const self = this;
            const paginationConfig = pagination ? {
                current_page: pagination.current_page,
                total_pages: pagination.total_pages || Math.ceil((pagination.total || 0) / (pagination.per_page || 10)),
                total: pagination.total || 0,
                onPrev: "pages['transactions/list'].goToPage(" + (pagination.current_page - 1) + ")",
                onNext: "pages['transactions/list'].goToPage(" + (pagination.current_page + 1) + ")",
            } : null;

            container.innerHTML = table.render({
                columns,
                data: transactions,
                pagination: paginationConfig,
                actions,
                emptyText: 'Tidak ada transaksi ditemukan',
            });
        } catch (err) {
            container.innerHTML = `
                <div class="text-center py-12 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat data</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                    <button onclick="pages['transactions/list'].loadTransactions()" class="mt-3 text-sm text-primary-600 hover:underline">Coba lagi</button>
                </div>
            `;
        }
    },

    goToPage(page) {
        this.state.page = page;
        this.loadTransactions();
    },

    deleteTransaction(id, code) {
        confirmDialog.show(
            'Hapus Transaksi',
            `Apakah Anda yakin ingin menghapus transaksi "${code}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/transactions/${id}`);
                    toast.success('Transaksi berhasil dihapus');
                    this.loadTransactions();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus transaksi');
                }
            },
            'Hapus'
        );
    },
};
