pages['bookings/form'] = {
    state: {
        isEdit: false,
        bookingId: null,
        services: [],
        customers: [],
        therapists: [],
        rooms: [],
        selectedServices: []
    },

    render(params) {
        this.state.isEdit = !!params.id;
        this.state.bookingId = params.id || null;

        header.setTitle(this.state.isEdit ? 'Edit Booking' : 'Booking Baru');

        const container = document.getElementById('page-content');
        container.innerHTML = `
            <div class="space-y-4">
                <!-- Header -->
                <div class="flex items-center gap-2 md:gap-3">
                    <a href="#/bookings" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    </a>
                    <h1 class="text-lg md:text-xl font-bold text-gray-800">${this.state.isEdit ? 'Edit Booking' : 'Booking Baru'}</h1>
                </div>

                <!-- Form -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <form id="booking-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 form-grid-mobile">
                            <!-- Customer -->
                            <div id="field-customer">
                                ${skeleton.formField()}
                            </div>

                            <!-- Service -->
                            <div id="field-service">
                                ${skeleton.formField()}
                            </div>

                            <!-- Therapist -->
                            <div id="field-therapist">
                                ${skeleton.formField()}
                            </div>

                            <!-- Room -->
                            <div id="field-room">
                                ${skeleton.formField()}
                            </div>

                            <!-- Booking Date -->
                            <div id="field-date">
                                ${skeleton.formField()}
                            </div>

                            <!-- Start Time -->
                            <div id="field-start-time">
                                ${skeleton.formField()}
                            </div>

                            <!-- Source -->
                            <div id="field-source">
                                ${skeleton.formField()}
                            </div>

                            <!-- Notes -->
                            <div id="field-notes" class="md:col-span-2">
                                ${skeleton.formField()}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
                            <a href="#/bookings" class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Batal</a>
                            <button type="submit" id="btn-submit"
                                class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm inline-flex items-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.initForm();
    },

    async initForm() {
        try {
            // Fetch dropdown data in parallel
            const [customersRes, servicesRes, therapistsRes, roomsRes] = await Promise.all([
                api.get('/customers'),
                api.get('/services/list'),
                api.get('/therapists/list'),
                api.get('/rooms/list')
            ]);

            this.state.customers = customersRes.data || [];
            this.state.services = servicesRes.data || [];
            this.state.therapists = (therapistsRes.data || []).filter(t => t.is_active || t.status === 'active');
            this.state.rooms = (roomsRes.data || []).filter(r => r.status === 'active');

            // If edit mode, fetch booking data
            let booking = null;
            if (this.state.isEdit) {
                const res = await api.get('/bookings/' + this.state.bookingId);
                booking = res.data;
                if (booking && booking.status !== 'pending') {
                    toast.error('Hanya booking dengan status Pending yang bisa diedit');
                    window.location.hash = '#/bookings/' + this.state.bookingId;
                    return;
                }
            }

            this.renderFields(booking);
            this.initSelects();
            this.bindFormEvents();
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data');
        }
    },

    renderFields(booking) {
        const customerOptions = this.state.customers.map(c => ({
            value: c.id,
            label: c.name + (c.phone ? ' (' + c.phone + ')' : '')
        }));

        const serviceOptions = this.state.services.map(s => ({
            value: s.id,
            label: s.name + ' (' + (s.duration_minutes || s.duration) + ' min)'
        }));

        const therapistOptions = this.state.therapists.map(t => ({
            value: t.id,
            label: t.name
        }));

        const roomOptions = this.state.rooms.map(r => ({
            value: r.id,
            label: r.name
        }));

        const sourceOptions = [
            { value: 'walk_in', label: 'Walk-in' },
            { value: 'whatsapp', label: 'WhatsApp' },
            { value: 'phone', label: 'Telepon' },
            { value: 'online', label: 'Online' }
        ];

        // Render customer field
        document.getElementById('field-customer').innerHTML = form.select(
            'customer_id', 'Customer', customerOptions, booking ? booking.customer_id : ''
        );

        // Render service field (multi-select)
        let selectedServiceIds = booking && booking.service_ids ? booking.service_ids : (booking ? [booking.service_id] : []);
        if (typeof selectedServiceIds === 'string') selectedServiceIds = selectedServiceIds.split(',').map(Number);
        this.state.selectedServices = selectedServiceIds.map(id => String(id));
        document.getElementById('field-service').innerHTML = form.select(
            'service_ids', 'Layanan', serviceOptions, selectedServiceIds, { multiple: true }
        );

        // Render therapist field
        document.getElementById('field-therapist').innerHTML = form.select(
            'therapist_id', 'Terapis', therapistOptions, booking ? booking.therapist_id : ''
        );

        // Render room field
        document.getElementById('field-room').innerHTML = form.select(
            'room_id', 'Ruangan', roomOptions, booking ? booking.room_id : '', { required: false }
        );

        // Render date field
        document.getElementById('field-date').innerHTML = form.input(
            'booking_date', 'Tanggal Booking', 'date', {
                value: booking ? booking.booking_date : '',
                required: true
            }
        );

        // Render start time
        const now = new Date();
        const defaultTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        document.getElementById('field-start-time').innerHTML = form.input(
            'start_time', 'Jam Mulai', 'time', {
                value: booking ? (booking.start_time ? booking.start_time.substring(0, 5) : '') : defaultTime,
                required: true
            }
        );

        // Render source field
        document.getElementById('field-source').innerHTML = form.select(
            'source', 'Sumber', sourceOptions, booking ? booking.source : 'walk_in'
        );

        // Render notes field
        document.getElementById('field-notes').innerHTML = form.textarea(
            'notes', 'Catatan', {
                value: booking ? (booking.notes || '') : '',
                rows: 3,
                required: false
            }
        );
    },

    initSelects() {
        form.initTomSelect('#customer_id');
        form.initTomSelect('#service_ids', {
            maxItems: null,
            plugins: ['remove_button'],
        });
        form.initTomSelect('#therapist_id');
        form.initTomSelect('#room_id');
        form.initTomSelect('#source');
    },

    bindFormEvents() {
        const formEl = document.getElementById('booking-form');
        const self = this;

        // Form submit
        let submitting = false;

        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitting) return;
            submitting = true;

            const submitBtn = document.getElementById('btn-submit');

            try {
                const data = form.serialize(formEl);

                // Ensure service_ids is an array
                if (!data.service_ids || (Array.isArray(data.service_ids) && data.service_ids.length === 0)) {
                    toast.error('Pilih minimal 1 layanan');
                    return;
                }

                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Menyimpan...
                `;
                if (!Array.isArray(data.service_ids)) {
                    data.service_ids = [data.service_ids];
                }

                if (self.state.isEdit) {
                    await api.put('/bookings/' + self.state.bookingId, data);
                    toast.success('Booking berhasil diperbarui');
                } else {
                    const res = await api.post('/bookings', data);
                    toast.success('Booking berhasil dibuat');
                    // Navigate to detail page with the new booking id
                    if (res.data && res.data.id) {
                        window.location.hash = '#/bookings/' + res.data.id;
                        return;
                    }
                    window.location.hash = '#/bookings';
                    return;
                }

                window.location.hash = '#/bookings/' + self.state.bookingId;
            } catch (err) {
                toast.error(err.message || 'Gagal menyimpan booking');
            } finally {
                submitting = false;
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Simpan
                `;
            }
        });
    }
};
