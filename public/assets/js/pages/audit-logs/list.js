pages['audit-logs/list'] = {
    state: {
        page: 1,
        filters: {
            user: '',
            action: '',
            table_name: '',
            date_from: '',
            date_to: ''
        },
        expandedRow: null
    },

    render(params) {
        header.setTitle('Audit Log');
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
                            Filter Audit Log
                        </span>
                        <svg class="w-4 h-4 chevron transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div id="filter-fields" class="hidden md:flex flex-wrap gap-3 items-end">
                        <div class="flex-1 min-w-[160px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">User</label>
                            <input type="text" id="filter-user" placeholder="Cari user..."
                                value="${this.state.filters.user}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Action</label>
                            <select id="filter-action"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                <option value="">Semua Action</option>
                                <option value="create" ${this.state.filters.action === 'create' ? 'selected' : ''}>Create</option>
                                <option value="update" ${this.state.filters.action === 'update' ? 'selected' : ''}>Update</option>
                                <option value="delete" ${this.state.filters.action === 'delete' ? 'selected' : ''}>Delete</option>
                                <option value="login" ${this.state.filters.action === 'login' ? 'selected' : ''}>Login</option>
                                <option value="logout" ${this.state.filters.action === 'logout' ? 'selected' : ''}>Logout</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Tabel</label>
                            <input type="text" id="filter-table" placeholder="Nama tabel..."
                                value="${this.state.filters.table_name}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Dari</label>
                            <input type="date" id="filter-date-from" value="${this.state.filters.date_from}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                        <div class="flex-1 min-w-[140px]">
                            <label class="block text-xs font-medium text-gray-500 mb-1">Sampai</label>
                            <input type="date" id="filter-date-to" value="${this.state.filters.date_to}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div id="audit-table-container"></div>
                </div>
            </div>
        `;

        this.bindFilterEvents();
        form.initTomSelect('#filter-action');
        this.loadLogs();
    },

    bindFilterEvents() {
        const self = this;

        document.getElementById('filter-user').addEventListener('input', function () {
            clearTimeout(self._userTimeout);
            self._userTimeout = setTimeout(() => {
                self.state.filters.user = this.value.trim();
                self.state.page = 1;
                self.loadLogs();
            }, 400);
        });

        document.getElementById('filter-action').addEventListener('change', function () {
            self.state.filters.action = this.value;
            self.state.page = 1;
            self.loadLogs();
        });

        document.getElementById('filter-table').addEventListener('input', function () {
            clearTimeout(self._tableTimeout);
            self._tableTimeout = setTimeout(() => {
                self.state.filters.table_name = this.value.trim();
                self.state.page = 1;
                self.loadLogs();
            }, 400);
        });

        document.getElementById('filter-date-from').addEventListener('change', function () {
            self.state.filters.date_from = this.value;
            self.state.page = 1;
            self.loadLogs();
        });

        document.getElementById('filter-date-to').addEventListener('change', function () {
            self.state.filters.date_to = this.value;
            self.state.page = 1;
            self.loadLogs();
        });
    },

    async loadLogs() {
        const container = document.getElementById('audit-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(6, 6);

        try {
            const queryParams = new URLSearchParams({ page: this.state.page });
            if (this.state.filters.user) queryParams.set('user', this.state.filters.user);
            if (this.state.filters.action) queryParams.set('action', this.state.filters.action);
            if (this.state.filters.table_name) queryParams.set('table_name', this.state.filters.table_name);
            if (this.state.filters.date_from) queryParams.set('date_from', this.state.filters.date_from);
            if (this.state.filters.date_to) queryParams.set('date_to', this.state.filters.date_to);

            const res = await api.get('/audit-logs?' + queryParams.toString());
            const { data: logs, pagination } = res;

            const actionColors = {
                create: 'bg-green-100 text-green-700',
                update: 'bg-blue-100 text-blue-700',
                delete: 'bg-red-100 text-red-700',
                login: 'bg-purple-100 text-purple-700',
                logout: 'bg-gray-100 text-gray-600'
            };

            const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '';

            const columns = [
                {
                    label: 'Waktu',
                    render: (row) => {
                        const d = new Date(row.created_at);
                        return `<span class="text-xs text-gray-600">${formatDate(row.created_at)}</span><br><span class="text-xs text-gray-400">${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>`;
                    }
                },
                {
                    label: 'User',
                    render: (row) => `<span class="text-sm font-medium text-gray-800">${row.user_name || row.username || '-'}</span>`
                },
                {
                    label: 'Action',
                    render: (row) => {
                        const color = actionColors[row.action] || 'bg-gray-100 text-gray-600';
                        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${row.action || '-'}</span>`;
                    }
                },
                {
                    label: 'Tabel',
                    render: (row) => `<span class="text-sm text-gray-600 font-mono">${row.table_name || '-'}</span>`
                },
                {
                    label: 'Record ID',
                    render: (row) => `<span class="text-xs font-mono text-gray-500">${row.record_id || '-'}</span>`
                },
                {
                    label: 'IP',
                    render: (row) => `<span class="text-xs text-gray-400 font-mono">${row.ip_address || '-'}</span>`
                }
            ];

            const paginationConfig = pagination ? {
                current_page: pagination.current_page,
                total_pages: pagination.total_pages || Math.ceil((pagination.total || 0) / (pagination.per_page || 10)),
                total: pagination.total || 0,
                onPrev: "pages['audit-logs/list'].goToPage(" + (pagination.current_page - 1) + ")",
                onNext: "pages['audit-logs/list'].goToPage(" + (pagination.current_page + 1) + ")"
            } : null;

            container.innerHTML = table.render({
                columns,
                data: logs,
                pagination: paginationConfig,
                emptyText: 'Tidak ada audit log ditemukan',
                rowClass: (row) => 'cursor-pointer hover:bg-gray-50',
                rowOnClick: (row) => `pages['audit-logs/list'].toggleDetail('${row.id}')`
            });

            // Store data for expand
            this._logs = logs || [];
            this.renderDetailPanel();

        } catch (err) {
            container.innerHTML = `
                <div class="text-center py-12 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat data</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                    <button onclick="pages['audit-logs/list'].loadLogs()" class="mt-3 text-sm text-primary-600 hover:underline">Coba lagi</button>
                </div>
            `;
        }
    },

    toggleDetail(id) {
        if (this.state.expandedRow === id) {
            this.state.expandedRow = null;
        } else {
            this.state.expandedRow = id;
        }
        this.renderDetailPanel();
    },

    renderDetailPanel() {
        let existingPanel = document.getElementById('audit-detail-panel');
        if (existingPanel) existingPanel.remove();

        if (!this.state.expandedRow || !this._logs) return;

        const log = this._logs.find(l => String(l.id) === String(this.state.expandedRow));
        if (!log) return;

        const container = document.getElementById('audit-table-container');
        if (!container) return;
        const panel = document.createElement('div');
        panel.id = 'audit-detail-panel';

        const formatJson = (obj) => {
            if (!obj) return '<span class="text-gray-400">-</span>';
            try {
                const parsed = typeof obj === 'string' ? JSON.parse(obj) : obj;
                return `<pre class="text-xs bg-gray-50 rounded-lg p-3 overflow-x-auto text-gray-700 whitespace-pre-wrap break-words">${JSON.stringify(parsed, null, 2)}</pre>`;
            } catch {
                return `<pre class="text-xs bg-gray-50 rounded-lg p-3 overflow-x-auto text-gray-700">${obj}</pre>`;
            }
        };

        panel.innerHTML = `
            <div class="mt-4 border-t border-gray-200 pt-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Detail Perubahan</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs font-medium text-gray-500 mb-1">Nilai Lama (Old)</p>
                        ${formatJson(log.old_values)}
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-500 mb-1">Nilai Baru (New)</p>
                        ${formatJson(log.new_values)}
                    </div>
                </div>
            </div>
        `;

        container.appendChild(panel);
    },

    goToPage(page) {
        this.state.page = page;
        this.state.expandedRow = null;
        this.loadLogs();
    }
};
