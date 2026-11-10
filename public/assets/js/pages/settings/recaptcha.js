pages['settings/recaptcha'] = {
    async render() {
        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="max-w-2xl mx-auto space-y-4">
                <!-- reCAPTCHA Section -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-gray-800">Google reCAPTCHA</h2>
                            <p class="text-sm text-gray-500">Konfigurasi proteksi login dari bot</p>
                        </div>
                    </div>
                    <div class="space-y-5">
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p class="font-medium text-gray-700">Aktifkan reCAPTCHA</p>
                                <p class="text-sm text-gray-500 mt-0.5">Tampilkan verifikasi captcha di halaman login</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="recaptcha-enabled" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Site Key</label>
                            <input type="text" id="recaptcha-site-key" placeholder="Masukkan Site Key dari Google reCAPTCHA"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm font-mono">
                            <p class="text-xs text-gray-400 mt-1">Dapatkan dari <span class="font-mono">https://www.google.com/recaptcha/admin</span> (reCAPTCHA v2)</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
                            <input type="password" id="recaptcha-secret-key" placeholder="Masukkan Secret Key dari Google reCAPTCHA"
                                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm font-mono">
                            <p class="text-xs text-gray-400 mt-1">Jangan bagikan secret key ini kepada siapapun</p>
                        </div>
                    </div>
                </div>

                <!-- Tax/Pajak Section -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-gray-800">Pengaturan Pajak</h2>
                            <p class="text-sm text-gray-500">Pajak ditambahkan ke total pembayaran (ditanggung customer)</p>
                        </div>
                    </div>
                    <div class="space-y-5">
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p class="font-medium text-gray-700">Aktifkan Pajak</p>
                                <p class="text-sm text-gray-500 mt-0.5">Tambahkan pajak otomatis saat pembayaran</p>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="tax-enabled" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Tarif Pajak (%)</label>
                                <input type="number" id="tax-rate" min="0" max="100" step="0.1" placeholder="0"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Label Pajak</label>
                                <input type="text" id="tax-label" placeholder="Pajak"
                                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Default Commission Section -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-lg font-semibold text-gray-800">Komisi Default Terapis</h2>
                            <p class="text-sm text-gray-500">Nilai komisi default untuk terapis baru yang dibuat staff</p>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Komisi Default (%)</label>
                        <input type="number" id="default-commission-rate" min="0" max="100" step="0.1" placeholder="0"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                        <p class="text-xs text-gray-400 mt-1">Staff tidak dapat mengubah komisi, nilai ini otomatis diterapkan saat staff menambahkan terapis baru</p>
                    </div>
                </div>

                <div id="settings-message" class="hidden text-sm p-3 rounded-xl"></div>

                <button id="save-settings-btn" type="button"
                    class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg hover:shadow-xl">
                    Simpan Semua Pengaturan
                </button>
            </div>
        `;

        await this.loadSettings();
        this.bindEvents();
    },

    async loadSettings() {
        try {
            const res = await api.get('/settings');
            if (res.status && res.data) {
                const s = {};
                res.data.forEach(item => { s[item.key] = item.value; });

                document.getElementById('recaptcha-enabled').checked = s.recaptcha_enabled === '1';
                document.getElementById('recaptcha-site-key').value = s.recaptcha_site_key || '';
                document.getElementById('recaptcha-secret-key').value = s.recaptcha_secret_key || '';

                document.getElementById('tax-enabled').checked = s.tax_enabled === '1';
                document.getElementById('tax-rate').value = s.tax_rate || '0';
                document.getElementById('tax-label').value = s.tax_label || 'Pajak';

                document.getElementById('default-commission-rate').value = s.default_commission_rate || '0';
            }
        } catch (err) {
            toast.error('Gagal memuat pengaturan');
        }
    },

    bindEvents() {
        document.getElementById('save-settings-btn').addEventListener('click', async () => {
            const btn = document.getElementById('save-settings-btn');
            const msgEl = document.getElementById('settings-message');

            btn.disabled = true;
            btn.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Menyimpan...
            `;
            msgEl.classList.add('hidden');

            const recaptchaEnabled = document.getElementById('recaptcha-enabled').checked;
            const siteKey = document.getElementById('recaptcha-site-key').value.trim();
            const secretKey = document.getElementById('recaptcha-secret-key').value.trim();

            if (recaptchaEnabled && (!siteKey || !secretKey)) {
                msgEl.className = 'text-sm p-3 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200';
                msgEl.textContent = 'Site Key dan Secret Key wajib diisi jika reCAPTCHA diaktifkan.';
                msgEl.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Simpan Semua Pengaturan';
                return;
            }

            const taxEnabled = document.getElementById('tax-enabled').checked;
            const taxRate = document.getElementById('tax-rate').value;
            const taxLabel = document.getElementById('tax-label').value.trim() || 'Pajak';

            if (taxEnabled && (!taxRate || parseFloat(taxRate) <= 0)) {
                msgEl.className = 'text-sm p-3 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200';
                msgEl.textContent = 'Tarif pajak wajib diisi jika pajak diaktifkan.';
                msgEl.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Simpan Semua Pengaturan';
                return;
            }

            try {
                const data = {
                    recaptcha_enabled: recaptchaEnabled ? '1' : '0',
                    recaptcha_site_key: siteKey,
                    tax_enabled: taxEnabled ? '1' : '0',
                    tax_rate: taxRate,
                    tax_label: taxLabel,
                    default_commission_rate: document.getElementById('default-commission-rate').value || '0',
                };
                if (secretKey) {
                    data.recaptcha_secret_key = secretKey;
                }

                await api.put('/settings', data);
                msgEl.className = 'text-sm p-3 rounded-xl bg-green-50 text-green-700 border border-green-200';
                msgEl.textContent = 'Pengaturan berhasil disimpan.';
                msgEl.classList.remove('hidden');
                toast.success('Pengaturan berhasil disimpan');
            } catch (err) {
                msgEl.className = 'text-sm p-3 rounded-xl bg-red-50 text-red-700 border border-red-200';
                msgEl.textContent = err.message || 'Gagal menyimpan pengaturan.';
                msgEl.classList.remove('hidden');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Simpan Semua Pengaturan';
            }
        });
    }
};
