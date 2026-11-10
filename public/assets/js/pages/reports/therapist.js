pages['reports/therapist'] = {
    state: {
        data: null,
        loading: false,
        therapists: [],
        therapistOptions: [],
        filters: {
            start_date: '',
            end_date: '',
            therapist_id: ''
        }
    },

    async render(params) {
        header.setTitle('Laporan Kinerja Terapis');

        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        this.state.filters.start_date = firstDay.toISOString().split('T')[0];
        this.state.filters.end_date = today.toISOString().split('T')[0];

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-800">Laporan Kinerja Terapis</h1>
                <p class="text-sm text-gray-500 mt-1">Analisis performa terapis</p>
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
                    <div class="flex-1 min-w-[200px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">Terapis</label>
                        <select id="filter-therapist"
                            class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Semua Terapis</option>
                        </select>
                    </div>
                    <button onclick="pages['reports/therapist'].loadReport()"
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

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div id="therapist-table-container"></div>
            </div>
        `;

        this.bindFilterEvents();
        await this.loadTherapistOptions();
        form.initTomSelect('#filter-therapist');
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

        document.getElementById('filter-therapist').addEventListener('change', function () {
            self.state.filters.therapist_id = this.value;
        });
    },

    async loadTherapistOptions() {
        try {
            const res = await api.get('/therapists?limit=100');
            const list = res.data || [];
            this.state.therapistOptions = list;

            const select = document.getElementById('filter-therapist');
            if (select && list.length) {
                select.innerHTML = '<option value="">Semua Terapis</option>' +
                    list.map(t => `<option value="${t.id}">${t.name || t.full_name}</option>`).join('');
            }
        } catch (err) {
            // Silently fail - therapist select will just show "Semua Terapis"
        }
    },

    getExportUrl(type) {
        const base = `/api/reports/export/${type}/therapist-performance`;
        const params = new URLSearchParams();
        if (this.state.filters.start_date) params.set('start_date', this.state.filters.start_date);
        if (this.state.filters.end_date) params.set('end_date', this.state.filters.end_date);
        if (this.state.filters.therapist_id) params.set('therapist_id', this.state.filters.therapist_id);
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

        const container = document.getElementById('therapist-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(6, 6);

        try {
            const queryParams = new URLSearchParams();
            if (this.state.filters.start_date) queryParams.set('start_date', this.state.filters.start_date);
            if (this.state.filters.end_date) queryParams.set('end_date', this.state.filters.end_date);
            if (this.state.filters.therapist_id) queryParams.set('therapist_id', this.state.filters.therapist_id);

            const res = await api.get('/reports/therapist-performance?' + queryParams.toString());
            this.state.data = res.data || res;
            this.state.therapists = Array.isArray(this.state.data) ? this.state.data : (this.state.data.therapists || this.state.data.data || []);

            this.updateExportLinks();
            this.renderTable();
        } catch (err) {
            toast.error(err.message || 'Gagal memuat laporan kinerja terapis');
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

    renderTable() {
        const fmt = (num) => 'Rp ' + new Intl.NumberFormat('id-ID').format(num || 0);

        const columns = [
            {
                label: 'Nama',
                render: (row) => `
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-xs">
                            ${(row.name || row.therapist_name || '-').charAt(0).toUpperCase()}
                        </div>
                        <span class="font-medium text-gray-800">${row.name || row.therapist_name || '-'}</span>
                    </div>
                `
            },
            { label: 'Layanan Ditangani', render: (row) => `<span class="text-gray-600">${row.services_handled || row.total_services || 0}</span>` },
            { label: 'Jam Kerja', render: (row) => `<span class="text-gray-600">${row.hours_worked || row.total_hours || 0} jam</span>` },
            { label: 'Pendapatan', render: (row) => `<span class="font-semibold text-gray-800">${fmt(row.revenue || row.revenue_generated)}</span>` },
            { label: 'Pajak', render: (row) => `<span class="text-rose-600 font-medium">${fmt(row.tax || 0)}</span>` },
            { label: 'Komisi', render: (row) => `<span class="text-amber-600 font-medium">${fmt(row.commission || row.commission_earned)}</span>` },
            {
                label: 'Rating',
                render: (row) => {
                    const rating = row.avg_rating || row.average_rating || 0;
                    const stars = Math.round(rating);
                    let starsHtml = '';
                    for (let i = 0; i < 5; i++) {
                        starsHtml += `<svg class="w-3.5 h-3.5 ${i < stars ? 'text-amber-400' : 'text-gray-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
                    }
                    return `<div class="flex items-center gap-1">${starsHtml}<span class="text-xs text-gray-500 ml-1">${rating.toFixed(1)}</span></div>`;
                }
            },
            {
                label: 'Completion Rate',
                render: (row) => {
                    const rate = row.completion_rate || 0;
                    const colorClass = rate >= 80 ? 'text-green-600 bg-green-50' : rate >= 60 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}">${rate.toFixed(1)}%</span>`;
                }
            }
        ];

        const container = document.getElementById('therapist-table-container');
        if (!container) return;
        container.innerHTML = table.render({
            columns,
            data: this.state.therapists,
            emptyText: 'Tidak ada data kinerja terapis',
        });
    }
};
