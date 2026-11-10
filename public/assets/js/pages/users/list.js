pages['users/list'] = {
    state: {
        users: [],
        search: '',
        role: '',
        currentPage: 1,
        lastPage: 1,
        total: 0,
        loading: false,
    },

    async render(params) {
        header.setTitle('Manajemen User');
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-gray-800">Manajemen User</h1>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">Kelola akun pengguna sistem</p>
                </div>
                <button onclick="window.location.hash='#/users/new'"
                    class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    User Baru
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div class="mb-4 flex flex-col sm:flex-row sm:flex-wrap gap-3 items-stretch sm:items-end">
                    <div class="flex-1 min-w-0 sm:min-w-[160px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">Role</label>
                        <select id="filter-role"
                            class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                            <option value="">Semua Role</option>
                            <option value="owner">Owner</option>
                            <option value="staff">Staff</option>
                            <option value="therapist">Terapis</option>
                        </select>
                    </div>
                    <div class="flex-[2] min-w-0 sm:min-w-[200px]">
                        <label class="block text-xs font-medium text-gray-500 mb-1">Cari</label>
                        <div class="relative">
                            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                            <input type="text" id="user-search" placeholder="Cari username, nama, email..."
                                value="${this.state.search}"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                </div>
                <div id="user-table-container"></div>
            </div>
        `;

        this.bindFilterEvents();
        form.initTomSelect('#filter-role');
        await this.loadUsers();
    },

    bindFilterEvents() {
        const self = this;

        document.getElementById('filter-role').addEventListener('change', function () {
            self.state.role = this.value;
            self.state.currentPage = 1;
            self.loadUsers();
        });

        let searchTimeout;
        document.getElementById('user-search').addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                self.state.search = this.value.trim();
                self.state.currentPage = 1;
                self.loadUsers();
            }, 400);
        });
    },

    async loadUsers() {
        if (this.state.loading) return;
        this.state.loading = true;

        const container = document.getElementById('user-table-container');
        if (!container) return;
        if (this.state.users.length === 0) {
            container.innerHTML = skeleton.table(6, 5);
        }

        try {
            const queryParams = new URLSearchParams({ page: this.state.currentPage });
            if (this.state.role) queryParams.set('role', this.state.role);
            if (this.state.search) queryParams.set('search', encodeURIComponent(this.state.search));

            const res = await api.get('/users?' + queryParams.toString());
            this.state.users = res.data || [];
            const pagination = res.pagination;
            this.state.currentPage = pagination?.current_page || 1;
            this.state.lastPage = pagination?.total_pages || 1;
            this.state.total = pagination?.total || 0;
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data user');
            this.state.users = [];
        }

        this.state.loading = false;
        this.renderTable();
    },

    renderTable() {
        const fmtDate = (dateStr) => dateStr
            ? new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            : '-';

        const roleBadge = (role) => {
            const colors = {
                owner: 'bg-purple-100 text-purple-700',
                staff: 'bg-blue-100 text-blue-700',
                therapist: 'bg-teal-100 text-teal-700',
            };
            const cls = colors[role] || 'bg-gray-100 text-gray-700';
            const label = { owner: 'Owner', staff: 'Staff', therapist: 'Terapis' }[role] || role;
            return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}">${label}</span>`;
        };

        const activeBadge = (active) => {
            if (active) {
                return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Aktif</span>';
            }
            return '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Nonaktif</span>';
        };

        const columns = [
            {
                label: 'Username',
                render: (row) => `<span class="font-medium text-gray-800">${row.username || '-'}</span>`,
            },
            {
                label: 'Nama Lengkap',
                render: (row) => row.full_name || row.name || '-',
            },
            {
                label: 'Email',
                render: (row) => row.email || '-',
            },
            {
                label: 'Role',
                render: (row) => roleBadge(row.role),
            },
            {
                label: 'Status',
                render: (row) => activeBadge(row.is_active),
            },
            {
                label: 'Login Terakhir',
                render: (row) => `<span class="text-gray-500 text-xs">${fmtDate(row.last_login)}</span>`,
            },
        ];

        const actions = (row) => `
            <button onclick="window.location.hash='#/users/${row.id}/edit'"
                class="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition">Edit</button>
            <button onclick="pages['users/list'].resetPassword(${row.id}, '${row.username || row.full_name || 'user'}')"
                class="text-amber-600 hover:text-amber-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-amber-50 transition">Reset Password</button>
            <button onclick="pages['users/list'].deleteUser(${row.id}, '${(row.username || row.full_name || 'user').replace(/'/g, "\\'")}')"
                class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition">Hapus</button>
        `;

        const pagination = {
            current_page: this.state.currentPage,
            total_pages: this.state.lastPage,
            total: this.state.total,
            onPrev: "pages['users/list'].goToPage(" + (this.state.currentPage - 1) + ")",
            onNext: "pages['users/list'].goToPage(" + (this.state.currentPage + 1) + ")",
        };

        const container = document.getElementById('user-table-container');
        if (!container) return;
        container.innerHTML = table.render({
            columns,
            data: this.state.users,
            pagination,
            actions,
            emptyText: 'Belum ada data user',
        });
    },

    goToPage(page) {
        this.state.currentPage = page;
        this.loadUsers();
    },

    resetPassword(userId, username) {
        confirmDialog.show(
            'Reset Password',
            `Apakah Anda yakin ingin mereset password untuk user "${username}"?`,
            async () => {
                try {
                    await api.post(`/users/${userId}/reset-password`);
                    toast.success(`Password user "${username}" berhasil direset`);
                } catch (err) {
                    toast.error(err.message || 'Gagal mereset password');
                }
            },
            'Reset'
        );
    },

    deleteUser(id, username) {
        confirmDialog.show(
            'Hapus User',
            `Apakah Anda yakin ingin menghapus user "${username}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/users/${id}`);
                    toast.success('User berhasil dihapus');
                    await this.loadUsers();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus user');
                }
            },
            'Hapus'
        );
    }
};
