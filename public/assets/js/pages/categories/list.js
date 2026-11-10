pages['categories/list'] = {
    state: {
        categories: [],
        loading: false,
    },

    async render(params) {
        header.setTitle('Kategori Layanan');
        const content = document.getElementById('page-content');

        content.innerHTML = `
            <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-gray-800">Kategori Layanan</h1>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">Kelola kategori untuk mengelompokkan layanan</p>
                </div>
                <button onclick="window.location.hash='#/categories/new'"
                    class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Tambah Kategori
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div id="category-table-container"></div>
            </div>
        `;

        await this.loadCategories();
    },

    async loadCategories() {
        if (this.state.loading) return;
        this.state.loading = true;

        const container = document.getElementById('category-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(4, 5);

        try {
            const res = await api.get('/categories');
            this.state.categories = res.data || [];
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data kategori');
            this.state.categories = [];
        }

        this.state.loading = false;
        this.renderTable();
    },

    renderTable() {
        const container = document.getElementById('category-table-container');
        if (!container) return;

        const columns = [
            {
                label: 'Nama',
                key: 'name',
                render: (row) => `<span class="font-medium text-gray-800">${row.name || '-'}</span>`,
            },
            {
                label: 'Deskripsi',
                key: 'description',
                render: (row) => `<span class="text-gray-600">${row.description || '-'}</span>`,
            },
            {
                label: 'Jumlah Layanan',
                key: 'service_count',
                render: (row) => `<span class="text-gray-600">${row.service_count || 0}</span>`,
            },
            {
                label: 'Status',
                key: 'is_active',
                render: (row) => {
                    const isActive = row.is_active == 1;
                    const color = isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500';
                    const label = isActive ? 'Aktif' : 'Nonaktif';
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${label}</span>`;
                },
            },
        ];

        const actions = (row) => `
            <button onclick="window.location.hash='#/categories/${row.id}/edit'"
                class="text-gray-600 hover:text-gray-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition">Edit</button>
            <button onclick="pages['categories/list'].deleteCategory(${row.id}, '${(row.name || '').replace(/'/g, "\\'")}')"
                class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition">Hapus</button>
        `;

        container.innerHTML = table.render({
            columns,
            data: this.state.categories,
            actions,
            emptyText: 'Belum ada data kategori',
        });
    },

    deleteCategory(id, name) {
        confirmDialog.show(
            'Hapus Kategori',
            `Apakah Anda yakin ingin menghapus kategori "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/categories/${id}`);
                    toast.success('Kategori berhasil dihapus');
                    await this.loadCategories();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus kategori');
                }
            },
            'Hapus'
        );
    },
};
