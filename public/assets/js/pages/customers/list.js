pages['customers/list'] = {
    state: {
        customers: [],
        search: '',
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
    },

    async render(params) {
        header.setTitle('Customers');
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-gray-800">Customers</h1>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">Kelola data pelanggan</p>
                </div>
                <button onclick="window.location.hash='#/customers/new'"
                    class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Customer Baru
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div class="mb-4">
                    <div class="relative w-full sm:max-w-sm">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                        <input type="text" id="customer-search" placeholder="Cari nama, telepon, email..."
                            value="${this.state.search}"
                            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                    </div>
                </div>
                <div id="customer-table-container"></div>
            </div>
        `;

        const searchInput = document.getElementById('customer-search');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.state.search = e.target.value.trim();
                this.state.currentPage = 1;
                this.loadCustomers();
            }, 400);
        });

        await this.loadCustomers();
    },

    async loadCustomers() {
        if (this.state.loading) return;
        this.state.loading = true;

        const container = document.getElementById('customer-table-container');
        if (!container) return;
        if (this.state.customers.length === 0) {
            container.innerHTML = skeleton.table(5, 5);
        }

        try {
            const searchParam = this.state.search ? `&search=${encodeURIComponent(this.state.search)}` : '';
            const res = await api.get(`/customers?page=${this.state.currentPage}${searchParam}`);
            this.state.customers = res.data || [];
            this.state.currentPage = res.pagination?.current_page || 1;
            this.state.lastPage = res.pagination?.total_pages || 1;
            this.state.total = res.pagination?.total || 0;
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data customer');
            this.state.customers = [];
        }

        this.state.loading = false;
        this.renderTable();
    },

    renderTable() {
        const container = document.getElementById('customer-table-container');
        if (!container) return;

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
                label: 'Email',
                key: 'email',
                render: (row) => row.email || '-',
            },
            {
                label: 'Kunjungan',
                key: 'visit_count',
                render: (row) => `<span class="text-gray-600">${row.total_visits || 0}x</span>`,
            },
            {
                label: 'Member',
                key: 'is_member',
                render: (row) => {
                    if (row.is_member) {
                        return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Member</span>';
                    }
                    return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Non-Member</span>';
                },
            },
        ];

        const actions = (row) => `
            <button onclick="window.location.hash='#/customers/${row.id}'"
                class="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition">Lihat</button>
            <button onclick="window.location.hash='#/customers/${row.id}/edit'"
                class="text-gray-600 hover:text-gray-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition">Edit</button>
            <button onclick="pages['customers/list'].deleteCustomer(${row.id}, '${(row.name || '').replace(/'/g, "\\'")}')"
                class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition">Hapus</button>
        `;

        const pagination = {
            current_page: this.state.currentPage,
            total_pages: this.state.lastPage,
            total: this.state.total,
            onPrev: "pages['customers/list'].goToPage(" + (this.state.currentPage - 1) + ")",
            onNext: "pages['customers/list'].goToPage(" + (this.state.currentPage + 1) + ")",
        };

        container.innerHTML = table.render({
            columns,
            data: this.state.customers,
            pagination,
            actions,
            emptyText: 'Belum ada data customer',
        });
    },

    goToPage(page) {
        this.state.currentPage = page;
        this.loadCustomers();
    },

    deleteCustomer(id, name) {
        confirmDialog.show(
            'Hapus Customer',
            `Apakah Anda yakin ingin menghapus customer "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/customers/${id}`);
                    toast.success('Customer berhasil dihapus');
                    await this.loadCustomers();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus customer');
                }
            },
            'Hapus'
        );
    },
};
