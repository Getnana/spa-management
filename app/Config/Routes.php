<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// SPA catch-all (must be last)
$routes->get('/', 'Home::index');

// Public routes (no auth required)
$routes->post('api/auth/login', 'Api\AuthController::login');
$routes->get('api/settings/recaptcha', 'Api\SettingsController::recaptchaPublicKey');
$routes->get('api/rating/form/(:segment)', 'Api\RatingController::publicForm/$1');
$routes->post('api/rating/public-submit', 'Api\RatingController::publicSubmit');

// Authenticated routes
$routes->group('api', ['filter' => 'auth'], function ($routes) {
    // Auth
    $routes->post('auth/logout', 'Api\AuthController::logout');
    $routes->get('auth/me', 'Api\AuthController::me');
    $routes->put('auth/change-password', 'Api\AuthController::changePassword');

    // Owner only
    $routes->group('', ['filter' => 'role:owner'], function ($routes) {
        // User management
        $routes->get('users', 'Api\UserController::index');
        $routes->post('users', 'Api\UserController::create');
        $routes->get('users/(:num)', 'Api\UserController::show/$1');
        $routes->put('users/(:num)', 'Api\UserController::update/$1');
        $routes->delete('users/(:num)', 'Api\UserController::delete/$1');
        $routes->post('users/(:num)/reset-password', 'Api\UserController::resetPassword/$1');

        // Dashboard
        $routes->get('dashboard/summary', 'Api\DashboardController::summary');
        $routes->get('dashboard/revenue-chart/(:segment)', 'Api\DashboardController::revenueChart/$1');
        $routes->get('dashboard/booking-stats', 'Api\DashboardController::bookingStats');
        $routes->get('dashboard/popular-services', 'Api\DashboardController::popularServices');

        // Reports
        $routes->get('reports/revenue', 'Api\ReportController::revenue');
        $routes->get('reports/transactions', 'Api\ReportController::transactions');
        $routes->get('reports/therapist-performance', 'Api\ReportController::therapistPerformance');
        $routes->get('reports/export/pdf/(:segment)', 'Api\ReportController::exportPdf/$1');
        $routes->get('reports/export/excel/(:segment)', 'Api\ReportController::exportExcel/$1');

        // Audit logs
        $routes->get('audit-logs', 'Api\AuditLogController::index');
        $routes->get('audit-logs/(:num)', 'Api\AuditLogController::show/$1');

        // Settings
        $routes->get('settings', 'Api\SettingsController::index');
        $routes->put('settings', 'Api\SettingsController::save');

        // Therapists
        $routes->get('therapists', 'Api\TherapistController::index');
        $routes->post('therapists', 'Api\TherapistController::create');
        $routes->get('therapists/(:num)', 'Api\TherapistController::show/$1');
        $routes->put('therapists/(:num)', 'Api\TherapistController::update/$1');
        $routes->delete('therapists/(:num)', 'Api\TherapistController::delete/$1');
        $routes->get('therapists/(:num)/schedule', 'Api\TherapistController::schedule/$1');

        // Therapist schedules
        $routes->get('therapist-schedules', 'Api\TherapistScheduleController::index');
        $routes->post('therapist-schedules', 'Api\TherapistScheduleController::create');
        $routes->put('therapist-schedules/(:num)', 'Api\TherapistScheduleController::update/$1');
        $routes->delete('therapist-schedules/(:num)', 'Api\TherapistScheduleController::delete/$1');

        // Therapist leaves
        $routes->get('therapist-leaves', 'Api\TherapistLeaveController::index');
        $routes->post('therapist-leaves', 'Api\TherapistLeaveController::create');
        $routes->put('therapist-leaves/(:num)', 'Api\TherapistLeaveController::update/$1');
        $routes->delete('therapist-leaves/(:num)', 'Api\TherapistLeaveController::delete/$1');

        // Rooms
        $routes->get('rooms', 'Api\RoomController::index');
        $routes->post('rooms', 'Api\RoomController::create');
        $routes->get('rooms/(:num)', 'Api\RoomController::show/$1');
        $routes->put('rooms/(:num)', 'Api\RoomController::update/$1');
        $routes->delete('rooms/(:num)', 'Api\RoomController::delete/$1');

        // Categories
        $routes->get('categories', 'Api\CategoryController::index');
        $routes->post('categories', 'Api\CategoryController::create');
        $routes->get('categories/(:num)', 'Api\CategoryController::show/$1');
        $routes->put('categories/(:num)', 'Api\CategoryController::update/$1');
        $routes->delete('categories/(:num)', 'Api\CategoryController::delete/$1');

        // Services
        $routes->get('services', 'Api\ServiceController::index');
        $routes->post('services', 'Api\ServiceController::create');
        $routes->get('services/(:num)', 'Api\ServiceController::show/$1');
        $routes->put('services/(:num)', 'Api\ServiceController::update/$1');
        $routes->delete('services/(:num)', 'Api\ServiceController::delete/$1');
    });

    // Owner + Staff
    $routes->group('', ['filter' => 'role:owner,staff'], function ($routes) {
        // Customers
        $routes->get('customers', 'Api\CustomerController::index');
        $routes->post('customers', 'Api\CustomerController::create');
        $routes->get('customers/(:num)', 'Api\CustomerController::show/$1');
        $routes->put('customers/(:num)', 'Api\CustomerController::update/$1');
        $routes->delete('customers/(:num)', 'Api\CustomerController::delete/$1');
        $routes->get('customers/(:num)/history', 'Api\CustomerController::history/$1');

        // Bookings
        $routes->get('bookings', 'Api\BookingController::index');
        $routes->post('bookings', 'Api\BookingController::create');
        $routes->put('bookings/(:num)', 'Api\BookingController::update/$1');
        $routes->delete('bookings/(:num)', 'Api\BookingController::delete/$1');
        $routes->post('bookings/(:num)/checkin', 'Api\BookingController::checkIn/$1');
        $routes->post('bookings/(:num)/checkout', 'Api\BookingController::checkOut/$1');
        $routes->put('bookings/(:num)/status', 'Api\BookingController::updateStatus/$1');

        // Transactions
        $routes->get('transactions', 'Api\TransactionController::index');
        $routes->get('transactions/(:num)', 'Api\TransactionController::show/$1');
        $routes->put('transactions/(:num)', 'Api\TransactionController::update/$1');
        $routes->delete('transactions/(:num)', 'Api\TransactionController::delete/$1');
        $routes->post('transactions/manual', 'Api\TransactionController::manualCreate');
        $routes->post('transactions/from-booking', 'Api\TransactionController::create');

        // Ratings (staff can view all)
        $routes->get('ratings', 'Api\RatingController::index');
        $routes->get('ratings/(:num)', 'Api\RatingController::show/$1');
        $routes->post('ratings', 'Api\RatingController::create');
    });

    // Therapist only
    $routes->group('', ['filter' => 'role:therapist'], function ($routes) {
        $routes->get('therapist/my-schedule', 'Api\TherapistController::mySchedule');
        $routes->get('therapist/my-bookings', 'Api\BookingController::myBookings');
        $routes->get('therapist/my-ratings', 'Api\RatingController::myRatings');
        $routes->get('therapist/my-performance', 'Api\TherapistController::myPerformance');
        $routes->put('bookings/(:num)/treatment-status', 'Api\BookingController::updateTreatmentStatus/$1');
    });

    // Notifications + Booking Detail (all roles)
    $routes->group('', ['filter' => 'role:owner,staff,therapist'], function ($routes) {
        $routes->get('bookings/(:num)', 'Api\BookingController::show/$1');
        $routes->get('notifications', 'Api\NotificationController::index');
        $routes->put('notifications/(:num)/read', 'Api\NotificationController::markRead/$1');
        $routes->put('notifications/read-all', 'Api\NotificationController::markAllRead');
        $routes->get('notifications/unread-count', 'Api\NotificationController::unreadCount');
    });

    // All authenticated users
    $routes->get('services/list', 'Api\ServiceController::list');
    $routes->get('therapists/list', 'Api\TherapistController::list');
    $routes->get('rooms/list', 'Api\RoomController::list');
});

// SPA catch-all for all other routes
$routes->get('(:any)', 'Home::index');
