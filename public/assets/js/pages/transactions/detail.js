pages['transactions/detail'] = {
    state: {
        transactionId: null,
        transaction: null,
    },

    async render(params) {
        this.state.transactionId = params.id;
        this.loadTransaction();
    },

    async loadTransaction() {
        const container = document.getElementById('page-content');
        container.innerHTML = skeleton.detail(6);

        try {
            const res = await api.get('/transactions/' + this.state.transactionId);
            this.state.transaction = res.data;
            this.renderDetail();
        } catch (err) {
            container.innerHTML = `
                <div class="text-center py-16 text-red-400">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p class="font-medium">Gagal memuat data</p>
                    <p class="text-sm mt-1">${err.message || 'Terjadi kesalahan'}</p>
                    <a href="#/transactions" class="inline-block mt-3 text-sm text-primary-600 hover:underline">Kembali ke daftar</a>
                </div>
            `;
        }
    },

    renderDetail() {
        const tx = this.state.transaction;

        header.setTitle('Detail Transaksi ' + (tx.transaction_code || ''));

        const formatCurrency = (num) => {
            if (!num && num !== 0) return 'Rp 0';
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
        };

        const formatDate = (dateStr) => {
            if (!dateStr) return '-';
            return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : '-';

        const statusColors = {
            unpaid: 'bg-yellow-100 text-yellow-700',
            paid: 'bg-green-100 text-green-700',
            refunded: 'bg-gray-100 text-gray-600',
        };

        const statusLabels = {
            unpaid: 'Belum Bayar',
            paid: 'Lunas',
            refunded: 'Refund',
        };

        const methodLabels = {
            cash: 'Cash',
            transfer: 'Transfer',
            qris: 'QRIS',
            debit: 'Debit',
            credit: 'Kredit',
        };

        const status = tx.payment_status || tx.status || '-';
        const statusColor = statusColors[status] || 'bg-gray-100 text-gray-500';
        const statusLabel = statusLabels[status] || status;

        const container = document.getElementById('page-content');
        container.innerHTML = `
            <div class="space-y-4">
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <a href="#/transactions" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                        </a>
                        <div>
                            <h1 class="text-xl font-bold text-gray-800">Detail Transaksi</h1>
                            <p class="text-sm text-primary-600 font-mono font-semibold">${tx.transaction_code || '-'}</p>
                        </div>
                    </div>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}">${statusLabel}</span>
                </div>

                <!-- Transaction Info Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-sm font-semibold text-gray-700 mb-4">Informasi Transaksi</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</p>
                            <p class="text-sm font-semibold text-gray-800">${tx.customer_name || '-'}</p>
                            <p class="text-sm text-gray-500">${tx.customer_phone || '-'}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Layanan</p>
                            <p class="text-sm font-semibold text-gray-800">${tx.service_name || '-'}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Terapis</p>
                            <p class="text-sm font-semibold text-gray-800">${tx.therapist_name || '-'}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Staff</p>
                            <p class="text-sm font-semibold text-gray-800">${tx.staff_name || '-'}</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Details Card -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 class="text-sm font-semibold text-gray-700 mb-4">Detail Pembayaran</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Left: Amount breakdown -->
                        <div class="space-y-3">
                            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="text-sm text-gray-500">Subtotal</span>
                                <span class="text-sm font-medium text-gray-800">${formatCurrency(tx.subtotal || 0)}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="text-sm text-gray-500">Diskon</span>
                                <span class="text-sm font-medium text-red-500">- ${formatCurrency(tx.discount || 0)}</span>
                            </div>
                            ${tx.tax_amount && Number(tx.tax_amount) > 0 ? `<div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="text-sm text-gray-500">Pajak</span>
                                <span class="text-sm font-medium text-gray-800">${formatCurrency(tx.tax_amount)}</span>
                            </div>` : ''}
                            <div class="flex justify-between items-center py-2 border-b border-gray-200">
                                <span class="text-base font-semibold text-gray-700">Total</span>
                                <span class="text-base font-bold text-gray-800">${formatCurrency(tx.total_amount || tx.total || 0)}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-gray-100">
                                <span class="text-sm text-gray-500">Komisi Terapis (${tx.commission_rate || 0}%)</span>
                                <span class="text-sm font-medium text-orange-600">${formatCurrency(tx.commission_amount || tx.commission || 0)}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 bg-green-50 -mx-3 px-3 rounded-xl">
                                <span class="text-sm font-semibold text-green-700">Pendapatan Bersih</span>
                                <span class="text-sm font-bold text-green-700">${formatCurrency(tx.net_revenue || 0)}</span>
                            </div>
                        </div>

                        <!-- Right: Payment info -->
                        <div class="space-y-4">
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Metode Pembayaran</p>
                                <p class="text-sm font-semibold text-gray-800">${methodLabels[tx.payment_method] || tx.payment_method || '-'}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Status Pembayaran</p>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}">${statusLabel}</span>
                            </div>
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Tanggal Transaksi</p>
                                <p class="text-sm text-gray-800">${formatDate(tx.transaction_date || tx.created_at)}</p>
                            </div>
                            ${tx.paid_at ? `
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Waktu Bayar</p>
                                <p class="text-sm text-gray-800">${formatDate(tx.paid_at)} ${formatTime(tx.paid_at)}</p>
                            </div>` : ''}
                            ${tx.notes ? `
                            <div class="space-y-1">
                                <p class="text-xs font-medium text-gray-400 uppercase tracking-wider">Catatan</p>
                                <p class="text-sm text-gray-600">${tx.notes}</p>
                            </div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
};
