pages['dashboard/owner'] = {
    render() {
        const container = document.getElementById('page-content');
        header.setTitle('Dashboard');

        const fmt = (num) => 'Rp ' + new Intl.NumberFormat('id-ID').format(num);

        container.innerHTML = skeleton.dashboard();

        // Fetch all data in parallel
        Promise.all([
            api.get('/dashboard/summary'),
            api.get('/dashboard/revenue-chart/daily'),
            api.get('/dashboard/booking-stats'),
            api.get('/dashboard/popular-services'),
        ]).then(([summaryRes, revenueRes, bookingRes, servicesRes]) => {
            const s = summaryRes.data;
            const revenue = revenueRes.data;
            const bookingStats = bookingRes.data;
            const popular = servicesRes.data;

            container.innerHTML = `
                <!-- KPI Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                    ${kpiCard('Total Pendapatan', fmt(s.total_revenue), 'bg-primary-100 text-primary-700',
                        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
                        'border-l-4 border-primary-500')}

                    ${kpiCard('Transaksi Hari Ini', s.total_transactions, 'bg-blue-100 text-blue-600',
                        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
                        'border-l-4 border-blue-500')}

                    ${kpiCard('Booking Aktif', s.active_bookings, 'bg-purple-100 text-purple-600',
                        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
                        'border-l-4 border-purple-500')}

                    ${kpiCard('Booking Pending', s.pending_bookings, 'bg-yellow-100 text-yellow-600',
                        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
                        'border-l-4 border-yellow-500')}

                    ${kpiCard('Total Customer', s.total_customers, 'bg-teal-100 text-teal-600',
                        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>',
                        'border-l-4 border-teal-500')}

                    ${kpiCard('Terapis Aktif', s.active_therapists, 'bg-primary-100 text-primary-700',
                        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
                        'border-l-4 border-primary-500')}
                </div>

                <!-- Revenue Chart -->
                <div class="bg-white rounded-2xl shadow-sm p-4 md:p-5 mb-4 md:mb-6">
                    <h3 class="text-base font-semibold text-gray-800 mb-4">Pendapatan 7 Hari Terakhir</h3>
                    <div style="height: 200px;">
                        <canvas id="revenue-chart"></canvas>
                    </div>
                </div>

                <!-- Bottom Row: Booking Status & Popular Services -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <!-- Booking by Status -->
                    <div class="bg-white rounded-2xl shadow-sm p-5">
                        <h3 class="text-base font-semibold text-gray-800 mb-4">Booking Berdasarkan Status</h3>
                        <div style="height: 220px;">
                            <canvas id="booking-status-chart"></canvas>
                        </div>
                    </div>

                    <!-- Popular Services -->
                    <div class="bg-white rounded-2xl shadow-sm p-5">
                        <h3 class="text-base font-semibold text-gray-800 mb-4">Layanan Populer</h3>
                        <div style="height: 220px;">
                            <canvas id="popular-services-chart"></canvas>
                        </div>
                    </div>
                </div>
            `;

            // Revenue line chart
            const revLabels = revenue.map(r => r.label);
            const revGross = revenue.map(r => r.gross_revenue);
            const revNet = revenue.map(r => r.net_revenue);

            chart.line('revenue-chart', revLabels, [
                {
                    label: 'Gross',
                    data: revGross,
                    borderColor: '#A4AA26',
                    backgroundColor: 'rgba(164, 170, 38, 0.1)',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'Net',
                    data: revNet,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.3,
                }
            ], {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (val) => 'Rp ' + new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(val),
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + fmt(ctx.parsed.y),
                        }
                    }
                }
            });

            // Booking status doughnut chart
            const statusLabels = {
                pending: 'Pending',
                confirmed: 'Confirmed',
                in_progress: 'In Progress',
                awaiting_payment: 'Menunggu Bayar',
                completed: 'Completed',
                cancelled: 'Cancelled',
                no_show: 'No Show',
            };
            const statusColors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#f97316', '#A4AA26', '#ef4444', '#6b7280'];
            const statusData = bookingStats.by_status;
            const statusKeys = Object.keys(statusData).filter(k => statusData[k] > 0);

            chart.pie('booking-status-chart',
                statusKeys.map(k => statusLabels[k] || k),
                statusKeys.map(k => statusData[k]),
                statusKeys.map((_, i) => statusColors[i % statusColors.length])
            );

            // Popular services horizontal bar chart
            const svcLabels = popular.map(p => p.name);
            const svcCounts = popular.map(p => p.booking_count);

            chart.bar('popular-services-chart', svcLabels, [
                {
                    label: 'Booking',
                    data: svcCounts,
                    backgroundColor: '#A4AA26',
                    borderRadius: 6,
                }
            ], {
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, ticks: { stepSize: 1 } },
                    y: { beginAtZero: false },
                }
            });

        }).catch((err) => {
            container.innerHTML = `
                <div class="text-center py-20">
                    <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p class="text-gray-600">Gagal memuat data dashboard.</p>
                    <p class="text-gray-400 text-sm mt-1">${err.message || ''}</p>
                </div>
            `;
        });
    }
};

// KPI card helper
function kpiCard(label, value, iconClasses, iconSvg, borderClass) {
    return `
        <div class="bg-white rounded-xl md:rounded-2xl shadow-sm p-3 md:p-4 ${borderClass}">
            <div class="flex items-center gap-2 md:gap-3">
                <div class="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full ${iconClasses} flex items-center justify-center">
                    ${iconSvg}
                </div>
                <div class="min-w-0">
                    <p class="text-base md:text-2xl font-bold text-gray-800 truncate kpi-card-value">${value}</p>
                    <p class="text-[11px] md:text-sm text-gray-500 truncate kpi-card-label">${label}</p>
                </div>
            </div>
        </div>
    `;
}
