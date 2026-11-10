pages['therapists/detail'] = {
    state: {
        therapist: null,
        schedule: [],
        loading: false,
    },

    async render(params) {
        const id = params.id;
        header.setTitle('Detail Terapis');

        const content = document.getElementById('page-content');
        content.innerHTML = skeleton.detail(5);

        try {
            const res = await api.get(`/therapists/${id}`);
            this.state.therapist = res.data;
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data terapis');
            content.innerHTML = '<div class="text-center py-12 text-red-400 text-sm">Data tidak ditemukan</div>';
            return;
        }

        header.setTitle(this.state.therapist.name || 'Detail Terapis');
        this.renderDetail(id);
        this.loadSchedule(id);
    },

    renderDetail(id) {
        const t = this.state.therapist;
        const content = document.getElementById('page-content');

        const formatCurrency = (num) => {
            if (!num && num !== 0) return 'Rp 0';
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
        };

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

        content.innerHTML = `
            <div class="mb-6">
                <button onclick="window.location.hash='#/therapists'" class="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Terapis
                </button>
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-800">${t.name || '-'}</h1>
                    <div class="flex items-center gap-2">
                        <button onclick="window.location.hash='#/therapists/${id}/schedule'"
                            class="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-xl hover:bg-gray-50 transition text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Jadwal
                        </button>
                        <button onclick="window.location.hash='#/therapists/${id}/edit'"
                            class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-xl transition text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>
            </div>

            <!-- Therapist Info Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Telepon</p>
                        <p class="text-sm text-gray-800">${t.phone || '-'}</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Spesialisasi</p>
                        <p class="text-sm text-gray-800">${t.specialty || '-'}</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Komisi</p>
                        <p class="text-sm text-gray-800 font-semibold">${t.commission_rate || 0}%</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Status</p>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status] || 'bg-gray-100 text-gray-500'}">${statusLabels[t.status] || t.status || '-'}</span>
                    </div>
                    ${t.notes ? `
                    <div class="sm:col-span-2 lg:col-span-4">
                        <p class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Catatan</p>
                        <p class="text-sm text-gray-600">${t.notes}</p>
                    </div>` : ''}
                </div>
            </div>

            <!-- Performance Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">Booking Selesai</p>
                            <p class="text-xl font-bold text-gray-800">${t.completed_bookings || 0}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">Total Pendapatan</p>
                            <p class="text-xl font-bold text-gray-800">${formatCurrency(t.total_revenue || 0)}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">Rating Rata-rata</p>
                            <p class="text-xl font-bold text-gray-800">${t.avg_rating || 0} <span class="text-sm font-normal text-yellow-400">★</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Schedule Section -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div class="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-700">Jadwal Mingguan</h3>
                    <button onclick="window.location.hash='#/therapists/${id}/schedule'"
                        class="text-sm text-primary-600 hover:text-primary-800 font-medium transition">
                        Kelola Jadwal
                    </button>
                </div>
                <div id="schedule-container" class="p-6">
                    ${skeleton.table(4, 3)}
                </div>
            </div>
        `;
    },

    async loadSchedule(id) {
        const container = document.getElementById('schedule-container');

        try {
            const res = await api.get(`/therapists/${id}/schedule`);
            this.state.schedule = res.data || [];
            this.renderSchedule(container);
        } catch (err) {
            container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">Gagal memuat jadwal</div>';
        }
    },

    renderSchedule(container) {
        const schedule = this.state.schedule;

        if (!schedule || schedule.length === 0) {
            container.innerHTML = '<div class="text-center py-8 text-gray-400 text-sm">Belum ada jadwal</div>';
            return;
        }

        const dayNames = {
            1: 'Senin',
            2: 'Selasa',
            3: 'Rabu',
            4: 'Kamis',
            5: 'Jumat',
            6: 'Sabtu',
        };

        const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '-';

        const sortedSchedule = [...schedule].sort((a, b) => (a.day_of_week || 0) - (b.day_of_week || 0));

        const rows = sortedSchedule.map(s => `
            <tr class="divide-y divide-gray-100">
                <td class="px-4 py-3 text-sm font-medium text-gray-700">${dayNames[s.day_of_week] || '-'}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${formatTime(s.start_time)}</td>
                <td class="px-4 py-3 text-sm text-gray-600">${formatTime(s.end_time)}</td>
                <td class="px-4 py-3">
                    ${s.is_available
                        ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Tersedia</span>'
                        : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Tidak Tersedia</span>'}
                </td>
            </tr>
        `).join('');

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hari</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mulai</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Selesai</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    },
};
