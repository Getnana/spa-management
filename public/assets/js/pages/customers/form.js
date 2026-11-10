pages['customers/form'] = {
    state: {
        customer: null,
        isEdit: false,
    },

    async render(params) {
        const id = params.id;
        this.state.isEdit = !!id;

        if (this.state.isEdit) {
            header.setTitle('Edit Customer');
            try {
                const res = await api.get(`/customers/${id}`);
                this.state.customer = res.data;
            } catch (err) {
                toast.error(err.message || 'Gagal memuat data customer');
                return;
            }
        } else {
            header.setTitle('Customer Baru');
            this.state.customer = null;
        }

        const c = this.state.customer || {};
        const title = this.state.isEdit ? 'Edit Customer' : 'Customer Baru';

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
                <p class="text-sm text-gray-500 mt-1">${this.state.isEdit ? 'Perbarui informasi pelanggan' : 'Tambahkan pelanggan baru'}</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form id="customer-form">
                    ${form.input('name', 'Nama Lengkap', 'text', {
                        value: c.name || '',
                        placeholder: 'Masukkan nama pelanggan',
                    })}

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        ${form.input('phone', 'No. Telepon', 'tel', {
                            value: c.phone || '',
                            placeholder: '08xxxxxxxxxx',
                        })}

                        ${form.input('email', 'Email', 'email', {
                            value: c.email || '',
                            placeholder: 'email@contoh.com',
                            required: false,
                        })}
                    </div>

                    ${form.textarea('notes', 'Catatan', {
                        value: c.notes || '',
                        rows: 3,
                        required: false,
                        extraClass: 'mt-4',
                    })}

                    <div class="mt-4">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="is_member" value="1" ${c.is_member ? 'checked' : ''}
                                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                            <span class="text-sm font-medium text-gray-700">Member</span>
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

        const formEl = document.getElementById('customer-form');
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formEl.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            try {
                const data = form.serialize(formEl);
                data.is_member = formEl.querySelector('[name="is_member"]').checked ? 1 : 0;

                if (this.state.isEdit) {
                    await api.put(`/customers/${id}`, data);
                    toast.success('Customer berhasil diperbarui');
                } else {
                    const res = await api.post('/customers', data);
                    toast.success('Customer berhasil ditambahkan');
                    if (res.data?.id) {
                        window.location.hash = `#/customers/${res.data.id}`;
                        return;
                    }
                }
                window.location.hash = '#/customers';
            } catch (err) {
                toast.error(err.message || 'Gagal menyimpan data customer');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = this.state.isEdit ? 'Perbarui' : 'Simpan';
            }
        });
    },
};
