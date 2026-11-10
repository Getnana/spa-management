pages['rooms/form'] = {
    state: {
        room: null,
        isEdit: false,
    },

    async render(params) {
        const id = params.id;
        this.state.isEdit = !!id;

        if (this.state.isEdit) {
            header.setTitle('Edit Ruangan');
            try {
                const res = await api.get(`/rooms/${id}`);
                this.state.room = res.data;
            } catch (err) {
                toast.error(err.message || 'Gagal memuat data ruangan');
                return;
            }
        } else {
            header.setTitle('Ruangan Baru');
            this.state.room = null;
        }

        const s = this.state.room || {};
        const title = this.state.isEdit ? 'Edit Ruangan' : 'Ruangan Baru';

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
                <p class="text-sm text-gray-500 mt-1">${this.state.isEdit ? 'Perbarui informasi ruangan' : 'Tambahkan ruangan baru'}</p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <form id="room-form">
                    ${form.input('name', 'Nama Ruangan', 'text', {
                        value: s.name || '',
                        placeholder: 'Contoh: Ruang 1, VIP, Facial',
                    })}

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" id="room-status"
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

        const formEl = document.getElementById('room-form');
        form.initTomSelect('#room-status');
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formEl.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            try {
                const data = form.serialize(formEl);

                if (this.state.isEdit) {
                    await api.put(`/rooms/${id}`, data);
                    toast.success('Ruangan berhasil diperbarui');
                } else {
                    await api.post('/rooms', data);
                    toast.success('Ruangan berhasil ditambahkan');
                }
                window.location.hash = '#/rooms';
            } catch (err) {
                toast.error(err.message || 'Gagal menyimpan data ruangan');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = this.state.isEdit ? 'Perbarui' : 'Simpan';
            }
        });
    },
};
