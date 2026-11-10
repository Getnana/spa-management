pages['services/list'] = {
    state: {
        services: [],
        categories: [],
        currentPage: 1,
        lastPage: 1,
        total: 0,
        selectedCategory: '',
        loading: false,
    },

    async render(params) {
        header.setTitle('Layanan');
        const content = document.getElementById('page-content');

        content.innerHTML = `
            <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-gray-800">Layanan</h1>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">Kelola daftar layanan spa</p>
                </div>
                <button onclick="window.location.hash='#/services/new'"
                    class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Layanan Baru
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <select id="service-category-filter" onchange="pages['services/list'].filterByCategory()"
                        class="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm max-w-xs">
                        <option value="">Semua Kategori</option>
                    </select>
                </div>
                <div id="service-table-container"></div>
            </div>
        `;

        await this.loadCategories();
        form.initTomSelect('#service-category-filter');
        await this.loadServices();
    },

    async loadCategories() {
        try {
            const res = await api.get('/categories');
            this.state.categories = res.data || [];
            const select = document.getElementById('service-category-filter');
            if (select) {
                this.state.categories.forEach(cat => {
                    const opt = document.createElement('option');
                    opt.value = cat.id;
                    opt.textContent = cat.name;
                    if (String(cat.id) === String(this.state.selectedCategory)) opt.selected = true;
                    select.appendChild(opt);
                });
            }
        } catch (err) {
            // Silently fail - categories filter is optional
        }
    },

    async loadServices() {
        if (this.state.loading) return;
        this.state.loading = true;

        const container = document.getElementById('service-table-container');
        if (!container) return;
        if (this.state.services.length === 0) {
            container.innerHTML = skeleton.table(5, 5);
        }

        try {
            const catParam = this.state.selectedCategory ? `&category_id=${this.state.selectedCategory}` : '';
            const res = await api.get(`/services?page=${this.state.currentPage}${catParam}`);
            this.state.services = res.data || [];
            this.state.currentPage = res.pagination?.current_page || 1;
            this.state.lastPage = res.pagination?.total_pages || 1;
            this.state.total = res.pagination?.total || 0;
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data layanan');
            this.state.services = [];
        }

        this.state.loading = false;
        this.renderTable();
    },

    renderTable() {
        const container = document.getElementById('service-table-container');
        if (!container) return;
        const formatCurrency = (num) => 'Rp ' + new Intl.NumberFormat('id-ID').format(num || 0);

        const statusColors = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-500',
        };

        const columns = [
            {
                label: 'Nama Layanan',
                key: 'name',
                render: (row) => `<span class="font-medium text-gray-800">${row.name || '-'}</span>`,
            },
            {
                label: 'Kategori',
                key: 'category_name',
                render: (row) => row.category_name || row.category || '-',
            },
            {
                label: 'Durasi',
                key: 'duration_minutes',
                render: (row) => `${row.duration_minutes || 0} menit`,
            },
            {
                label: 'Harga',
                key: 'price',
                render: (row) => `<span class="font-semibold text-gray-800">${formatCurrency(row.price)}</span>`,
            },
            {
                label: 'Status',
                key: 'status',
                render: (row) => {
                    const isActive = row.status === 'active' || row.is_active == 1;
                    const color = statusColors[isActive ? 'active' : 'inactive'] || 'bg-gray-100 text-gray-500';
                    const label = isActive ? 'Aktif' : 'Nonaktif';
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${label}</span>`;
                },
            },
        ];

        const actions = (row) => `
            <button onclick="window.location.hash='#/services/${row.id}/edit'"
                class="text-gray-600 hover:text-gray-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition">Edit</button>
            <button onclick="pages['services/list'].deleteService(${row.id}, '${(row.name || '').replace(/'/g, "\\'")}')"
                class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition">Hapus</button>
        `;

        const pagination = {
            current_page: this.state.currentPage,
            total_pages: this.state.lastPage,
            total: this.state.total,
            onPrev: "pages['services/list'].goToPage(" + (this.state.currentPage - 1) + ")",
            onNext: "pages['services/list'].goToPage(" + (this.state.currentPage + 1) + ")",
        };

        container.innerHTML = table.render({
            columns,
            data: this.state.services,
            pagination,
            actions,
            emptyText: 'Belum ada data layanan',
        });
    },

    filterByCategory() {
        const select = document.getElementById('service-category-filter');
        this.state.selectedCategory = select.value;
        this.state.currentPage = 1;
        this.loadServices();
    },

    goToPage(page) {
        this.state.currentPage = page;
        this.loadServices();
    },

    deleteService(id, name) {
        confirmDialog.show(
            'Hapus Layanan',
            `Apakah Anda yakin ingin menghapus layanan "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/services/${id}`);
                    toast.success('Layanan berhasil dihapus');
                    await this.loadServices();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus layanan');
                }
            },
            'Hapus'
        );
    },
};
