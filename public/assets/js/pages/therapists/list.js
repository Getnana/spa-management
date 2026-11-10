pages['therapists/list'] = {
    state: {
        therapists: [],
        search: '',
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
    },

    async render(params) {
        header.setTitle('Terapis');
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-gray-800">Terapis</h1>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">Kelola data terapis</p>
                </div>
                <button onclick="window.location.hash='#/therapists/new'"
                    class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Terapis Baru
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div class="mb-4">
                    <div class="relative w-full sm:max-w-sm">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input type="text" id="therapist-search" placeholder="Cari nama, spesialisasi..."
                            value="${this.state.search}"
                            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                    </div>
                </div>
                <div id="therapist-table-container"></div>
            </div>
        `;

        const searchInput = document.getElementById('therapist-search');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.state.search = e.target.value.trim();
                this.state.currentPage = 1;
                this.loadTherapists();
            }, 400);
        });

        await this.loadTherapists();
    },

    async loadTherapists() {
        if (this.state.loading) return;
        this.state.loading = true;

        const container = document.getElementById('therapist-table-container');
        if (!container) return;
        if (this.state.therapists.length === 0) {
            container.innerHTML = skeleton.table(6, 5);
        }

        try {
            const searchParam = this.state.search ? `&search=${encodeURIComponent(this.state.search)}` : '';
            const res = await api.get(`/therapists?page=${this.state.currentPage}${searchParam}`);
            this.state.therapists = res.data || [];
            this.state.currentPage = res.pagination?.current_page || 1;
            this.state.lastPage = res.pagination?.total_pages || 1;
            this.state.total = res.pagination?.total || 0;
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data terapis');
            this.state.therapists = [];
        }

        this.state.loading = false;
        this.renderTable();
    },

    renderStars(rating) {
        const full = Math.floor(rating || 0);
        const empty = 5 - full;
        return '<span class="text-yellow-400">' + '★'.repeat(full) + '</span>' +
               '<span class="text-gray-300">' + '☆'.repeat(empty) + '</span>';
    },

    renderTable() {
        const container = document.getElementById('therapist-table-container');
        if (!container) return;

        const statusColors = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-500',
            on_leave: 'bg-yellow-100 text-yellow-700',
        };

        const statusLabels = {
            active: 'Aktif',
            inactive: 'Nonaktif',
            on_leave: 'Cuti',
        };

        const isOwner = auth.getRole() === 'owner';

        const columns = [
            {
                label: 'Nama',
                key: 'name',
                render: (row) => `<span class="font-medium text-gray-800">${row.name || '-'}</span>`,
            },
            {
                label: 'Telepon',
                key: 'phone',
                render: (row) => row.phone || '-',
            },
            {
                label: 'Spesialisasi',
                key: 'specialty',
                render: (row) => row.specialty || '-',
            },
            ...(isOwner ? [{
                label: 'Komisi (%)',
                key: 'commission_rate',
                render: (row) => `<span class="text-gray-600">${row.commission_rate || 0}%</span>`,
            }] : []),
            {
                label: 'Status',
                key: 'status',
                render: (row) => {
                    const color = statusColors[row.status] || 'bg-gray-100 text-gray-500';
                    const label = statusLabels[row.status] || row.status || '-';
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${label}</span>`;
                },
            },
            {
                label: 'Rating',
                key: 'rating',
                render: (row) => `<span class="text-sm">${this.renderStars(row.avg_rating)}</span>`,
            },
        ];

        const actions = (row) => `
            <button onclick="window.location.hash='#/therapists/${row.id}'"
                class="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition">Lihat</button>
            <button onclick="window.location.hash='#/therapists/${row.id}/edit'"
                class="text-gray-600 hover:text-gray-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition">Edit</button>
            <button onclick="window.location.hash='#/therapists/${row.id}/schedule'"
                class="text-amber-600 hover:text-amber-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-amber-50 transition">Jadwal</button>
            <button onclick="pages['therapists/list'].deleteTherapist(${row.id}, '${(row.name || '').replace(/'/g, "\\'")}')"
                class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition">Hapus</button>
        `;

        const pagination = {
            current_page: this.state.currentPage,
            total_pages: this.state.lastPage,
            total: this.state.total,
            onPrev: "pages['therapists/list'].goToPage(" + (this.state.currentPage - 1) + ")",
            onNext: "pages['therapists/list'].goToPage(" + (this.state.currentPage + 1) + ")",
        };

        container.innerHTML = table.render({
            columns,
            data: this.state.therapists,
            pagination,
            actions,
            emptyText: 'Belum ada data terapis',
        });
    },

    goToPage(page) {
        this.state.currentPage = page;
        this.loadTherapists();
    },

    deleteTherapist(id, name) {
        confirmDialog.show(
            'Hapus Terapis',
            `Apakah Anda yakin ingin menghapus terapis "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/therapists/${id}`);
                    toast.success('Terapis berhasil dihapus');
                    await this.loadTherapists();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus terapis');
                }
            },
            'Hapus'
        );
    },
};
