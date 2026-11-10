pages['bookings/detail'] = {
    state: {
        bookingId: null,
        booking: null,
        rooms: [],
        statusHistory: []
    },

    render(params) {
        this.state.bookingId = params.id;
        this.loadBooking();
    },

    async loadBooking() {
        const container = document.getElementById('page-content');
        const isTherapist = auth.getRole() === 'therapist';
        container.innerHTML = skeleton.detail(6);

        try {
            const [bookingRes, roomsRes] = await Promise.all([
                api.get('/bookings/' + this.state.bookingId),
                api.get('/rooms/list')
            ]);
            this.state.booking = bookingRes.data;
            this.state.statusHistory = bookingRes.status_history || [];
            this.state.rooms = (roomsRes.data || []).filter(r => r.status === 'active');
            this.renderDetail();
        } catch (err) {
            const backUrl = isTherapist ? '#/my-bookings' : '#/bookings';
            container.innerHTML = `
                <div class="text-center py-16 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat data</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                    <a href="${backUrl}" class="inline-block mt-3 text-sm text-primary-600 hover:underline">Kembali ke daftar</a>
                </div>
            `;
        }
    },

    renderDetail() {
        const booking = this.state.booking;
        const self = this;

        header.setTitle('Detail Booking ' + (booking.booking_code || booking.id || ''));

        const statusLabels = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            in_progress: 'In Progress',
            awaiting_payment: 'Menunggu Bayar',
            completed: 'Completed',
            cancelled: 'Cancelled',
            no_show: 'No Show'
        };

        const sourceLabels = {
            walk_in: 'Walk-in',
            whatsapp: 'WhatsApp',
            phone: 'Telepon',
            online: 'Online'
        };

        const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '-';

        // Status timeline steps - map audit history to statuses
        const allStatuses = ['pending', 'confirmed', 'in_progress', 'awaiting_payment', 'completed'];
        const currentIdx = allStatuses.indexOf(booking.status);
        const isCancelledOrNoShow = booking.status === 'cancelled' || booking.status === 'no_show';

        // Build a map of status -> audit log entry
        const historyMap = {};
        (self.state.statusHistory || []).forEach(entry => {
            let mappedStatus = null;
            let newValues = {};
            try { newValues = typeof entry.new_values === 'string' ? JSON.parse(entry.new_values) : (entry.new_values || {}); } catch (e) {}

            if (entry.action === 'create') {
                mappedStatus = 'pending';
            } else if (entry.action === 'check_in') {
                mappedStatus = 'confirmed';
            } else if (entry.action === 'check_out') {
                mappedStatus = 'awaiting_payment';
            } else if (entry.action === 'update_treatment_status') {
                mappedStatus = newValues.status || null;
            } else if (entry.action === 'update_status') {
                mappedStatus = newValues.status || null;
            }

            if (mappedStatus && allStatuses.includes(mappedStatus) && !historyMap[mappedStatus]) {
                historyMap[mappedStatus] = {
                    user_name: entry.user_name || '-',
                    created_at: entry.created_at || null,
                };
            }
        });

        const formatDateTime = (dateStr) => {
            if (!dateStr) return '-';
            const d = new Date(dateStr);
            return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        };

        const timelineHtml = allStatuses.map((status, idx) => {
            const isCompleted = idx <= currentIdx && !isCancelledOrNoShow;
            const isCurrent = idx === currentIdx && !isCancelledOrNoShow;
            const dotClass = isCompleted
                ? 'bg-primary-500'
                : (isCancelledOrNoShow ? 'bg-red-400' : 'bg-gray-300');
            const labelClass = isCompleted
                ? 'text-primary-700 font-semibold'
                : (isCancelledOrNoShow ? 'text-red-500' : 'text-gray-400');
            const infoClass = isCompleted ? 'text-gray-500' : 'text-gray-300';
            const isLast = idx === allStatuses.length - 1;
            const historyEntry = historyMap[status];

            return `
                <div class="flex ${isLast ? '' : 'min-h-[60px]'}">
                    <div class="flex flex-col items-center mr-3">
                        <div class="w-7 h-7 md:w-8 md:h-8 rounded-full ${dotClass} flex items-center justify-center flex-shrink-0">
                            ${isCompleted ? '<svg class="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : ''}
                        </div>
                        ${!isLast ? `<div class="w-0.5 flex-1 mt-1 ${isCompleted ? 'bg-primary-500' : 'bg-gray-200'}"></div>` : ''}
                    </div>
                    <div class="pb-4 ${isLast ? '' : 'flex-1'}">
                        <p class="text-sm ${labelClass}">${statusLabels[status]}</p>
                        ${historyEntry ? `
                            <p class="text-xs ${infoClass} mt-0.5">${historyEntry.user_name}</p>
                            <p class="text-[11px] ${infoClass}">${formatDateTime(historyEntry.created_at)}</p>
                        ` : (isCompleted ? '' : '')}
                    </div>
                </div>
            `;
        }).join('');

        // Action buttons
        let actionHtml = '';
        const role = auth.getRole();
        const isTherapist = role === 'therapist';
        const backUrl = isTherapist ? '#/my-bookings' : '#/bookings';

        if (isTherapist) {
            if (booking.status === 'confirmed') {
                actionHtml += `
                    <button onclick="pages['bookings/detail'].startTreatment()" id="btn-start"
                        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Mulai Treatment
                    </button>
                `;
            }
            if (booking.status === 'in_progress') {
                actionHtml += `
                    <button onclick="pages['bookings/detail'].completeTreatment()" id="btn-complete"
                        class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Selesai Treatment
                    </button>
                `;
            }
        } else {
        if ((booking.status === 'pending' || booking.status === 'confirmed') && !booking.checked_in_at) {
            actionHtml += `
                <button onclick="pages['bookings/detail'].checkIn()" id="btn-checkin"
                    class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                    Check-in
                </button>
            `;
        }

        if (booking.status === 'in_progress') {
            actionHtml += `
                <button onclick="pages['bookings/detail'].checkOut()" id="btn-checkout"
                    class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Check-out
                </button>
            `;
        }

        if (booking.status === 'awaiting_payment') {
            actionHtml += `
                <a href="#/transactions/manual?booking_id=${booking.id}"
                    class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    Input Pembayaran
                </a>
            `;
        }

        // Status change dropdown (confirm, cancel)
        if (booking.status === 'pending') {
            actionHtml += `
                <div class="relative inline-block" id="status-dropdown-container">
                    <button onclick="document.getElementById('status-dropdown').classList.toggle('hidden')"
                        class="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium py-2.5 px-5 rounded-xl hover:bg-gray-50 transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                        Ubah Status
                    </button>
                    <div id="status-dropdown" class="hidden absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                        <button onclick="pages['bookings/detail'].changeStatus('confirmed')"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-blue-500"></span> Confirm
                        </button>
                        <button onclick="pages['bookings/detail'].changeStatus('cancelled')"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-500"></span> Cancel
                        </button>
                    </div>
                </div>
            `;
        }

        if (booking.status === 'confirmed') {
            actionHtml += `
                <div class="relative inline-block" id="status-dropdown-container">
                    <button onclick="document.getElementById('status-dropdown').classList.toggle('hidden')"
                        class="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium py-2.5 px-5 rounded-xl hover:bg-gray-50 transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                        Ubah Status
                    </button>
                    <div id="status-dropdown" class="hidden absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                        <button onclick="pages['bookings/detail'].changeStatus('cancelled')"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-500"></span> Cancel
                        </button>
                    </div>
                </div>
            `;
        }

        // WhatsApp CTA button
        if (booking.customer_phone && !['confirmed', 'in_progress', 'awaiting_payment'].includes(booking.status)) {
            if (booking.status === 'completed') {
                actionHtml += `
                    <button onclick="pages['bookings/detail'].sendWhatsAppCompleted(event)"
                        class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                    </button>
                `;
            } else {
                actionHtml += `
                    <a href="${self.buildWhatsAppUrl(booking)}" target="_blank" rel="noopener"
                        class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                    </a>
                `;
            }
        }

        // Print receipt button (completed)
        if (booking.status === 'completed') {
            actionHtml += `
                <div class="relative inline-block" id="print-completed-dropdown-container">
                    <button onclick="document.getElementById('print-completed-dropdown').classList.toggle('hidden')"
                        class="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                        Print Struk
                    </button>
                    <div id="print-completed-dropdown" class="hidden absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                        <button onclick="pages['bookings/detail'].printCompletedReceipt(100)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                            <span>100mm</span><span class="text-xs text-gray-400"> thermal</span>
                        </button>
                        <button onclick="pages['bookings/detail'].printCompletedReceipt(80)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                            <span>80mm</span><span class="text-xs text-gray-400"> thermal</span>
                        </button>
                        <button onclick="pages['bookings/detail'].printCompletedReceipt(58)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                            <span>58mm</span><span class="text-xs text-gray-400"> thermal</span>
                        </button>
                    </div>
                </div>
            `;
        }

        // Print receipt button (only pending)
        if (booking.status === 'pending') {
            actionHtml += `
                <div class="relative inline-block" id="print-dropdown-container">
                    <button onclick="document.getElementById('print-dropdown').classList.toggle('hidden')"
                        class="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2.5 px-5 rounded-xl transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                        Print Struk
                    </button>
                    <div id="print-dropdown" class="hidden absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                        <button onclick="pages['bookings/detail'].printReceipt(100)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                            <span>100mm</span><span class="text-xs text-gray-400"> thermal</span>
                        </button>
                        <button onclick="pages['bookings/detail'].printReceipt(80)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                            <span>80mm</span><span class="text-xs text-gray-400"> thermal</span>
                        </button>
                        <button onclick="pages['bookings/detail'].printReceipt(58)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                            <span>58mm</span><span class="text-xs text-gray-400"> thermal</span>
                        </button>
                    </div>
                </div>
            `;
        }
        } // end else (owner/staff)


        const container = document.getElementById('page-content');
        container.innerHTML = `
            <div class="space-y-4">
                <!-- Header -->
                <div class="flex items-center justify-between detail-header-mobile">
                    <div class="flex items-center gap-2 md:gap-3">
                        <a href="${backUrl}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        </a>
                        <div>
                            <h1 class="text-lg md:text-xl font-bold text-gray-800">Detail Booking</h1>
                            <p class="text-xs md:text-sm text-primary-600 font-mono font-semibold">${booking.booking_code}</p>
                        </div>
                    </div>
                    <span class="badge badge-${booking.status}">${statusLabels[booking.status]}</span>
                </div>

                <!-- Info Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 detail-grid-mobile">
                        <!-- Customer -->
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</p>
                            <p class="text-sm font-semibold text-gray-800">${booking.customer_name || '-'}</p>
                            <p class="text-sm text-gray-500">${booking.customer_phone || '-'}</p>
                        </div>

                        <!-- Service -->
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Layanan</p>
                            <p class="text-sm font-semibold text-gray-800">${booking.service_names || booking.service_name || '-'}</p>
                            <p class="text-sm text-gray-500">${booking.total_duration ? booking.total_duration + ' menit' : (booking.service_duration ? booking.service_duration + ' menit' : '-')}</p>
                        </div>

                        <!-- Therapist -->
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Terapis</p>
                            <p class="text-sm font-semibold text-gray-800">${booking.therapist_name || '-'}</p>
                        </div>

                        <!-- Room -->
                        <div class="space-y-1" id="detail-room-container">
                            ${!isTherapist ? `
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Ruangan</p>
                                ${booking.room_id ? `
                                    <p class="text-sm font-semibold text-gray-800">${booking.room_name || '-'}</p>
                                ` : `
                                    <select id="detail-room-id" class="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                                        <option value="">-- Pilih Ruangan --</option>
                                        ${this.state.rooms.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                                    </select>
                                `}
                            ` : `
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Ruangan</p>
                                <p class="text-sm font-semibold text-gray-800">${booking.room_name || '-'}</p>
                            `}
                        </div>

                        <!-- Date & Time -->
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Tanggal & Waktu</p>
                            <p class="text-sm font-semibold text-gray-800">${formatDate(booking.booking_date)}</p>
                            <p class="text-sm text-gray-500">${formatTime(booking.start_time)}${booking.end_time ? ' - ' + formatTime(booking.end_time) : ''}</p>
                        </div>

                        <!-- Source -->
                        ${!isTherapist ? `
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Sumber</p>
                            <p class="text-sm font-semibold text-gray-800">${sourceLabels[booking.source] || booking.source || '-'}</p>
                        </div>
                        ` : ''}

                        <!-- Status -->
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
                            <p><span class="badge badge-${booking.status}">${statusLabels[booking.status]}</span></p>
                        </div>

                        <!-- Notes -->
                        ${booking.notes ? `
                        <div class="space-y-1 md:col-span-2 lg:col-span-3">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Catatan</p>
                            <p class="text-sm text-gray-700">${booking.notes}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Status Timeline -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <h3 class="text-sm font-semibold text-gray-700 mb-4">Status Timeline</h3>
                    <div class="flex items-center justify-between px-2 md:px-4 status-timeline-mobile">
                        ${timelineHtml}
                    </div>
                    ${isCancelledOrNoShow ? `<p class="text-center text-sm text-red-500 mt-3 font-medium">Booking telah ${statusLabels[booking.status].toLowerCase()}</p>` : ''}
                </div>

                <!-- Action Buttons -->
                ${actionHtml ? `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4">
                    <div class="flex flex-wrap items-center gap-2 md:gap-3 action-buttons-mobile">
                        ${actionHtml}
                    </div>
                </div>
                ` : ''}

            </div>
        `;

        // Close dropdown on outside click
        if (this._dropdownHandler) {
            document.removeEventListener('click', this._dropdownHandler);
        }
        this._dropdownHandler = function (e) {
            const dropdownContainer = document.getElementById('status-dropdown-container');
            const dropdown = document.getElementById('status-dropdown');
            if (dropdownContainer && dropdown && !dropdownContainer.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
            const printContainer = document.getElementById('print-dropdown-container');
            const printDropdown = document.getElementById('print-dropdown');
            if (printContainer && printDropdown && !printContainer.contains(e.target)) {
                printDropdown.classList.add('hidden');
            }
            const printCompletedContainer = document.getElementById('print-completed-dropdown-container');
            const printCompletedDropdown = document.getElementById('print-completed-dropdown');
            if (printCompletedContainer && printCompletedDropdown && !printCompletedContainer.contains(e.target)) {
                printCompletedDropdown.classList.add('hidden');
            }
        };
        document.addEventListener('click', this._dropdownHandler);


        // Init room TomSelect + change handler (owner/staff only)
        if (!isTherapist) {
            form.initTomSelect('#detail-room-id');
            const roomSelect = document.getElementById('detail-room-id');
            if (roomSelect) {
                roomSelect.addEventListener('change', async function () {
                    try {
                        await api.put('/bookings/' + self.state.bookingId, { room_id: this.value || null });
                        toast.success('Ruangan berhasil diperbarui');
                    } catch (err) {
                        toast.error(err.message || 'Gagal mengubah ruangan');
                    }
                });
            }
        }
    },

    async checkIn() {
        confirmDialog.show(
            'Konfirmasi Check-in',
            'Yakin ingin melakukan check-in booking ini?',
            async () => {
                try {
                    await api.post('/bookings/' + this.state.bookingId + '/checkin');
                    toast.success('Check-in berhasil');
                    this.loadBooking();
                    sidebar.render();
                } catch (err) {
                    toast.error(err.message || 'Gagal melakukan check-in');
                }
            },
            'Check-in'
        );
    },

    async checkOut() {
        confirmDialog.show(
            'Konfirmasi Check-out',
            'Yakin ingin melakukan check-out booking ini?',
            async () => {
                try {
                    await api.post('/bookings/' + this.state.bookingId + '/checkout');
                    toast.success('Check-out berhasil. Menunggu pembayaran.');
                    this.loadBooking();
                    sidebar.render();
                } catch (err) {
                    toast.error(err.message || 'Gagal melakukan check-out');
                }
            },
            'Check-out'
        );
    },

    async changeStatus(newStatus) {
        const statusLabels = {
            confirmed: 'Confirmed',
            cancelled: 'Cancelled'
        };

        confirmDialog.show(
            'Ubah Status',
            `Yakin ingin mengubah status menjadi "${statusLabels[newStatus]}"?`,
            async () => {
                try {
                    await api.put('/bookings/' + this.state.bookingId + '/status', { status: newStatus });
                    toast.success('Status berhasil diubah');
                    this.loadBooking();
                    sidebar.render();
                } catch (err) {
                    toast.error(err.message || 'Gagal mengubah status');
                }
            },
            'Ubah'
        );
    },

    async startTreatment() {
        confirmDialog.show('Mulai Treatment', 'Apakah Anda ingin memulai treatment ini?', async () => {
            try {
                await api.put('/bookings/' + this.state.bookingId + '/treatment-status', { status: 'in_progress' });
                toast.success('Treatment dimulai');
                this.loadBooking();
            } catch (err) {
                toast.error(err.message || 'Gagal memulai treatment');
            }
        }, 'Mulai');
    },

    async completeTreatment() {
        confirmDialog.show('Selesai Treatment', 'Apakah treatment sudah selesai?', async () => {
            try {
                await api.put('/bookings/' + this.state.bookingId + '/treatment-status', { status: 'awaiting_payment' });
                toast.success('Treatment selesai. Menunggu pembayaran.');
                this.loadBooking();
            } catch (err) {
                toast.error(err.message || 'Gagal menyelesaikan treatment');
            }
        }, 'Selesai');
    },

    buildWhatsAppUrl(booking) {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = new Date(booking.booking_date);
        const dayName = days[d.getDay()];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const dateFormatted = dayName + ', ' + (day < 10 ? '0' + day : day) + ' ' + month + ' ' + year;
        const startTime = (booking.start_time || '').substring(0, 5);
        const duration = booking.total_duration || booking.service_duration || '-';
        const price = booking.total_price ? 'Rp ' + Number(booking.total_price).toLocaleString('id-ID') : (booking.service_price ? 'Rp ' + Number(booking.service_price).toLocaleString('id-ID') : '-');
        const room = booking.room_name || '-';

        const message = `Konfirmasi Booking — Serena Spa\n` +
            `Nama: ${booking.customer_name || '-'}\n` +
            `Layanan: ${booking.service_names || booking.service_name || '-'}\n` +
            `Terapis: ${booking.therapist_name || '-'}\n` +
            `Hari/Tgl: ${dateFormatted}\n` +
            `Jam: ${startTime} WIB (${duration} menit)\n` +
            `Ruang: ${room}\n` +
            `Total: ${price}\n\n` +
            `Mohon hadir 5-10 menit sebelum jadwal. Hubungi kami jika ada perubahan.`;

        const phone = (booking.customer_phone || '').replace(/[^0-9]/g, '');
        const phoneInternational = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
        return 'https://wa.me/' + phoneInternational + '?text=' + encodeURIComponent(message);
    },

    async sendWhatsAppCompleted(e) {
        if (e) e.preventDefault();
        const booking = this.state.booking;

        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = new Date(booking.booking_date);
        const dayName = days[d.getDay()];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const dateFormatted = dayName + ', ' + (day < 10 ? '0' + day : day) + ' ' + month + ' ' + year;
        const startTime = (booking.start_time || '').substring(0, 5);
        const duration = booking.total_duration || booking.service_duration || '-';
        const price = booking.total_price ? 'Rp ' + Number(booking.total_price).toLocaleString('id-ID') : (booking.service_price ? 'Rp ' + Number(booking.service_price).toLocaleString('id-ID') : '-');
        const room = booking.room_name || '-';

        const methodLabels = { cash: 'Cash', transfer: 'Transfer', qris: 'QRIS', card: 'Kartu', other: 'Lainnya' };

        let paymentLines = '';
        try {
            const txRes = await api.get('/transactions?booking_id=' + booking.id);
            if (txRes.data && txRes.data.length > 0) {
                const tx = txRes.data[0];
                const subtotal = tx.subtotal ? 'Rp ' + Number(tx.subtotal).toLocaleString('id-ID') : '-';
                const discount = tx.discount && Number(tx.discount) > 0 ? 'Rp ' + Number(tx.discount).toLocaleString('id-ID') : '-';
                const totalAmount = tx.total_amount ? 'Rp ' + Number(tx.total_amount).toLocaleString('id-ID') : '-';
                const method = methodLabels[tx.payment_method] || tx.payment_method || '-';
                const txCode = tx.transaction_code || '-';

                const taxAmount = tx.tax_amount && Number(tx.tax_amount) > 0 ? 'Rp ' + Number(tx.tax_amount).toLocaleString('id-ID') : null;

                paymentLines = `\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `DETAIL PEMBAYARAN\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `No. Transaksi: ${txCode}\n` +
                    `Subtotal: ${subtotal}\n` +
                    `Diskon: ${discount}\n` +
                    (taxAmount ? `Pajak: ${taxAmount}\n` : '') +
                    `TOTAL BAYAR: ${totalAmount}\n` +
                    `Metode: ${method}\n`;
            }
        } catch (e) { /* ignore */ }

        const baseUrl = window.location.origin + window.location.pathname;
        const reviewUrl = baseUrl + '#/rating/' + (booking.booking_code || '');

        const message = `Serena Spa\n` +
            `STRUK BOOKING\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `No. Booking: ${booking.booking_code || '-'}\n` +
            `Customer: ${booking.customer_name || '-'}\n` +
            `Telepon: ${booking.customer_phone || '-'}\n` +
            `Layanan: ${booking.service_names || booking.service_name || '-'}\n` +
            `Terapis: ${booking.therapist_name || '-'}\n` +
            `Hari/Tgl: ${dateFormatted}\n` +
            `Jam: ${startTime} WIB (${duration} menit)\n` +
            `Ruang: ${room}\n` +
            `Total: ${price}` +
            paymentLines +
            `\n━━━━━━━━━━━━━━━━\n` +
            `Bagaimana pengalaman Anda?\n` +
            `Review: ${reviewUrl}\n\n` +
            `Terima kasih telah berkunjung di Serena Spa!`;

        const phone = (booking.customer_phone || '').replace(/[^0-9]/g, '');
        const phoneInternational = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
        window.open('https://wa.me/' + phoneInternational + '?text=' + encodeURIComponent(message), '_blank');
    },

    printReceipt(widthMm) {
        const booking = this.state.booking;
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = new Date(booking.booking_date);
        const dayName = days[d.getDay()];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const dateFormatted = dayName + ', ' + (day < 10 ? '0' + day : day) + ' ' + month + ' ' + year;
        const startTime = (booking.start_time || '').substring(0, 5);
        const duration = booking.total_duration || booking.service_duration || '-';
        const price = booking.total_price ? 'Rp ' + Number(booking.total_price).toLocaleString('id-ID') : (booking.service_price ? 'Rp ' + Number(booking.service_price).toLocaleString('id-ID') : '-');
        const room = booking.room_name || '-';
        const now = new Date();
        const printedAt = (now.getDate() < 10 ? '0' : '') + now.getDate() + '/' + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + '/' + now.getFullYear() + ' ' + (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

        const pxWidth = widthMm * 3.78;
        const fontSize = widthMm >= 100 ? 13 : (widthMm >= 80 ? 12 : 10);
        const titleSize = widthMm >= 100 ? 18 : (widthMm >= 80 ? 16 : 13);

        const receiptHtml = `
            <div style="width:${pxWidth}px;font-family:'Courier New',monospace;font-size:${fontSize}px;padding:8px;color:#000;">
                <div style="text-align:center;margin-bottom:8px;">
                    <div style="font-size:${titleSize}px;font-weight:bold;">Serena Spa</div>
                    <div style="font-size:${fontSize - 2}px;margin-top:2px;">STRUK BOOKING</div>
                </div>
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <table style="width:100%;border-collapse:collapse;">
                    <tr><td style="padding:1px 0;">No. Booking</td><td style="text-align:right;font-weight:bold;">${booking.booking_code || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Customer</td><td style="text-align:right;">${booking.customer_name || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Telepon</td><td style="text-align:right;">${booking.customer_phone || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Layanan</td><td style="text-align:right;">${booking.service_names || booking.service_name || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Terapis</td><td style="text-align:right;">${booking.therapist_name || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Hari/Tgl</td><td style="text-align:right;">${dateFormatted}</td></tr>
                    <tr><td style="padding:1px 0;">Jam</td><td style="text-align:right;">${startTime} WIB (${duration} menit)</td></tr>
                    <tr><td style="padding:1px 0;">Ruang</td><td style="text-align:right;">${room}</td></tr>
                </table>
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <table style="width:100%;border-collapse:collapse;">
                    <tr><td style="padding:1px 0;font-weight:bold;font-size:${fontSize + 2}px;">TOTAL</td><td style="text-align:right;font-weight:bold;font-size:${fontSize + 2}px;">${price}</td></tr>
                </table>
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <div style="text-align:center;font-size:${fontSize - 2}px;">
                    <div>Mohon hadir 5-10 menit sebelum jadwal.</div>
                    <div>Hubungi kami jika ada perubahan.</div>
                </div>
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <div style="text-align:center;font-size:${fontSize - 3}px;color:#666;">
                    Dicetak: ${printedAt}
                </div>
            </div>
        `;

        const printWindow = window.open('', '_blank', 'width=' + (pxWidth + 40) + ',height=600');
        printWindow.document.write(`
            <!DOCTYPE html><html><head><title>Struk Booking ${booking.booking_code}</title>
            <style>
                @page { size: ${widthMm}mm auto; margin: 0; }
                body { margin: 0; padding: 10px; }
                @media print { body { padding: 0; } }
            </style></head>
            <body>${receiptHtml}
            <script>window.onload = function() { window.print(); }<\/script>
            </body></html>
        `);
        printWindow.document.close();

        // close dropdown after click
        const printDropdown = document.getElementById('print-dropdown');
        if (printDropdown) printDropdown.classList.add('hidden');
    },

    async printCompletedReceipt(widthMm) {
        const booking = this.state.booking;
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const d = new Date(booking.booking_date);
        const dayName = days[d.getDay()];
        const day = d.getDate();
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const dateFormatted = dayName + ', ' + (day < 10 ? '0' + day : day) + ' ' + month + ' ' + year;
        const startTime = (booking.start_time || '').substring(0, 5);
        const duration = booking.total_duration || booking.service_duration || '-';
        const price = booking.total_price ? 'Rp ' + Number(booking.total_price).toLocaleString('id-ID') : (booking.service_price ? 'Rp ' + Number(booking.service_price).toLocaleString('id-ID') : '-');
        const room = booking.room_name || '-';
        const now = new Date();
        const printedAt = (now.getDate() < 10 ? '0' : '') + now.getDate() + '/' + (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) + '/' + now.getFullYear() + ' ' + (now.getHours() < 10 ? '0' : '') + now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

        const baseUrl = window.location.origin + window.location.pathname;
        const reviewUrl = baseUrl + '#/rating/' + (booking.booking_code || '');

        const pxWidth = widthMm * 3.78;
        const fontSize = widthMm >= 100 ? 13 : (widthMm >= 80 ? 12 : 10);
        const titleSize = widthMm >= 100 ? 18 : (widthMm >= 80 ? 16 : 13);
        const qrSize = widthMm >= 100 ? 150 : (widthMm >= 80 ? 130 : 100);

        // Fetch transaction data for this booking
        let tx = null;
        try {
            const txRes = await api.get('/transactions?booking_id=' + booking.id);
            if (txRes.data && txRes.data.length > 0) {
                tx = txRes.data[0];
            }
        } catch (e) { /* ignore */ }

        const methodLabels = { cash: 'Cash', transfer: 'Transfer', qris: 'QRIS', card: 'Kartu', other: 'Lainnya' };

        // Build payment detail section
        let paymentHtml = '';
        if (tx) {
            const subtotal = tx.subtotal ? 'Rp ' + Number(tx.subtotal).toLocaleString('id-ID') : '-';
            const discount = tx.discount && Number(tx.discount) > 0 ? 'Rp ' + Number(tx.discount).toLocaleString('id-ID') : 'Rp 0';
            const totalAmount = tx.total_amount ? 'Rp ' + Number(tx.total_amount).toLocaleString('id-ID') : '-';
            const method = methodLabels[tx.payment_method] || tx.payment_method || '-';
            const txCode = tx.transaction_code || '-';
            const paidAt = tx.paid_at ? new Date(tx.paid_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

            const taxAmount = tx.tax_amount && Number(tx.tax_amount) > 0 ? 'Rp ' + Number(tx.tax_amount).toLocaleString('id-ID') : null;

            paymentHtml = `
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <div style="text-align:center;font-weight:bold;margin-bottom:4px;">DETAIL PEMBAYARAN</div>
                <table style="width:100%;border-collapse:collapse;">
                    <tr><td style="padding:1px 0;">No. Transaksi</td><td style="text-align:right;">${txCode}</td></tr>
                    <tr><td style="padding:1px 0;">Subtotal</td><td style="text-align:right;">${subtotal}</td></tr>
                    <tr><td style="padding:1px 0;">Diskon</td><td style="text-align:right;">${discount}</td></tr>
                    ${taxAmount ? `<tr><td style="padding:1px 0;">Pajak</td><td style="text-align:right;">${taxAmount}</td></tr>` : ''}
                    <tr><td style="padding:1px 0;font-weight:bold;font-size:${fontSize + 2}px;">TOTAL BAYAR</td><td style="text-align:right;font-weight:bold;font-size:${fontSize + 2}px;">${totalAmount}</td></tr>
                    <tr><td style="padding:1px 0;">Metode</td><td style="text-align:right;">${method}</td></tr>
                    <tr><td style="padding:1px 0;">Waktu Bayar</td><td style="text-align:right;">${paidAt}</td></tr>
                </table>
            `;
        }

        const receiptHtml = `
            <div style="width:${pxWidth}px;font-family:'Courier New',monospace;font-size:${fontSize}px;padding:8px;color:#000;">
                <div style="text-align:center;margin-bottom:8px;">
                    <div style="font-size:${titleSize}px;font-weight:bold;">Serena Spa</div>
                    <div style="font-size:${fontSize - 2}px;margin-top:2px;">STRUK BOOKING</div>
                </div>
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <table style="width:100%;border-collapse:collapse;">
                    <tr><td style="padding:1px 0;">No. Booking</td><td style="text-align:right;font-weight:bold;">${booking.booking_code || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Customer</td><td style="text-align:right;">${booking.customer_name || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Telepon</td><td style="text-align:right;">${booking.customer_phone || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Layanan</td><td style="text-align:right;">${booking.service_names || booking.service_name || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Terapis</td><td style="text-align:right;">${booking.therapist_name || '-'}</td></tr>
                    <tr><td style="padding:1px 0;">Hari/Tgl</td><td style="text-align:right;">${dateFormatted}</td></tr>
                    <tr><td style="padding:1px 0;">Jam</td><td style="text-align:right;">${startTime} WIB (${duration} menit)</td></tr>
                    <tr><td style="padding:1px 0;">Ruang</td><td style="text-align:right;">${room}</td></tr>
                </table>
                ${paymentHtml}
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <div style="text-align:center;margin:8px 0;">
                    <div id="qrcode-container"></div>
                    <div style="font-size:${fontSize - 2}px;margin-top:4px;">Scan untuk review</div>
                </div>
                <div style="border-top:1px dashed #000;margin:6px 0;"></div>
                <div style="text-align:center;font-size:${fontSize - 3}px;color:#666;">
                    Dicetak: ${printedAt}
                </div>
            </div>
        `;

        const printWindow = window.open('', '_blank', 'width=' + (pxWidth + 40) + ',height=600');
        printWindow.document.write(`
            <!DOCTYPE html><html><head><title>Struk Booking ${booking.booking_code}</title>
            <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"><\/script>
            <style>
                @page { size: ${widthMm}mm auto; margin: 0; }
                body { margin: 0; padding: 10px; }
                @media print { body { padding: 0; } }
                #qrcode-container canvas, #qrcode-container img { margin: 0 auto; }
            </style></head>
            <body>${receiptHtml}
            <script>
                window.onload = function() {
                    new QRCode(document.getElementById('qrcode-container'), {
                        text: '${reviewUrl}',
                        width: ${qrSize},
                        height: ${qrSize},
                        correctLevel: QRCode.CorrectLevel.M
                    });
                    setTimeout(function() { window.print(); }, 300);
                };
            <\/script>
            </body></html>
        `);
        printWindow.document.close();

        const printCompletedDropdown = document.getElementById('print-completed-dropdown');
        if (printCompletedDropdown) printCompletedDropdown.classList.add('hidden');
    },

};

