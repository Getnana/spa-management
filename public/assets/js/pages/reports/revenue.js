pages['reports/revenue'] = {
    state: {
        data: null,
        loading: false,
        filters: {
            start_date: '',
            end_date: '',
            period: 'daily'
        }
    },

    async render(params) {
        header.setTitle('Laporan Pendapatan');

        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        this.state.filters.start_date = firstDay.toISOString().split('T')[0];
        this.state.filters.end_date = today.toISOString().split('T')[0];

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Laporan Pendapatan</h1>
                <p class="text-sm text-gray-500 mt-1">Analisis pendapatan bisnis</p>
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
                        <label class="block text-xs font-medium text-gray-500 mb-1">Periode</label>
                        <select id="filter-period"
                            class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                            <option value="daily" selected>Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                        </select>
                    </div>
                    <button onclick="pages['reports/revenue'].loadReport()"
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

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
                <h2 class="text-base font-semibold text-gray-800 mb-4">Grafik Pendapatan</h2>
                <div class="h-72">
                    <canvas id="revenue-chart"></canvas>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 class="text-base font-semibold text-gray-800 mb-4">Detail Per Periode</h2>
                <div id="revenue-table-container"></div>
            </div>
        `;

        this.bindFilterEvents();
        form.initTomSelect('#filter-period');
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

        document.getElementById('filter-period').addEventListener('change', function () {
            self.state.filters.period = this.value;
        });
    },

    getExportUrl(type) {
        const base = `/api/reports/export/${type}/revenue`;
        const params = new URLSearchParams();
        if (this.state.filters.start_date) params.set('start_date', this.state.filters.start_date);
        if (this.state.filters.end_date) params.set('end_date', this.state.filters.end_date);
        if (this.state.filters.period) params.set('period', this.state.filters.period);
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

        const tableContainer = document.getElementById('revenue-table-container');
        if (!tableContainer) return;
        tableContainer.innerHTML = skeleton.table(5, 6);

        try {
            const queryParams = new URLSearchParams();
            if (this.state.filters.start_date) queryParams.set('start_date', this.state.filters.start_date);
            if (this.state.filters.end_date) queryParams.set('end_date', this.state.filters.end_date);
            if (this.state.filters.period) queryParams.set('period', this.state.filters.period);

            const res = await api.get('/reports/revenue?' + queryParams.toString());
            this.state.data = res.data || res;

            this.updateExportLinks();
            this.renderSummary();
            this.renderChart();
            this.renderTable();
        } catch (err) {
            toast.error(err.message || 'Gagal memuat laporan pendapatan');
            tableContainer.innerHTML = `
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
                label: 'Total Gross',
                value: fmt(summary.total_gross || d.total_gross),
                color: 'bg-blue-50 text-blue-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
            },
            {
                label: 'Total Net',
                value: fmt(summary.total_net || d.total_net),
                color: 'bg-green-50 text-green-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
            },
            {
                label: 'Total Komisi',
                value: fmt(summary.total_commission || d.total_commission),
                color: 'bg-amber-50 text-amber-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>'
            },
            {
                label: 'Total Pajak',
                value: fmt(summary.total_tax || d.total_tax),
                color: 'bg-rose-50 text-rose-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>'
            },
            {
                label: 'Jumlah Transaksi',
                value: new Intl.NumberFormat('id-ID').format(summary.transaction_count || d.transaction_count || 0),
                color: 'bg-purple-50 text-purple-600',
                icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>'
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

    renderChart() {
        const d = this.state.data;
        const periods = d.periods || d.data || [];

        if (!periods.length) return;

        const labels = periods.map(p => p.label || p.period || '-');
        const grossData = periods.map(p => p.gross_revenue || p.gross_amount || p.gross || 0);
        const netData = periods.map(p => p.net_revenue || p.net_amount || p.net || 0);
        const commissionData = periods.map(p => p.commission || 0);
        const taxData = periods.map(p => p.tax || 0);

        chart.bar('revenue-chart', labels, [
            {
                label: 'Gross',
                data: grossData,
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: '#3b82f6',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Pajak',
                data: taxData,
                backgroundColor: 'rgba(244, 63, 94, 0.7)',
                borderColor: '#f43f5e',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Net',
                data: netData,
                backgroundColor: 'rgba(164, 170, 38, 0.7)',
                borderColor: '#A4AA26',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: 'Komisi',
                data: commissionData,
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: '#f59e0b',
                borderWidth: 1,
                borderRadius: 4,
            }
        ]);
    },

    renderTable() {
        const d = this.state.data;
        const periods = d.periods || d.data || [];
        const fmt = (num) => 'Rp ' + new Intl.NumberFormat('id-ID').format(num || 0);

        const columns = [
            { label: 'Periode', render: (row) => `<span class="font-medium text-gray-800">${row.label || row.period || '-'}</span>` },
            { label: 'Gross', render: (row) => fmt(row.gross_revenue || row.gross_amount || row.gross) },
            { label: 'Pajak', render: (row) => fmt(row.tax) },
            { label: 'Net', render: (row) => fmt(row.net_revenue || row.net_amount || row.net) },
            { label: 'Komisi', render: (row) => fmt(row.commission) },
            { label: 'Transaksi', render: (row) => new Intl.NumberFormat('id-ID').format(row.transaction_count || 0) },
        ];

        const container = document.getElementById('revenue-table-container');
        if (!container) return;
        container.innerHTML = table.render({
            columns,
            data: periods,
            emptyText: 'Tidak ada data pendapatan',
        });
    }
};
