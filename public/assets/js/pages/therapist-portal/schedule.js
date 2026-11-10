pages['therapist-portal/schedule'] = {
    state: {
        schedule: [],
        currentWeekStart: null,
    },

    render(params) {
        header.setTitle('Jadwal Saya');
        const container = document.getElementById('page-content');

        const today = new Date();
        const dayOfWeek = today.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        this.state.currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset);

        container.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold text-gray-800">Jadwal Saya</h1>
                    <div class="flex items-center gap-2">
                        <button id="prev-week" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <span id="week-label" class="text-sm font-medium text-gray-700 min-w-[200px] text-center"></span>
                        <button id="next-week" class="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-gray-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>

                <!-- Legend -->
                <div class="flex flex-wrap gap-4 text-xs">
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-green-500"></span> Completed</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-yellow-500"></span> Pending</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-500"></span> Confirmed</span>
                    <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-red-500"></span> Cancelled</span>
                </div>

                <!-- Calendar Grid -->
                <div id="schedule-grid"></div>
            </div>
        `;

        this.bindEvents();
        this.loadSchedule();
    },

    bindEvents() {
        const self = this;
        document.getElementById('prev-week').addEventListener('click', function () {
            const d = new Date(self.state.currentWeekStart);
            d.setDate(d.getDate() - 7);
            self.state.currentWeekStart = d;
            self.loadSchedule();
        });
        document.getElementById('next-week').addEventListener('click', function () {
            const d = new Date(self.state.currentWeekStart);
            d.setDate(d.getDate() + 7);
            self.state.currentWeekStart = d;
            self.loadSchedule();
        });
    },

    getWeekDates() {
        const dates = [];
        const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        const base = new Date(this.state.currentWeekStart.getFullYear(), this.state.currentWeekStart.getMonth(), this.state.currentWeekStart.getDate());
        for (let i = 0; i < 7; i++) {
            const d = new Date(base);
            d.setDate(base.getDate() + i);
            dates.push({ date: d, dayName: dayNames[i] });
        }
        return dates;
    },

    async loadSchedule() {
        const grid = document.getElementById('schedule-grid');
        grid.innerHTML = skeleton.calendarCard(7);

        const weekDates = this.getWeekDates();
        const fmtDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const startDate = fmtDate(weekDates[0].date);
        const endDate = fmtDate(weekDates[6].date);

        const fmt = (d) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        document.getElementById('week-label').textContent = fmt(weekDates[0].date) + ' - ' + fmt(weekDates[6].date);

        try {
            const res = await api.get(`/therapist/my-schedule?start_date=${startDate}&end_date=${endDate}`);
            this.state.schedule = res.data || [];
            this.renderGrid(weekDates);
        } catch (err) {
            grid.innerHTML = `
                <div class="text-center py-12 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat jadwal</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                    <button onclick="pages['therapist-portal/schedule'].loadSchedule()" class="mt-3 text-sm text-primary-600 hover:underline">Coba lagi</button>
                </div>
            `;
        }
    },

    renderGrid(weekDates) {
        const grid = document.getElementById('schedule-grid');
        const today = new Date();
        const fmtDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const todayStr = fmtDate(today);

        const statusColors = {
            completed: 'bg-green-100 border-green-400 text-green-800',
            awaiting_payment: 'bg-orange-100 border-orange-400 text-orange-800',
            pending: 'bg-yellow-100 border-yellow-400 text-yellow-800',
            confirmed: 'bg-blue-100 border-blue-400 text-blue-800',
            in_progress: 'bg-purple-100 border-purple-400 text-purple-800',
            cancelled: 'bg-red-100 border-red-400 text-red-800',
            no_show: 'bg-gray-100 border-gray-400 text-gray-800',
        };

        const statusLabels = {
            completed: 'Completed',
            awaiting_payment: 'Menunggu Bayar',
            pending: 'Pending',
            confirmed: 'Confirmed',
            in_progress: 'In Progress',
            cancelled: 'Cancelled',
            no_show: 'No Show',
        };

        const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '-';

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">';

        weekDates.forEach(({ date, dayName }) => {
            const dateStr = fmtDate(date);
            const isToday = dateStr === todayStr;
            const dayBookings = this.state.schedule.filter(b => b.booking_date === dateStr);

            html += `
                <div class="bg-white rounded-2xl shadow-sm border ${isToday ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-100'} p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <p class="text-xs font-medium uppercase ${isToday ? 'text-primary-600' : 'text-gray-400'}">${dayName}</p>
                            <p class="text-lg font-bold ${isToday ? 'text-primary-700' : 'text-gray-800'}">${date.getDate()} ${date.toLocaleDateString('id-ID', { month: 'short' })}</p>
                        </div>
                        ${isToday ? '<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">Hari ini</span>' : ''}
                    </div>
                    <div class="space-y-2">
            `;

            if (dayBookings.length === 0) {
                html += '<p class="text-sm text-gray-400 text-center py-4">Tidak ada jadwal</p>';
            } else {
                dayBookings.sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));
                dayBookings.forEach(booking => {
                    const colorClass = statusColors[booking.status] || 'bg-gray-100 border-gray-400 text-gray-800';
                    const statusLabel = statusLabels[booking.status] || booking.status;
                    html += `
                        <div onclick="window.location.hash='#/bookings/${booking.id}'" class="rounded-xl border-l-4 p-3 ${colorClass} cursor-pointer hover:shadow-md transition">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-xs font-semibold">${formatTime(booking.start_time)} - ${formatTime(booking.end_time)}</span>
                                <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/60">${statusLabel}</span>
                            </div>
                            <p class="text-sm font-medium">${booking.customer_name || '-'}</p>
                            <p class="text-xs opacity-80">${booking.service_name || '-'}</p>
                        </div>
                    `;
                });
            }

            html += '</div></div>';
        });

        html += '</div>';
        grid.innerHTML = html;
    }
};
