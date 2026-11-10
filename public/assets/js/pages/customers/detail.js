pages['customers/detail'] = {
    state: {
        customer: null,
        history: [],
        activeTab: 'bookings',
    },

    async render(params) {
        const id = params.id;
        header.setTitle('Detail Customer');

        const content = document.getElementById('page-content');
        content.innerHTML = skeleton.detail();

        try {
            const res = await api.get(`/customers/${id}`);
            this.state.customer = res.data;
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data customer');
            content.innerHTML = '<div class="text-center py-12 text-red-400 text-sm">Data tidak ditemukan</div>';
            return;
        }

        header.setTitle(this.state.customer.name || 'Detail Customer');
        this.renderDetail(id);
    },

    renderDetail(id) {
        const c = this.state.customer;
        const content = document.getElementById('page-content');

        const formatDate = (dateStr) => {
            if (!dateStr) return '-';
            return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        content.innerHTML = `
            <div class="mb-6">
                <button onclick="window.location.hash='#/customers'" class="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Customers
                </button>
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-800">${c.name || '-'}</h1>
                    <button onclick="window.location.hash='#/customers/${id}/edit'"
                        class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-xl transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Edit
                    </button>
                </div>
            </div>

            <!-- Customer Info Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Telepon</p>
                        <p class="text-sm text-gray-800">${c.phone || '-'}</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Email</p>
                        <p class="text-sm text-gray-800">${c.email || '-'}</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Total Kunjungan</p>
                        <p class="text-sm text-gray-800 font-semibold">${c.total_visits || 0}x</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Status Member</p>
                        ${c.is_member
                            ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Member</span>'
                            : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Non-Member</span>'}
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Terdaftar</p>
                        <p class="text-sm text-gray-800">${formatDate(c.created_at)}</p>
                    </div>
                    ${c.notes ? `
                    <div class="sm:col-span-2 lg:col-span-3">
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Catatan</p>
                        <p class="text-sm text-gray-600">${c.notes}</p>
                    </div>` : ''}
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div class="border-b border-gray-100">
                    <nav class="flex gap-0">
                        <button onclick="pages['customers/detail'].switchTab('bookings', ${id})"
                            id="tab-bookings"
                            class="px-6 py-3 text-sm font-medium border-b-2 transition ${this.state.activeTab === 'bookings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                            Bookings
                        </button>
                        <button onclick="pages['customers/detail'].switchTab('transactions', ${id})"
                            id="tab-transactions"
                            class="px-6 py-3 text-sm font-medium border-b-2 transition ${this.state.activeTab === 'transactions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}">
                            Transaksi
                        </button>
                    </nav>
                </div>
                <div id="tab-content" class="p-6">
                    ${skeleton.table(4, 3)}
                </div>
            </div>
        `;

        this.loadTab(id, this.state.activeTab);
    },

    async switchTab(tab, id) {
        this.state.activeTab = tab;

        document.getElementById('tab-bookings').className = `px-6 py-3 text-sm font-medium border-b-2 transition ${tab === 'bookings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`;
        document.getElementById('tab-transactions').className = `px-6 py-3 text-sm font-medium border-b-2 transition ${tab === 'transactions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`;

        document.getElementById('tab-content').innerHTML = skeleton.table(4, 3);

        await this.loadTab(id, tab);
    },

    async loadTab(id, tab) {
        const container = document.getElementById('tab-content');

        try {
            const res = await api.get(`/customers/${id}/history`);
            const history = res.data || [];
            this.state.history = history;

            if (tab === 'bookings') {
                this.renderBookings(container, history.bookings || history || []);
            } else {
                this.renderTransactions(container, history.transactions || history || []);
            }
        } catch (err) {
            container.innerHTML = `<div class="text-center py-8 text-red-400 text-sm">${err.message || 'Gagal memuat riwayat'}</div>`;
        }
    },

    renderBookings(container, bookings) {
        if (!bookings || bookings.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">Belum ada riwayat booking</div>';
            return;
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return '-';
            return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-blue-100 text-blue-700',
            awaiting_payment: 'bg-orange-100 text-orange-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
            'no-show': 'bg-gray-100 text-gray-600',
        };

        const columns = [
            {
                label: 'Tanggal',
                render: (row) => formatDate(row.booking_date || row.date),
            },
            {
                label: 'Layanan',
                render: (row) => row.service_name || row.service || '-',
            },
            {
                label: 'Terapis',
                render: (row) => row.therapist_name || row.therapist || '-',
            },
            {
                label: 'Status',
                render: (row) => {
                    const color = statusColors[row.status] || 'bg-gray-100 text-gray-500';
                    const label = row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : '-';
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${label}</span>`;
                },
            },
        ];

        const actions = (row) => {
            if (row.id) {
                return `<button onclick="window.location.hash='#/bookings/${row.id}'" class="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition">Lihat</button>`;
            }
            return '';
        };

        container.innerHTML = table.render({
            columns,
            data: bookings,
            actions,
            emptyText: 'Belum ada riwayat booking',
        });
    },

    renderTransactions(container, transactions) {
        if (!transactions || transactions.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">Belum ada riwayat transaksi</div>';
            return;
        }

        const formatDate = (dateStr) => {
            if (!dateStr) return '-';
            return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const formatCurrency = (num) => {
            if (!num && num !== 0) return '-';
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
        };

        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-700',
            paid: 'bg-green-100 text-green-700',
            failed: 'bg-red-100 text-red-700',
            refunded: 'bg-gray-100 text-gray-600',
        };

        const columns = [
            {
                label: 'Invoice',
                render: (row) => `<span class="font-mono text-xs text-gray-600">${row.invoice_number || row.invoice || '-'}</span>`,
            },
            {
                label: 'Tanggal',
                render: (row) => formatDate(row.transaction_date || row.date || row.created_at),
            },
            {
                label: 'Total',
                render: (row) => `<span class="font-semibold text-gray-800">${formatCurrency(row.total || row.amount)}</span>`,
            },
            {
                label: 'Status',
                render: (row) => {
                    const color = statusColors[row.payment_status || row.status] || 'bg-gray-100 text-gray-500';
                    const status = row.payment_status || row.status || '-';
                    const label = status.charAt(0).toUpperCase() + status.slice(1);
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${label}</span>`;
                },
            },
        ];

        const actions = (row) => {
            if (row.id) {
                return `<button onclick="window.location.hash='#/transactions/${row.id}'" class="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition">Lihat</button>`;
            }
            return '';
        };

        container.innerHTML = table.render({
            columns,
            data: transactions,
            actions,
            emptyText: 'Belum ada riwayat transaksi',
        });
    },
};
