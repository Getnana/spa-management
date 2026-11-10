pages['users/form'] = {
    state: {
        user: null,
        isEdit: false,
    },

    async render(params) {
        const id = params.id;
        this.state.isEdit = !!id;

        if (this.state.isEdit) {
            header.setTitle('Edit User');
            try {
                const res = await api.get(`/users/${id}`);
                this.state.user = res.data;
            } catch (err) {
                toast.error(err.message || 'Gagal memuat data user');
                return;
            }
        } else {
            header.setTitle('User Baru');
            this.state.user = null;
        }

        const u = this.state.user || {};
        const title = this.state.isEdit ? 'Edit User' : 'User Baru';

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
                <p class="text-sm text-gray-500 mt-1">${this.state.isEdit ? 'Perbarui informasi user' : 'Tambahkan user baru'}</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form id="user-form">
                    ${form.input('username', 'Username', 'text', {
                        value: u.username || '',
                        placeholder: 'Masukkan username',
                    })}

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        ${form.input('email', 'Email', 'email', {
                            value: u.email || '',
                            placeholder: 'email@contoh.com',
                        })}

                        ${form.input('full_name', 'Nama Lengkap', 'text', {
                            value: u.full_name || u.name || '',
                            placeholder: 'Masukkan nama lengkap',
                        })}
                    </div>

                    ${form.input('password', 'Password', 'password', {
                        value: '',
                        placeholder: this.state.isEdit ? 'Kosongkan jika tidak ingin mengubah' : 'Masukkan password',
                        required: !this.state.isEdit,
                        extraClass: 'mt-4',
                    })}

                    ${form.select('role', 'Role', [
                        { value: 'owner', label: 'Owner' },
                        { value: 'staff', label: 'Staff' },
                        { value: 'therapist', label: 'Terapis' },
                    ], u.role || '', { extraClass: 'mt-4' })}

                    <div class="mt-4">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_active" value="1" ${u.is_active !== false && u.is_active !== 0 ? 'checked' : ''}
                                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                            <span class="text-sm font-medium text-gray-700">Aktif</span>
                        </label>
                    </div>

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

        const formEl = document.getElementById('user-form');
        form.initTomSelect('#role');
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formEl.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            try {
                const data = form.serialize(formEl);
                data.is_active = formEl.querySelector('[name="is_active"]').checked ? 1 : 0;

                if (this.state.isEdit) {
                    // Remove password if empty on edit
                    if (!data.password) {
                        delete data.password;
                    }
                    await api.put(`/users/${id}`, data);
                    toast.success('User berhasil diperbarui');
                } else {
                    const res = await api.post('/users', data);
                    toast.success('User berhasil ditambahkan');
                    if (res.data?.id) {
                        window.location.hash = `#/users/${res.data.id}/edit`;
                        return;
                    }
                }
                window.location.hash = '#/users';
            } catch (err) {
                toast.error(err.message || 'Gagal menyimpan data user');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = this.state.isEdit ? 'Perbarui' : 'Simpan';
            }
        });
    },
};
