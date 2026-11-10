pages['reports/transactions'] = {
    state: {
        data: null,
        loading: false,
        transactions: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        filters: {
            start_date: '',
            end_date: '',
            status: '',
            payment_method: ''
        }
    },

    async render(params) {
        header.setTitle('Laporan Transaksi');

        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        this.state.filters.start_date = firstDay.toISOString().split('T')[0];
        this.state.filters.end_date = today.toISOString().split('T')[0];

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Laporan Transaksi</h1>
                <p class="text-sm text-gray-500 mt-1">Laporan detail transaksi</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
                <div class="flex flex-wrap gap-3 items-end">
                    <div class="flex-1 min-w-[150px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">Tanggal Mulai</label>
                        <input type="date" id="filter-start-date"
                            value="${this.state.filters.start_date}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div class="flex-1 min-w-[150px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">Tanggal Akhir</label>
                        <input type="date" id="filter-end-date"
                            value="${this.state.filters.end_date}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    </div>
                    <div class="flex-1 min-w-[140px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
                        <select id="filter-status"
                            class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Semua Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                    <div class="flex-1 min-w-[150px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">Metode Pembayaran</label>
                        <select id="filter-payment"
                            class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Semua Metode</option>
                            <option value="cash">Cash</option>
                            <option value="transfer">Transfer</option>
                            <option value="qris">QRIS</option>
                            <option value="card">Kartu</option>
                        </select>
                    </div>
                    <button onclick="pages['reports/transactions'].loadReport()"
                        class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-xl transition text-sm whitespace-nowrap">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                        Filter
                    </button>
                    <div class="flex gap-2">
                        <a id="btn-export-pdf" href="#" target="_blank"
                            class="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded-xl transition text-sm whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                            PDF
                        </a>
                        <a id="btn-export-excel" href="#" target="_blank"
                            class="inline-flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-600 font-medium py-2 px-3 rounded-xl transition text-sm whitespace-nowrap">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            Excel
                        </a>
                    </div>
                </div>
            </div>

            <div id="summary-cards" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4"></div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div id="transaction-table-container"></div>
            </div>
        `;

        this.bindFilterEvents();
        form.initTomSelect('#filter-status');
        form.initTomSelect('#filter-payment');
        await this.loadReport();
    },

    bindFilterEvents() {
        const self = this;

        document.getElementById('filter-start-date').addEventListener('change', function () {
            self.state.filters.start_date = this.value;
        });

        document.getElementById('filter-end-date').addEventListener('change', function () {
            self.state.filters.end_date = this.value;
        });

        document.getElementById('filter-status').addEventListener('change', function () {
            self.state.filters.status = this.value;
        });

        document.getElementById('filter-payment').addEventListener('change', function () {
            self.state.filters.payment_method = this.value;
        });
    },

    getExportUrl(type) {
        const base = `/api/reports/export/${type}/transactions`;
        const params = new URLSearchParams();
        if (this.state.filters.start_date) params.set('start_date', this.state.filters.start_date);
        if (this.state.filters.end_date) params.set('end_date', this.state.filters.end_date);
        if (this.state.filters.status) params.set('status', this.state.filters.status);
        if (this.state.filters.payment_method) params.set('payment_method', this.state.filters.payment_method);
        return base + '?' + params.toString();
    },

    updateExportLinks() {
        const pdfBtn = document.getElementById('btn-export-pdf');
        const excelBtn = document.getElementById('btn-export-excel');
        if (pdfBtn) pdfBtn.href = this.getExportUrl('pdf');
        if (excelBtn) excelBtn.href = this.getExportUrl('excel');
    },

    async loadReport() {
        this.state.loading = true;

        const container = document.getElementById('transaction-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(5, 6);

        try {
            const queryParams = new URLSearchParams({ page: this.state.currentPage });
            if (this.state.filters.start_date) queryParams.set('start_date', this.state.filters.start_date);
            if (this.state.filters.end_date) queryParams.set('end_date', this.state.filters.end_date);
            if (this.state.filters.status) queryParams.set('status', this.state.filters.status);
            if (this.state.filters.payment_method) queryParams.set('payment_method', this.state.filters.payment_method);

            const res = await api.get('/reports/transactions?' + queryParams.toString());
            this.state.data = res.data || res;
            this.state.transactions = this.state.data.transactions || this.state.data.data || [];
            const pagination = this.state.data.pagination;
            this.state.currentPage = pagination?.current_page || 1;
            this.state.lastPage = pagination?.total_pages || 1;
            this.state.total = pagination?.total || 0;

            this.updateExportLinks();
            this.renderSummary();
            this.renderTable();
        } catch (err) {
            toast.error(err.message || 'Gagal memuat laporan transaksi');
            container.innerHTML = `
                <div class="text-center py-12 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat data</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                </div>
            `;
        }

        this.state.loading = false;
    },

    renderSummary() {
        const d = this.state.data;
        const summary = d.summary || {};
        const fmt = (num) => 'Rp ' + new Intl.NumberFormat('id-ID').format(num || 0);

        const cards = [
            {
                label: 'Total Transaksi',
                value: fmt(summary.total || d.total),
                color: 'bg-blue-50 text-blue-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
            },
            {
                label: 'Rata-rata',
                value: fmt(summary.average || d.average),
                color: 'bg-green-50 text-green-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
            },
            {
                label: 'Total Pajak',
                value: fmt(summary.total_tax || d.total_tax),
                color: 'bg-rose-50 text-rose-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>'
            },
            {
                label: 'Minimum',
                value: fmt(summary.min || d.min_amount),
                color: 'bg-orange-50 text-orange-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>'
            },
            {
                label: 'Maksimum',
                value: fmt(summary.max || d.max_amount),
                color: 'bg-purple-50 text-purple-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>'
            }
        ];

        const container = document.getElementById('summary-cards');
        container.innerHTML = cards.map(c => `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div class="flex items-center gap-3 mb-3">
                    <div class="${c.color} p-2.5 rounded-xl">${c.icon}</div>
                    <span class="text-sm font-medium text-gray-500">${c.label}</span>
                </div>
                <p class="text-xl font-bold text-gray-800">${c.value}</p>
            </div>
        `).join('');
    },

    renderTable() {
        const fmt = (num) => 'Rp ' + new Intl.NumberFormat('id-ID').format(num || 0);
        const fmtDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

        const statusLabels = {
            completed: 'Completed',
            pending: 'Pending',
            failed: 'Failed',
            refunded: 'Refunded',
            paid: 'Lunas',
            unpaid: 'Belum Bayar'
        };

        const statusColors = {
            completed: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            failed: 'bg-red-100 text-red-700',
            refunded: 'bg-gray-100 text-gray-700',
            paid: 'bg-green-100 text-green-700',
            unpaid: 'bg-yellow-100 text-yellow-700'
        };

        const paymentLabels = {
            cash: 'Cash',
            transfer: 'Transfer',
            qris: 'QRIS',
            card: 'Kartu'
        };

        const columns = [
            { label: 'Kode', render: (row) => `<span class="font-mono text-xs font-semibold text-primary-600">${row.code || row.transaction_code || '-'}</span>` },
            { label: 'Customer', render: (row) => row.customer_name || '-' },
            { label: 'Tanggal', render: (row) => fmtDate(row.date || row.created_at) },
            { label: 'Metode', render: (row) => paymentLabels[row.payment_method] || row.payment_method || '-' },
            {
                label: 'Status',
                render: (row) => `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.payment_status || row.status] || 'bg-gray-100 text-gray-700'}">${statusLabels[row.payment_status || row.status] || row.payment_status || row.status || '-'}</span>`
            },
            { label: 'Pajak', render: (row) => fmt(row.tax_amount || 0) },
            { label: 'Total', render: (row) => `<span class="font-semibold text-gray-800">${fmt(row.total_amount || row.amount || row.total)}</span>` },
        ];

        const actions = (row) => `
            <button onclick="window.location.hash='#/transactions/${row.id}'" title="Lihat Detail"
                class="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
        `;

        const pagination = {
            current_page: this.state.currentPage,
            total_pages: this.state.lastPage,
            total: this.state.total,
            onPrev: `pages['reports/transactions'].goToPage(${this.state.currentPage - 1})`,
            onNext: `pages['reports/transactions'].goToPage(${this.state.currentPage + 1})`,
        };

        const container = document.getElementById('transaction-table-container');
        if (!container) return;
        container.innerHTML = table.render({
            columns,
            data: this.state.transactions,
            pagination,
            actions,
            emptyText: 'Tidak ada data transaksi',
        });
    },

    goToPage(page) {
        this.state.currentPage = page;
        this.loadReport();
    }
};
