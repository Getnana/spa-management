pages['therapists/form'] = {
    state: {
        therapist: null,
        isEdit: false,
    },

    async render(params) {
        const id = params.id;
        this.state.isEdit = !!id;

        if (this.state.isEdit) {
            header.setTitle('Edit Terapis');
            try {
                const res = await api.get(`/therapists/${id}`);
                this.state.therapist = res.data;
            } catch (err) {
                toast.error(err.message || 'Gagal memuat data terapis');
                return;
            }
        } else {
            header.setTitle('Terapis Baru');
            this.state.therapist = null;
        }

        const t = this.state.therapist || {};
        const title = this.state.isEdit ? 'Edit Terapis' : 'Terapis Baru';
        const isOwner = auth.getRole() === 'owner';

        // Load default commission rate from settings (owner only)
        let defaultCommission = t.commission_rate || '';
        if (isOwner && !this.state.isEdit) {
            try {
                const settingsRes = await api.get('/settings');
                const settings = {};
                (settingsRes.data || []).forEach(item => { settings[item.key] = item.value; });
                defaultCommission = settings.default_commission_rate || '0';
            } catch (e) { defaultCommission = '0'; }
        }

        const content = document.getElementById('page-content');
        content.innerHTML = `
            <div class="mb-6">
                <button onclick="history.back()" class="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Kembali
                </button>
                <h1 class="text-2xl font-bold text-gray-800">${title}</h1>
                <p class="text-sm text-gray-500 mt-1">${this.state.isEdit ? 'Perbarui informasi terapis' : 'Tambahkan terapis baru'}</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form id="therapist-form">
                    ${form.input('name', 'Nama Lengkap', 'text', {
                        value: t.name || '',
                        placeholder: 'Masukkan nama terapis',
                    })}

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        ${form.input('phone', 'No. Telepon', 'tel', {
                            value: t.phone || '',
                            placeholder: '08xxxxxxxxxx',
                        })}

                        ${form.input('specialty', 'Spesialisasi', 'text', {
                            value: t.specialty || '',
                            placeholder: 'Contoh: pijat refleksi',
                            required: false,
                        })}
                    </div>

                    <div class="mt-4">
                        ${form.input('commission_rate', 'Komisi (%)', 'number', {
                            value: isOwner ? (t.commission_rate || '') : '',
                            placeholder: isOwner ? (defaultCommission ? `Default: ${defaultCommission}%` : 'Contoh: 30') : 'Default dari pengaturan',
                            required: false,
                            readonly: !isOwner,
                            step: '0.1',
                        })}
                        ${!isOwner ? '<p class="text-xs text-gray-400 mt-1">Menggunakan komisi default dari pengaturan. Hanya owner yang dapat mengubah.</p>' : ''}
                        ${isOwner && !this.state.isEdit ? '<p class="text-xs text-gray-400 mt-1">Opsional. Jika dikosongkan akan menggunakan komisi default dari pengaturan (' + defaultCommission + '%)</p>' : ''}
                    </div>

                    <div class="mt-4">
                        ${form.select('status', 'Status', [
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Nonaktif' },
                            { value: 'on_leave', label: 'Cuti' },
                        ], t.status || 'active')}
                    </div>

                    ${form.textarea('notes', 'Catatan', {
                        value: t.notes || '',
                        rows: 3,
                        required: false,
                        class: 'mt-4',
                    })}

                    <!-- Akun Login -->
                    ${!this.state.isEdit ? `
                    <div class="mt-6 pt-6 border-t border-gray-100 space-y-4">
                        <h3 class="text-sm font-semibold text-gray-700">Akun Login</h3>
                        ${form.input('username', 'Username', 'text', {
                            value: '',
                            placeholder: 'Username untuk login',
                        })}

                        ${form.input('email', 'Email', 'email', {
                            value: '',
                            placeholder: 'email@contoh.com',
                        })}

                        ${form.input('password', 'Password', 'password', {
                            value: '',
                            placeholder: 'Minimal 6 karakter',
                        })}
                    </div>
                    ` : ''}

                    <div class="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                        ${form.submitButton(this.state.isEdit ? 'Perbarui' : 'Simpan')}
                        <button type="button" onclick="history.back()"
                            class="px-6 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Form submit
        const formEl = document.getElementById('therapist-form');
        form.initTomSelect('#status');

        // Clear inline error on input
        formEl.addEventListener('input', (e) => {
            const input = e.target;
            if (input.classList.contains('border-red-500')) {
                input.classList.remove('border-red-500');
                const errorEl = input.closest('div')?.querySelector('.field-error');
                if (errorEl) errorEl.remove();
            }
        });

        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formEl.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            try {
                const data = form.serialize(formEl);

                // Include commission_rate as number, remove if empty (backend will use default)
                if (data.commission_rate !== undefined && data.commission_rate !== '') {
                    data.commission_rate = parseFloat(data.commission_rate);
                } else {
                    delete data.commission_rate;
                }

                if (this.state.isEdit) {
                    await api.put(`/therapists/${id}`, data);
                    toast.success('Terapis berhasil diperbarui');
                } else {
                    data.create_user = 1;
                    const res = await api.post('/therapists', data);
                    toast.success('Terapis berhasil ditambahkan');
                    if (res.data?.id) {
                        window.location.hash = `#/therapists/${res.data.id}`;
                        return;
                    }
                }
                window.location.hash = '#/therapists';
            } catch (err) {
                // Clear previous inline errors
                formEl.querySelectorAll('.field-error').forEach(el => el.remove());
                formEl.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));

                if (err.errors && typeof err.errors === 'object') {
                    // Show inline errors per field
                    const fieldLabels = {
                        name: 'Nama Lengkap', phone: 'No. Telepon', specialty: 'Spesialisasi',
                        commission_rate: 'Komisi', status: 'Status', notes: 'Catatan',
                        username: 'Username', email: 'Email', password: 'Password',
                    };
                    const errorMessages = [];
                    for (const [field, msg] of Object.entries(err.errors)) {
                        const input = formEl.querySelector(`[name="${field}"]`);
                        if (input) {
                            input.classList.add('border-red-500');
                            const errorEl = document.createElement('p');
                            errorEl.className = 'field-error text-xs text-red-500 mt-1';
                            errorEl.textContent = msg;
                            input.closest('div').appendChild(errorEl);
                        }
                        errorMessages.push(`${fieldLabels[field] || field}: ${msg}`);
                    }
                    toast.error(errorMessages[0] || err.message || 'Validasi gagal');
                } else {
                    toast.error(err.message || 'Gagal menyimpan data terapis');
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = this.state.isEdit ? 'Perbarui' : 'Simpan';
            }
        });
    },
};
