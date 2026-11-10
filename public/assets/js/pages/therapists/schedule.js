pages['therapists/schedule'] = {
    state: {
        therapistId: null,
        therapistName: '',
        schedule: [],
    },

    async render(params) {
        this.state.therapistId = params.id;

        const content = document.getElementById('page-content');
        content.innerHTML = skeleton.table(4, 6);

        try {
            const therapistRes = await api.get(`/therapists/${params.id}`);
            this.state.therapistName = therapistRes.data?.name || 'Terapis';
            header.setTitle('Jadwal Terapis: ' + this.state.therapistName);

            const scheduleRes = await api.get(`/therapists/${params.id}/schedule`);
            this.state.schedule = scheduleRes.data || [];

            this.renderSchedulePage();
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data');
            content.innerHTML = '<div class="text-center py-12 text-red-400 text-sm">Data tidak ditemukan</div>';
        }
    },

    renderSchedulePage() {
        const content = document.getElementById('page-content');
        const schedule = this.state.schedule;
        const therapistName = this.state.therapistName;

        const dayNames = {
            1: 'Senin',
            2: 'Selasa',
            3: 'Rabu',
            4: 'Kamis',
            5: 'Jumat',
            6: 'Sabtu',
        };

        const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '-';

        const scheduleMap = {};
        (schedule || []).forEach(s => {
            scheduleMap[s.day_of_week] = s;
        });

        const rows = [1, 2, 3, 4, 5, 6].map(day => {
            const entry = scheduleMap[day];
            return `
                <tr class="divide-y divide-gray-100 hover:bg-gray-50 transition">
                    <td class="px-4 py-4 text-sm font-medium text-gray-700">${dayNames[day]}</td>
                    <td class="px-4 py-4 text-sm text-gray-600">${entry ? formatTime(entry.start_time) : '-'}</td>
                    <td class="px-4 py-4 text-sm text-gray-600">${entry ? formatTime(entry.end_time) : '-'}</td>
                    <td class="px-4 py-4">
                        ${entry
                            ? (entry.is_available
                                ? '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Tersedia</span>'
                                : '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Tidak Tersedia</span>')
                            : '<span class="text-xs text-gray-400">Belum diatur</span>'}
                    </td>
                    <td class="px-4 py-4 text-right">
                        <button onclick="pages['therapists/schedule'].openScheduleModal(${day})"
                            class="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition">
                            ${entry ? 'Edit' : 'Tambah'}
                        </button>
                        ${entry ? `
                        <button onclick="pages['therapists/schedule'].deleteSchedule(${entry.id}, ${day})"
                            class="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition ml-1">
                            Hapus
                        </button>` : ''}
                    </td>
                </tr>
            `;
        }).join('');

        content.innerHTML = `
            <div class="mb-6">
                <button onclick="window.location.hash='#/therapists/${this.state.therapistId}'" class="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    ${therapistName}
                </button>
                <h1 class="text-2xl font-bold text-gray-800">Jadwal Terapis: ${therapistName}</h1>
                <p class="text-sm text-gray-500 mt-1">Kelola jadwal kerja mingguan</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hari</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jam Mulai</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jam Selesai</th>
                                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ketersediaan</th>
                                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Schedule Modal -->
            <div id="schedule-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center">
                <div class="absolute inset-0 bg-black/40" onclick="pages['therapists/schedule'].closeScheduleModal()"></div>
                <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-800" id="modal-title">Tambah Jadwal</h3>
                        <button onclick="pages['therapists/schedule'].closeScheduleModal()" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <form id="schedule-form">
                        <input type="hidden" id="schedule-id" name="id" value="">
                        <input type="hidden" id="schedule-day" name="day_of_week" value="">

                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                                <input type="text" id="schedule-day-label" name="day_label" readonly
                                    class="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-600">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Jam Mulai <span class="text-red-500">*</span></label>
                                <input type="time" name="start_time" id="schedule-start" required
                                    class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Jam Selesai <span class="text-red-500">*</span></label>
                                <input type="time" name="end_time" id="schedule-end" required
                                    class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                            </div>
                            <div>
                                <label class="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="is_available" id="schedule-available" checked
                                        class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                    <span class="text-sm font-medium text-gray-700">Tersedia</span>
                                </label>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm">Simpan</button>
                            <button type="button" onclick="pages['therapists/schedule'].closeScheduleModal()"
                                class="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Bind form submit
        document.getElementById('schedule-form').addEventListener('submit', (e) => {
            this.submitSchedule(e);
        });
    },

    openScheduleModal(dayOfWeek) {
        const dayNames = {
            1: 'Senin',
            2: 'Selasa',
            3: 'Rabu',
            4: 'Kamis',
            5: 'Jumat',
            6: 'Sabtu',
        };

        const existing = this.state.schedule.find(s => s.day_of_week === dayOfWeek);

        document.getElementById('schedule-id').value = existing ? existing.id : '';
        document.getElementById('schedule-day').value = dayOfWeek;
        document.getElementById('schedule-day-label').value = dayNames[dayOfWeek] || '';
        document.getElementById('schedule-start').value = existing ? (existing.start_time || '').substring(0, 5) : '';
        document.getElementById('schedule-end').value = existing ? (existing.end_time || '').substring(0, 5) : '';
        document.getElementById('schedule-available').checked = existing ? !!existing.is_available : true;

        document.getElementById('modal-title').textContent = existing ? 'Edit Jadwal' : 'Tambah Jadwal';
        document.getElementById('schedule-modal').classList.remove('hidden');
    },

    closeScheduleModal() {
        document.getElementById('schedule-modal').classList.add('hidden');
    },

    async deleteSchedule(scheduleId, dayOfWeek) {
        const dayNames = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu' };

        confirmDialog.show(
            'Hapus Jadwal',
            'Yakin ingin menghapus jadwal ' + dayNames[dayOfWeek] + '?',
            async () => {
                try {
                    await api.delete(`/therapists/${this.state.therapistId}/schedule/${scheduleId}`);
                    toast.success('Jadwal berhasil dihapus');
                    this.render({ id: this.state.therapistId });
                } catch (err) {
                    toast.error(err.message || 'Gagal menghapus jadwal');
                }
            },
            'Hapus'
        );
    },

    async submitSchedule(e) {
        e.preventDefault();
        const formEl = document.getElementById('schedule-form');
        const submitBtn = formEl.querySelector('button[type="submit"]');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';

        try {
            const data = {
                day_of_week: parseInt(document.getElementById('schedule-day').value),
                start_time: document.getElementById('schedule-start').value + ':00',
                end_time: document.getElementById('schedule-end').value + ':00',
                is_available: document.getElementById('schedule-available').checked ? 1 : 0,
            };

            const scheduleId = document.getElementById('schedule-id').value;

            if (scheduleId) {
                await api.put(`/therapists/${this.state.therapistId}/schedule/${scheduleId}`, data);
                toast.success('Jadwal berhasil diperbarui');
            } else {
                await api.post(`/therapists/${this.state.therapistId}/schedule`, data);
                toast.success('Jadwal berhasil ditambahkan');
            }

            this.closeScheduleModal();
            this.render({ id: this.state.therapistId });
        } catch (err) {
            toast.error(err.message || 'Gagal menyimpan jadwal');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Simpan';
        }
    },
};
