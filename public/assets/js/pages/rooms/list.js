pages['rooms/list'] = {
    state: {
        rooms: [],
        loading: false,
    },

    async render(params) {
        header.setTitle('Ruangan');

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-bold text-gray-800">Ruangan</h1>
                    <p class="text-xs md:text-sm text-gray-500 mt-0.5">Kelola ruangan treatment spa</p>
                </div>
                <button onclick="window.location.hash='#/rooms/new'"
                    class="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Tambah Ruangan
                </button>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                <div id="room-table-container"></div>
            </div>
        `;

        await this.loadRooms();
    },

    async loadRooms() {
        if (this.state.loading) return;
        this.state.loading = true;

        const container = document.getElementById('room-table-container');
        if (!container) return;
        container.innerHTML = skeleton.table(4, 4);

        try {
            const res = await api.get('/rooms');
            this.state.rooms = res.data || [];
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data ruangan');
            this.state.rooms = [];
        }

        this.state.loading = false;
        this.renderTable();
    },

    renderTable() {
        const container = document.getElementById('room-table-container');
        if (!container) return;

        const statusColors = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-500',
        };

        const columns = [
            {
                label: 'Nama Ruangan',
                render: (row) => `<span class="font-medium text-gray-800">${row.name || '-'}</span>`,
            },
            {
                label: 'Status',
                render: (row) => {
                    const color = statusColors[row.status] || 'bg-gray-100 text-gray-500';
                    const label = row.status === 'active' ? 'Aktif' : 'Nonaktif';
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}">${label}</span>`;
                },
            },
        ];

        const actions = (row) => `
            <button onclick="window.location.hash='#/rooms/${row.id}/edit'"
                class="text-gray-600 hover:text-gray-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition">Edit</button>
            <button onclick="pages['rooms/list'].deleteRoom(${row.id}, '${(row.name || '').replace(/'/g, "\\'")}')"
                class="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition">Hapus</button>
        `;

        container.innerHTML = table.render({
            columns,
            data: this.state.rooms,
            actions,
            emptyText: 'Belum ada data ruangan',
        });
    },

    deleteRoom(id, name) {
        confirmDialog.show(
            'Hapus Ruangan',
            `Apakah Anda yakin ingin menghapus ruangan "${name}"? Tindakan ini tidak dapat dibatalkan.`,
            async () => {
                try {
                    await api.delete(`/rooms/${id}`);
                    toast.success('Ruangan berhasil dihapus');
                    await this.loadRooms();
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus ruangan');
                }
            },
            'Hapus'
        );
    },
};
