pages['therapist-portal/performance'] = {
    render(params) {
        header.setTitle('Performa Saya');
        const container = document.getElementById('page-content');

        container.innerHTML = skeleton.dashboard(4);

        this.loadPerformance();
    },

    async loadPerformance() {
        const container = document.getElementById('page-content');
        const fmt = (num) => new Intl.NumberFormat('id-ID').format(num);
        const fmtCurrency = (num) => 'Rp ' + new Intl.NumberFormat('id-ID').format(num);

        try {
            const res = await api.get('/therapist/my-performance');
            const p = res.data;

            container.innerHTML = `
                <!-- Metric Cards -->
                <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div class="bg-white rounded-2xl shadow-sm border-l-4 border-l-blue-500 p-4">
                        <div class="flex items-center gap-3">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xl font-bold text-gray-800">${fmt(p.services_handled || 0)}</p>
                                <p class="text-xs text-gray-500">Layanan Bulan Ini</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border-l-4 border-l-purple-500 p-4">
                        <div class="flex items-center gap-3">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xl font-bold text-gray-800">${fmt(p.hours_worked || 0)} <span class="text-sm font-normal text-gray-500">jam</span></p>
                                <p class="text-xs text-gray-500">Total Jam</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border-l-4 border-l-primary-500 p-4">
                        <div class="flex items-center gap-3">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xl font-bold text-gray-800">${fmtCurrency(p.revenue_generated || 0)}</p>
                                <p class="text-xs text-gray-500">Pendapatan</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border-l-4 border-l-yellow-500 p-4">
                        <div class="flex items-center gap-3">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xl font-bold text-gray-800">${(p.avg_rating || 0).toFixed(1)}</p>
                                <p class="text-xs text-gray-500">Rating Rata-rata</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-2xl shadow-sm border-l-4 border-l-teal-500 p-4">
                        <div class="flex items-center gap-3">
                            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <div class="min-w-0">
                                <p class="text-xl font-bold text-gray-800">${(p.completion_rate || 0)}%</p>
                                <p class="text-xs text-gray-500">Tingkat Penyelesaian</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Weekly Performance Chart -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <h3 class="text-base font-semibold text-gray-800 mb-4">Performa Mingguan (4 Minggu Terakhir)</h3>
                    <div style="height: 280px;">
                        <canvas id="weekly-performance-chart"></canvas>
                    </div>
                </div>
            `;

            // Render weekly bar chart
            const weekly = p.weekly_data || [];
            if (weekly.length > 0) {
                const labels = weekly.map(w => w.label || w.week);
                const servicesData = weekly.map(w => w.total_services || 0);
                const hoursData = weekly.map(w => w.total_hours || 0);

                chart.bar('weekly-performance-chart', labels, [
                    {
                        label: 'Layanan',
                        data: servicesData,
                        backgroundColor: '#3b82f6',
                        borderRadius: 6,
                    },
                    {
                        label: 'Jam Kerja',
                        data: hoursData,
                        backgroundColor: '#A4AA26',
                        borderRadius: 6,
                    }
                ], {
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                });
            }

        } catch (err) {
            container.innerHTML = `
                <div class="text-center py-20">
                    <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="text-gray-600">Gagal memuat data performa.</p>
                    <p class="text-gray-400 text-sm mt-1">${err.message || ''}</p>
                    <button onclick="pages['therapist-portal/performance'].render()" class="mt-3 text-sm text-primary-600 hover:underline">Coba lagi</button>
                </div>
            `;
        }
    }
};
