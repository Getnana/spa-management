<!DOCTYPE html>
<html lang="id" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SPA Monitoring System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#fafbea', 100: '#f0f2cc', 200: '#e0e49a', 300: '#c9cf60',
                            400: '#b5bc3c', 500: '#A4AA26', 600: '#8c911d', 700: '#717517',
                            800: '#5a5d12', 900: '#44460e',
                        }
                    }
                }
            }
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.bootstrap5.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js"></script>
    <link rel="stylesheet" href="/assets/css/custom.css">
</head>
<body class="bg-gray-50 min-h-screen overscroll-none">

    <!-- Login Page -->
    <div id="login-page" class="hidden min-h-screen flex items-center justify-center bg-primary-500 p-4">
        <div class="w-full max-w-md">
            <div class="text-center mb-8">
                <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden p-1">
                    <img src="/assets/img/logo spa.png" alt="Logo" class="w-full h-full object-cover rounded-full">
                </div>
                <h1 class="text-3xl font-bold text-white">SPA Monitoring</h1>
                <p class="text-white/70 mt-2">Sistem Manajemen Spa</p>
            </div>
            <div class="bg-white rounded-2xl shadow-2xl p-8">
                <form id="login-form" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" name="username" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                            placeholder="Masukkan username">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                            placeholder="Masukkan password">
                    </div>
                    <div id="login-error" class="hidden text-red-600 text-sm bg-red-50 p-3 rounded-xl"></div>
                    <div id="recaptcha-container" class="flex justify-center"></div>
                    <button type="submit"
                        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg hover:shadow-xl">
                        Masuk
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Public Rating Page -->
    <div id="rating-page" class="hidden min-h-screen flex items-center justify-center bg-primary-500 p-4">
        <div id="rating-content" class="w-full max-w-md"></div>
    </div>

    <!-- Main App Shell -->
    <div id="app-shell" class="hidden min-h-screen flex">
        <!-- Sidebar (Desktop) -->
        <aside id="sidebar-desktop" class="hidden lg:flex lg:flex-col lg:w-64 bg-primary-500 text-white transition-all duration-300 overflow-hidden">
            <div class="p-6 border-b border-white/10 flex-shrink-0">
                <h1 id="sidebar-brand" class="text-xl font-bold whitespace-nowrap">SPA Monitoring</h1>
                <p class="text-white/60 text-sm mt-1 sidebar-label whitespace-nowrap" id="sidebar-role-badge"></p>
            </div>
            <nav id="sidebar-nav-desktop" class="flex-1 overflow-y-auto py-4 px-3 space-y-1"></nav>
            <div class="p-4 border-t border-white/10 flex-shrink-0">
                <button onclick="auth.logout()" class="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition">
                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    <span class="sidebar-label whitespace-nowrap">Keluar</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div class="flex items-center justify-between px-4 py-3 lg:px-6">
                    <div class="flex items-center gap-3">
                        <button id="sidebar-toggle-btn" class="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition" onclick="sidebar.toggleDesktop()">
                            <svg id="sidebar-toggle-icon" class="w-5 h-5 text-gray-600 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                        </button>
                        <h2 id="page-title" class="text-lg font-semibold text-gray-800">Dashboard</h2>
                    </div>
                    <div class="flex items-center gap-3">
                        <!-- Notifications -->
                        <div class="relative">
                            <button onclick="router.navigate('#/notifications')" class="relative p-2 rounded-lg hover:bg-gray-100 transition">
                                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                <span id="notification-badge" class="hidden absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">0</span>
                            </button>
                        </div>
                        <!-- User Menu -->
                        <div class="relative" id="user-menu-container">
                            <button onclick="document.getElementById('user-menu-dropdown').classList.toggle('hidden')" class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition">
                                <div class="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm" id="user-avatar">O</div>
                                <span class="hidden sm:block text-sm font-medium text-gray-700" id="user-display-name">Owner</span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            <div id="user-menu-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                                <div class="px-4 py-2 border-b border-gray-100">
                                    <p class="text-sm font-medium text-gray-800" id="dropdown-user-name"></p>
                                    <p class="text-xs text-gray-500" id="dropdown-user-role"></p>
                                </div>
                                <button onclick="auth.logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                    Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <main id="page-content" class="flex-1 p-4 lg:p-6 overflow-y-auto"></main>
        </div>
    </div>

    <!-- Mobile Bottom Nav -->
    <nav id="bottom-nav" class="hidden lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div id="bottom-nav-items" class="flex justify-around items-center py-1.5 px-1"></div>
    </nav>

    <!-- Mobile Sidebar Overlay -->
    <div id="sidebar-overlay" class="hidden fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity" onclick="document.getElementById('sidebar-mobile').classList.add('hidden'); this.classList.add('hidden'); document.body.classList.remove('no-scroll');"></div>
    <aside id="sidebar-mobile" class="hidden fixed top-0 left-0 bottom-0 w-72 bg-primary-500 text-white z-50 transform transition-transform">
        <div class="p-6 border-b border-white/10 flex items-center justify-between">
            <h1 class="text-xl font-bold">SPA Monitoring</h1>
            <button onclick="document.getElementById('sidebar-mobile').classList.add('hidden'); document.getElementById('sidebar-overlay').classList.add('hidden');" class="p-1 hover:bg-white/10 rounded">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        </div>
        <nav id="sidebar-nav-mobile" class="flex-1 overflow-y-auto py-4 px-3 space-y-1"></nav>
        <div class="p-4 border-t border-white/10">
            <button onclick="auth.logout()" class="w-full flex items-center gap-3 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span>Keluar</span>
            </button>
        </div>
    </aside>

    <!-- Modal Container -->
    <div id="modal-container" class="hidden fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
        <div class="fixed inset-0 bg-black/50" onclick="modal.close()"></div>
        <div class="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[95vh] md:max-h-[90vh] overflow-y-auto z-10">
            <div id="modal-header" class="sticky top-0 bg-white px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
                <h3 id="modal-title" class="text-base md:text-lg font-semibold text-gray-800"></h3>
                <button onclick="modal.close()" class="p-1.5 hover:bg-gray-100 rounded-lg transition">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
            <div id="modal-body" class="p-4 md:p-6"></div>
        </div>
    </div>

    <!-- Confirm Dialog -->
    <div id="confirm-dialog" class="hidden fixed inset-0 z-[60] flex items-end md:items-center justify-center p-3 md:p-4">
        <div class="fixed inset-0 bg-black/50"></div>
        <div class="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-sm p-5 md:p-6 z-10">
            <h3 id="confirm-title" class="text-base md:text-lg font-semibold text-gray-800 mb-2"></h3>
            <p id="confirm-message" class="text-sm md:text-base text-gray-600 mb-5 md:mb-6"></p>
            <div class="flex gap-3 justify-end">
                <button onclick="confirmDialog.cancel()" class="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium text-sm">Batal</button>
                <button id="confirm-ok-btn" class="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-medium text-sm">Hapus</button>
            </div>
        </div>
    </div>

    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-3 right-3 left-3 md:left-auto md:right-4 md:top-4 z-[70] space-y-2 md:w-80"></div>

    <!-- Scripts -->
    <script src="/assets/js/api.js?v=7"></script>
    <script src="/assets/js/auth.js?v=7"></script>
    <script src="/assets/js/components/modal.js?v=7"></script>
    <script src="/assets/js/components/toast.js?v=7"></script>
    <script src="/assets/js/components/table.js?v=7"></script>
    <script src="/assets/js/components/form.js?v=7"></script>
    <script src="/assets/js/components/chart.js?v=7"></script>
    <script src="/assets/js/components/skeleton.js?v=7"></script>
    <script src="/assets/js/components/confirm-dialog.js?v=7"></script>
    <script src="/assets/js/components/sidebar.js?v=9"></script>
    <script src="/assets/js/components/header.js?v=7"></script>
    <script src="/assets/js/router.js?v=7"></script>
    <script src="/assets/js/pages-registry.js?v=10"></script>
    <script src="/assets/js/pages/login.js?v=7"></script>
    <script src="/assets/js/pages/dashboard/owner.js?v=7"></script>
    <script src="/assets/js/pages/bookings/list.js?v=11"></script>
    <script src="/assets/js/pages/bookings/form.js?v=10"></script>
    <script src="/assets/js/pages/bookings/detail.js?v=14"></script>
    <script src="/assets/js/pages/customers/list.js?v=7"></script>
    <script src="/assets/js/pages/customers/form.js?v=7"></script>
    <script src="/assets/js/pages/customers/detail.js?v=7"></script>
    <script src="/assets/js/pages/services/list.js?v=7"></script>
    <script src="/assets/js/pages/services/form.js?v=7"></script>
    <script src="/assets/js/pages/categories/list.js?v=8"></script>
    <script src="/assets/js/pages/categories/form.js?v=8"></script>
    <script src="/assets/js/pages/rooms/list.js?v=7"></script>
    <script src="/assets/js/pages/rooms/form.js?v=7"></script>
    <script src="/assets/js/pages/therapists/list.js?v=8"></script>
    <script src="/assets/js/pages/therapists/form.js?v=9"></script>
    <script src="/assets/js/pages/therapists/detail.js?v=7"></script>
    <script src="/assets/js/pages/therapists/schedule.js?v=7"></script>
    <script src="/assets/js/pages/transactions/list.js?v=9"></script>
    <script src="/assets/js/pages/transactions/detail.js?v=7"></script>
    <script src="/assets/js/pages/transactions/payment.js?v=8"></script>
    <script src="/assets/js/pages/users/list.js?v=7"></script>
    <script src="/assets/js/pages/users/form.js?v=7"></script>
    <script src="/assets/js/pages/reports/revenue.js?v=8"></script>
    <script src="/assets/js/pages/reports/transactions.js?v=8"></script>
    <script src="/assets/js/pages/reports/therapist.js?v=8"></script>
    <script src="/assets/js/pages/notifications/list.js?v=7"></script>
    <script src="/assets/js/pages/therapist-portal/schedule.js?v=7"></script>
    <script src="/assets/js/pages/therapist-portal/bookings.js?v=7"></script>
    <script src="/assets/js/pages/therapist-portal/ratings.js?v=7"></script>
    <script src="/assets/js/pages/therapist-portal/performance.js?v=7"></script>
    <script src="/assets/js/pages/rating/public-form.js?v=7"></script>
    <script src="/assets/js/pages/audit-logs/list.js?v=7"></script>
    <script src="/assets/js/pages/settings/recaptcha.js?v=2"></script>
    <script src="/assets/js/app.js?v=7"></script>
</body>
</html>
