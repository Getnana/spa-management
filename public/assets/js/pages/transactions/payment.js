pages['transactions/payment'] = {
    state: {
        customers: [],
        services: [],
        therapists: [],
        bookingId: null,
        booking: null,
        subtotal: 0,
        taxEnabled: false,
        taxRate: 0,
        taxLabel: 'Pajak',
    },

    async loadTaxSettings() {
        try {
            const json = await api.get('/settings');
            if (json.status && json.data && json.data.tax) {
                this.state.taxEnabled = json.data.tax.enabled;
                this.state.taxRate = json.data.tax.rate;
                this.state.taxLabel = json.data.tax.label || 'Pajak';
            }
        } catch (e) {}
    },

    async render(params) {
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
        this.state.bookingId = urlParams.get('booking_id');
        this.state.booking = null;
        this.state.subtotal = 0;

        const isFromBooking = !!this.state.bookingId;
        header.setTitle(isFromBooking ? 'Pembayaran Booking' : 'Pembayaran Manual');

        const container = document.getElementById('page-content');
        const backUrl = isFromBooking ? '#/bookings/' + this.state.bookingId : '#/transactions';

        container.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <a href="${backUrl}" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    </a>
                    <h1 class="text-xl font-bold text-gray-800">${isFromBooking ? 'Pembayaran Booking' : 'Pembayaran Manual'}</h1>
                </div>

                <div id="payment-page-content">
                    ${skeleton.detail(6)}
                </div>
            </div>
        `;

        if (isFromBooking) {
            this.initFromBooking();
        } else {
            this.initManual();
        }
    },

    async initFromBooking() {
        await this.loadTaxSettings();
        const content = document.getElementById('payment-page-content');

        try {
            const bookingRes = await api.get('/bookings/' + this.state.bookingId);
            this.state.booking = bookingRes.data;
            this.state.subtotal = this.state.booking.total_price || this.state.booking.service_price || 0;

            if (!['awaiting_payment'].includes(this.state.booking.status)) {
                content.innerHTML = `
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <svg class="w-12 h-12 mx-auto mb-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        <p class="font-medium text-gray-700">Booking tidak bisa dibayar</p>
                        <p class="text-sm text-gray-500 mt-1">Status booking saat ini: ${this.state.booking.status}</p>
                        <a href="#/bookings/${this.state.bookingId}" class="inline-block mt-3 text-sm text-primary-600 hover:underline">Kembali ke detail booking</a>
                    </div>
                `;
                return;
            }

            this.renderBookingForm();
        } catch (err) {
            content.innerHTML = `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                    <svg class="w-12 h-12 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium text-gray-700">Gagal memuat data booking</p>
                    <p class="text-sm text-gray-500 mt-1">${err.message || 'Terjadi kesalahan'}</p>
                </div>
            `;
        }
    },

    renderBookingForm() {
        const booking = this.state.booking;
        const subtotal = this.state.subtotal;
        const fmtRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

        const content = document.getElementById('payment-page-content');
        content.innerHTML = `
            <form id="payment-form" class="space-y-4">
                <input type="hidden" id="pf-booking-id" value="${booking.id}">

                <!-- Info Booking -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3">Informasi Booking</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                            <span class="text-gray-400">Kode Booking</span>
                            <p class="font-semibold text-primary-600 font-mono">${booking.booking_code}</p>
                        </div>
                        <div>
                            <span class="text-gray-400">Customer</span>
                            <p class="font-semibold text-gray-800">${booking.customer_name || '-'}</p>
                        </div>
                        <div>
                            <span class="text-gray-400">Layanan</span>
                            <p class="font-semibold text-gray-800">${booking.service_names || booking.service_name || '-'}</p>
                        </div>
                        <div>
                            <span class="text-gray-400">Terapis</span>
                            <p class="font-semibold text-gray-800">${booking.therapist_name || '-'}</p>
                        </div>
                    </div>
                </div>

                <!-- Perhitungan -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3">Perhitungan</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-500">Subtotal</span>
                            <span class="font-semibold text-gray-800">${fmtRp(subtotal)}</span>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Diskon (Rp)</label>
                            <input type="number" id="pf-discount" value="0" min="0" max="${subtotal}"
                                class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        </div>

                        <div id="pf-tax-row" class="hidden flex justify-between items-center text-sm">
                            <span class="text-gray-500" id="pf-tax-label">Pajak</span>
                            <span class="font-semibold text-gray-800" id="pf-tax-amount">Rp 0</span>
                        </div>

                        <div class="border-t border-gray-100 pt-3">
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-semibold text-gray-700">Total Bayar</span>
                                <span class="text-xl font-bold text-primary-600" id="pf-total">${fmtRp(subtotal)}</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Bayar (Rp) <span class="text-red-500">*</span></label>
                            <input type="number" id="pf-paid" value="0" min="0"
                                class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
                        </div>

                        <div class="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                            <span class="text-sm font-semibold text-gray-700">Kembalian</span>
                            <span class="text-lg font-bold text-green-600" id="pf-change">${fmtRp(0)}</span>
                        </div>
                    </div>
                </div>

                <!-- Metode Pembayaran -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 class="text-sm font-semibold text-gray-700 mb-3">Pembayaran</h3>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran <span class="text-red-500">*</span></label>
                        <select id="pf-method" class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
                            <option value="cash">Cash</option>
                            <option value="transfer">Transfer</option>
                            <option value="qris">QRIS</option>
                            <option value="card">Kartu (Debit/Kredit)</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3">
                    <a href="#/bookings/${booking.id}" class="flex-1 text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Batal</a>
                    <button type="submit" id="btn-submit"
                        class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm inline-flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        Bayar
                    </button>
                </div>
            </form>
        `;

        this.bindCalcEvents();
        this.bindFormSubmit();
    },

    bindCalcEvents() {
        const self = this;
        const fmtRp = (n) => 'Rp ' + Number(Math.max(0, n)).toLocaleString('id-ID');

        const recalc = () => {
            const discount = parseFloat(document.getElementById('pf-discount').value) || 0;
            const afterDiscount = Math.max(0, self.state.subtotal - discount);
            const taxAmount = self.state.taxEnabled ? Math.round(afterDiscount * self.state.taxRate / 100) : 0;
            const total = afterDiscount + taxAmount;
            const paid = parseFloat(document.getElementById('pf-paid').value) || 0;
            const change = paid - total;

            const taxRow = document.getElementById('pf-tax-row');
            if (self.state.taxEnabled && taxAmount > 0) {
                taxRow.classList.remove('hidden');
                document.getElementById('pf-tax-label').textContent = self.state.taxLabel + ' (' + self.state.taxRate + '%)';
                document.getElementById('pf-tax-amount').textContent = fmtRp(taxAmount);
            } else {
                taxRow.classList.add('hidden');
            }

            document.getElementById('pf-total').textContent = fmtRp(total);

            const changeEl = document.getElementById('pf-change');
            if (change >= 0) {
                changeEl.textContent = fmtRp(change);
                changeEl.className = 'text-lg font-bold text-green-600';
            } else {
                changeEl.textContent = '- ' + fmtRp(Math.abs(change));
                changeEl.className = 'text-lg font-bold text-red-600';
            }
        };

        document.getElementById('pf-discount').addEventListener('input', recalc);
        document.getElementById('pf-paid').addEventListener('input', recalc);
    },

    bindFormSubmit() {
        const self = this;

        document.getElementById('payment-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const discount = parseFloat(document.getElementById('pf-discount').value) || 0;
            const afterDiscount = Math.max(0, self.state.subtotal - discount);
            const taxAmount = self.state.taxEnabled ? Math.round(afterDiscount * self.state.taxRate / 100) : 0;
            const total = afterDiscount + taxAmount;
            const paid = parseFloat(document.getElementById('pf-paid').value) || 0;

            if (paid < total) {
                toast.error('Jumlah bayar kurang dari total');
                return;
            }

            const submitBtn = document.getElementById('btn-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Memproses...
            `;

            try {
                await api.post('/transactions/from-booking', {
                    booking_id: parseInt(document.getElementById('pf-booking-id').value),
                    payment_method: document.getElementById('pf-method').value,
                    discount: discount,
                });
                toast.success('Pembayaran berhasil!');
                sidebar.render();
                window.location.hash = '#/transactions';
            } catch (err) {
                toast.error(err.message || 'Gagal memproses pembayaran');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Bayar
                `;
            }
        });
    },

    async initManual() {
        const content = document.getElementById('payment-page-content');

        content.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form id="payment-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div id="field-customer">${skeleton.formField()}</div>
                        <div id="field-service">${skeleton.formField()}</div>
                        <div id="field-therapist">${skeleton.formField()}</div>
                        <div id="field-payment-method">${skeleton.formField()}</div>
                        <div id="field-subtotal">${skeleton.formField()}</div>
                        <div id="field-discount">${skeleton.formField()}</div>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-semibold text-gray-700">Total</span>
                            <span class="text-xl font-bold text-primary-600" id="total-display">Rp 0</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Bayar (Rp) <span class="text-red-500">*</span></label>
                        <input type="number" id="paid-amount" value="0" min="0"
                            class="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500" required>
                    </div>

                    <div class="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                        <span class="text-sm font-semibold text-gray-700">Kembalian</span>
                        <span class="text-lg font-bold text-green-600" id="change-display">Rp 0</span>
                    </div>

                    <div id="field-notes">${skeleton.formField()}</div>

                    <div class="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <a href="#/transactions" class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Batal</a>
                        <button type="submit" id="btn-submit"
                            class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-xl transition text-sm inline-flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        `;

        try {
            const [customersRes, servicesRes, therapistsRes] = await Promise.all([
                api.get('/customers'),
                api.get('/services/list'),
                api.get('/therapists/list'),
            ]);

            this.state.customers = customersRes.data || [];
            this.state.services = servicesRes.data || [];
            this.state.therapists = (therapistsRes.data || []).filter(t => t.status === 'active');

            this.renderManualFields();
            this.initManualSelects();
            this.bindManualEvents();
        } catch (err) {
            toast.error(err.message || 'Gagal memuat data');
        }
    },

    renderManualFields() {
        const customerOptions = this.state.customers.map(c => ({
            value: c.id,
            label: c.name + (c.phone ? ' (' + c.phone + ')' : ''),
        }));

        const serviceOptions = this.state.services.map(s => ({
            value: s.id,
            label: s.name + (s.price ? ' - Rp ' + new Intl.NumberFormat('id-ID').format(s.price) : ''),
        }));

        const therapistOptions = this.state.therapists.map(t => ({
            value: t.id,
            label: t.name,
        }));

        const methodOptions = [
            { value: 'cash', label: 'Cash' },
            { value: 'transfer', label: 'Transfer' },
            { value: 'qris', label: 'QRIS' },
            { value: 'card', label: 'Kartu (Debit/Kredit)' },
            { value: 'other', label: 'Lainnya' },
        ];

        document.getElementById('field-customer').innerHTML = form.select('customer_id', 'Customer', customerOptions, '');
        document.getElementById('field-service').innerHTML = form.select('service_id', 'Layanan', serviceOptions, '');
        document.getElementById('field-therapist').innerHTML = form.select('therapist_id', 'Terapis', therapistOptions, '');
        document.getElementById('field-payment-method').innerHTML = form.select('payment_method', 'Metode Pembayaran', methodOptions, 'cash');
        document.getElementById('field-subtotal').innerHTML = form.input('subtotal', 'Subtotal (Rp)', 'number', { value: '', placeholder: '0', required: true });
        document.getElementById('field-discount').innerHTML = form.input('discount', 'Diskon (Rp)', 'number', { value: '0', placeholder: '0' });
        document.getElementById('field-notes').innerHTML = form.textarea('notes', 'Catatan', { value: '', rows: 3 });
    },

    initManualSelects() {
        form.initTomSelect('#customer_id');
        form.initTomSelect('#service_id');
        form.initTomSelect('#therapist_id');
        form.initTomSelect('#payment_method');
    },

    bindManualEvents() {
        const self = this;
        const formEl = document.getElementById('payment-form');
        const fmtRp = (n) => 'Rp ' + Number(Math.max(0, n)).toLocaleString('id-ID');

        const recalc = () => {
            const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
            const discount = parseFloat(document.getElementById('discount').value) || 0;
            const total = Math.max(0, subtotal - discount);
            const paid = parseFloat(document.getElementById('paid-amount').value) || 0;
            const change = paid - total;

            document.getElementById('total-display').textContent = fmtRp(total);

            const changeEl = document.getElementById('change-display');
            if (change >= 0) {
                changeEl.textContent = fmtRp(change);
                changeEl.className = 'text-lg font-bold text-green-600';
            } else {
                changeEl.textContent = '- ' + fmtRp(Math.abs(change));
                changeEl.className = 'text-lg font-bold text-red-600';
            }
        };

        document.getElementById('service_id').addEventListener('change', function () {
            const serviceId = parseInt(this.value);
            const service = self.state.services.find(s => s.id === serviceId);
            if (service && service.price) {
                document.getElementById('subtotal').value = service.price;
                recalc();
            }
        });

        document.getElementById('subtotal').addEventListener('input', recalc);
        document.getElementById('discount').addEventListener('input', recalc);
        document.getElementById('paid-amount').addEventListener('input', recalc);

        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();

            const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
            const discount = parseFloat(document.getElementById('discount').value) || 0;
            const total = Math.max(0, subtotal - discount);
            const paid = parseFloat(document.getElementById('paid-amount').value) || 0;

            if (paid < total) {
                toast.error('Jumlah bayar kurang dari total');
                return;
            }

            const submitBtn = document.getElementById('btn-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Menyimpan...
            `;

            try {
                const data = form.serialize(formEl);
                data.subtotal = subtotal;
                data.discount = discount;
                data.total_amount = total;
                await api.post('/transactions/manual', data);
                toast.success('Pembayaran berhasil dicatat');
                window.location.hash = '#/transactions';
            } catch (err) {
                toast.error(err.message || 'Gagal menyimpan pembayaran');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Simpan
                `;
            }
        });
    },
};
