pages['services/form'] = {
    state: {
        service: null,
        categories: [],
        isEdit: false,
    },

    async render(params) {
        const id = params.id;
        this.state.isEdit = !!id;

        if (this.state.isEdit) {
            header.setTitle('Edit Layanan');
            try {
                const res = await api.get(`/services/${id}`);
                this.state.service = res.data;
            } catch (err) {
                toast.error(err.message || 'Gagal memuat data layanan');
                return;
            }
        } else {
            header.setTitle('Layanan Baru');
            this.state.service = null;
        }

        // Load categories for dropdown
        try {
            const res = await api.get('/categories');
            this.state.categories = res.data || [];
        } catch (err) {
            toast.error('Gagal memuat data kategori');
            this.state.categories = [];
        }

        const s = this.state.service || {};
        const title = this.state.isEdit ? 'Edit Layanan' : 'Layanan Baru';

        const categoryOptions = this.state.categories.map(cat => ({
            value: cat.id,
            label: cat.name,
        }));

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
                <p class="text-sm text-gray-500 mt-1">${this.state.isEdit ? 'Perbarui informasi layanan' : 'Tambahkan layanan baru'}</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form id="service-form">
                    ${form.input('name', 'Nama Layanan', 'text', {
                        value: s.name || '',
                        placeholder: 'Masukkan nama layanan',
                    })}

                    ${form.select('category_id', 'Kategori', categoryOptions, s.category_id || '', {
                        extraClass: 'mt-4',
                    })}

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        ${form.input('duration_minutes', 'Durasi (menit)', 'number', {
                            value: s.duration_minutes || '',
                            placeholder: '60',
                        })}

                        ${form.input('price', 'Harga (Rp)', 'number', {
                            value: s.price || '',
                            placeholder: '150000',
                        })}
                    </div>

                    ${form.textarea('description', 'Deskripsi', {
                        value: s.description || '',
                        rows: 3,
                        required: false,
                        class: 'mt-4',
                    })}

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" id="status"
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm">
                            <option value="active" ${s.status === 'active' || !this.state.isEdit ? 'selected' : ''}>Aktif</option>
                            <option value="inactive" ${s.status === 'inactive' ? 'selected' : ''}>Nonaktif</option>
                        </select>
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

        const formEl = document.getElementById('service-form');
        form.initTomSelect('#category_id');
        form.initTomSelect('#status');
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formEl.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            try {
                const data = form.serialize(formEl);
                data.duration_minutes = parseInt(data.duration_minutes) || 0;
                data.price = parseInt(data.price) || 0;

                if (this.state.isEdit) {
                    await api.put(`/services/${id}`, data);
                    toast.success('Layanan berhasil diperbarui');
                } else {
                    await api.post('/services', data);
                    toast.success('Layanan berhasil ditambahkan');
                }
                window.location.hash = '#/services';
            } catch (err) {
                toast.error(err.message || 'Gagal menyimpan data layanan');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = this.state.isEdit ? 'Perbarui' : 'Simpan';
            }
        });
    },
};
