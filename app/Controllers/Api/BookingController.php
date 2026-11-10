<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\BookingModel;
use App\Models\TherapistModel;
use App\Models\ServiceModel;
use App\Models\CustomerModel;
use App\Models\UserModel;
use App\Models\TransactionModel;
use App\Models\RatingModel;
use App\Models\BookingServiceModel;

class BookingController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    protected $bookingModel;
    protected $therapistModel;
    protected $serviceModel;
    protected $customerModel;
    protected $userModel;
    protected $bookingServiceModel;

    public function __construct()
    {
        $this->bookingModel        = new BookingModel();
        $this->therapistModel      = new TherapistModel();
        $this->serviceModel        = new ServiceModel();
        $this->customerModel       = new CustomerModel();
        $this->userModel           = new UserModel();
        $this->bookingServiceModel = new BookingServiceModel();
    }

    /**
     * List bookings with filters and pagination
     */
    public function index()
    {
        $query = $this->bookingModel->getWithDetails();

        // Filter by date
        $date = $this->request->getGet('date');
        if ($date) {
            $query->where('bookings.booking_date', $date);
        }

        // Filter by date range
        $dateFrom = $this->request->getGet('date_from');
        $dateTo   = $this->request->getGet('date_to');
        if ($dateFrom) {
            $query->where('bookings.booking_date >=', $dateFrom);
        }
        if ($dateTo) {
            $query->where('bookings.booking_date <=', $dateTo);
        }

        // Filter by status
        $status = $this->request->getGet('status');
        if ($status) {
            $query->where('bookings.status', $status);
        }

        // Filter by therapist
        $therapistId = $this->request->getGet('therapist_id');
        if ($therapistId) {
            $query->where('bookings.therapist_id', $therapistId);
        }

        // Filter by source
        $source = $this->request->getGet('source');
        if ($source) {
            $query->where('bookings.source', $source);
        }

        // Filter by customer
        $customerId = $this->request->getGet('customer_id');
        if ($customerId) {
            $query->where('bookings.customer_id', $customerId);
        }

        // Search by booking code
        $search = $this->request->getGet('search');
        if ($search) {
            $query->groupStart()
                ->like('bookings.booking_code', $search)
                ->orLike('customers.name', $search)
                ->orLike('services.name', $search)
                ->groupEnd();
        }

        $query->orderBy('bookings.booking_date', 'DESC')
              ->orderBy('bookings.start_time', 'DESC');

        $bookings = $query->paginate(20, 'default');
        $pager    = $this->bookingModel->pager;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Daftar booking berhasil diambil.',
            'data'    => $bookings,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'total_pages'  => $pager->getPageCount(),
                'per_page'     => $pager->getPerPage(),
                'total'        => $pager->getTotal(),
            ],
        ]);
    }

    /**
     * Create a new booking
     */
    public function create()
    {
        $rules = [
            'customer_id'   => 'required|is_natural_no_zero',
            'service_ids'   => 'required',
            'booking_date'  => 'required|valid_date',
            'start_time'    => 'required',
            'source'        => 'required|in_list[walk_in,whatsapp,phone,online]',
            'therapist_id'  => 'permit_empty|is_natural_no_zero',
            'room_id'       => 'permit_empty|is_natural_no_zero',
            'notes'         => 'permit_empty',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input        = $this->getJsonInput();
        $customerId   = (int) ($input['customer_id'] ?? 0);
        $serviceIds   = $input['service_ids'] ?? [];
        $bookingDate  = $input['booking_date'] ?? null;
        $startTime    = $input['start_time'] ?? null;
        $source       = $input['source'] ?? null;
        $therapistId  = !empty($input['therapist_id']) ? (int) $input['therapist_id'] : null;
        $roomId       = !empty($input['room_id']) ? (int) $input['room_id'] : null;
        $notes        = $input['notes'] ?? null;

        // Normalize service_ids to array
        if (!is_array($serviceIds)) {
            $serviceIds = [$serviceIds];
        }
        if (empty($serviceIds)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Pilih minimal 1 layanan.',
            ])->setStatusCode(422);
        }

        // Validate customer exists
        $customer = $this->customerModel->find($customerId);
        if (!$customer) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Customer tidak ditemukan.',
            ])->setStatusCode(404);
        }

        // Validate all services exist and get max duration for overlap check
        $totalDuration = 0;
        foreach ($serviceIds as $sid) {
            $service = $this->serviceModel->find((int) $sid);
            if (!$service) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Layanan tidak ditemukan.',
                ])->setStatusCode(404);
            }
            $totalDuration += ($service['duration_minutes'] ?? $service['duration'] ?? 60);
        }

        $estimatedEnd = date('H:i:s', strtotime($startTime) + $totalDuration * 60);

        // Validate therapist exists if provided
        if ($therapistId) {
            $therapist = $this->therapistModel->find($therapistId);
            if (!$therapist) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Therapist tidak ditemukan.',
                ])->setStatusCode(404);
            }

            if ($this->bookingModel->checkOverlap($therapistId, $bookingDate, $startTime, $estimatedEnd)) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Jadwal therapist bentrok pada waktu tersebut.',
                ])->setStatusCode(400);
            }
        }

        // Generate booking code
        $bookingCode = $this->bookingModel->generateBookingCode($bookingDate);

        $data = [
            'booking_code' => $bookingCode,
            'customer_id'  => $customerId,
            'therapist_id' => $therapistId,
            'room_id'      => $roomId,
            'status'       => 'pending',
            'booking_date' => $bookingDate,
            'start_time'   => $startTime,
            'end_time'     => $therapistId ? $estimatedEnd : $estimatedEnd,
            'source'       => $source,
            'notes'        => $notes,
            'created_by'   => session()->get('user_id'),
        ];

        $bookingId = $this->bookingModel->insert($data);

        if (!$bookingId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Gagal membuat booking.',
                'errors'  => $this->bookingModel->errors(),
            ])->setStatusCode(500);
        }

        // Sync services to pivot table
        $this->bookingServiceModel->syncServices($bookingId, $serviceIds);

        // Notify staff about new booking
        $staffUsers = $this->userModel->where('role', 'staff')
            ->where('is_active', 1)
            ->findAll();

        foreach ($staffUsers as $staff) {
            create_notification(
                $staff['id'],
                'Booking Baru',
                "Booking baru {$bookingCode} dari {$customer['name']} pada {$bookingDate}.",
                'booking',
                $bookingId
            );
        }

        // Notify assigned therapist about new booking
        if (!empty($data['therapist_id'])) {
            $therapistUser = $this->userModel->getTherapistUser($data['therapist_id']);
            if ($therapistUser) {
                create_notification(
                    $therapistUser['id'],
                    'Booking Baru',
                    "Booking baru {$bookingCode} dari {$customer['name']} pada {$bookingDate}.",
                    'booking',
                    $bookingId
                );
            }
        }

        log_audit('create', 'bookings', $bookingId, null, $data);

        $booking = $this->bookingModel->getWithDetails()->find($bookingId);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Booking berhasil dibuat.',
            'data'    => $booking,
        ])->setStatusCode(201);
    }

    /**
     * Get booking detail
     */
    public function show($id = null)
    {
        $booking = $this->bookingModel->getWithDetails()->find($id);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        $auditModel = new \App\Models\AuditLogModel();
        $statusHistory = $auditModel->where('table_name', 'bookings')
            ->where('record_id', $id)
            ->whereIn('action', ['create', 'update_status', 'check_in', 'check_out', 'update_treatment_status'])
            ->orderBy('created_at', 'ASC')
            ->findAll();

        return $this->response->setJSON([
            'status' => true,
            'data'   => $booking,
            'status_history' => $statusHistory,
        ]);
    }

    /**
     * Update booking
     */
    public function update($id = null)
    {
        $booking = $this->bookingModel->find($id);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        $rules = [
            'customer_id'   => 'permit_empty|is_natural_no_zero',
            'service_ids'   => 'permit_empty',
            'booking_date'  => 'permit_empty|valid_date',
            'start_time'    => 'permit_empty',
            'end_time'      => 'permit_empty',
            'source'        => 'permit_empty|in_list[walk_in,whatsapp,phone,online]',
            'therapist_id'  => 'permit_empty|is_natural_no_zero',
            'notes'         => 'permit_empty',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $oldValues = $booking;

        $input       = $this->getJsonInput();
        $bookingDate = $input['booking_date'] ?? $booking['booking_date'];
        $startTime   = $input['start_time'] ?? $booking['start_time'];
        $therapistId = $input['therapist_id'] ?? null;
        $therapistId = $therapistId !== null ? (int) $therapistId : $booking['therapist_id'];

        // Handle service_ids update
        $serviceIds = $input['service_ids'] ?? null;
        $servicesChanged = false;
        if ($serviceIds !== null) {
            if (!is_array($serviceIds)) {
                $serviceIds = [$serviceIds];
            }
            $servicesChanged = true;

            // Recalculate end_time based on new services
            $totalDuration = 0;
            foreach ($serviceIds as $sid) {
                $service = $this->serviceModel->find((int) $sid);
                if ($service) {
                    $totalDuration += ($service['duration_minutes'] ?? $service['duration'] ?? 60);
                }
            }
            $endTime = date('H:i:s', strtotime($startTime) + $totalDuration * 60);
        } else {
            $endTime = $input['end_time'] ?? $booking['end_time'];
        }

        // Check overlap if therapist, date, time, or services changed
        if ($therapistId && ($therapistId != $booking['therapist_id']
            || $bookingDate != $booking['booking_date']
            || $startTime != $booking['start_time']
            || $servicesChanged)
        ) {
            if ($this->bookingModel->checkOverlap($therapistId, $bookingDate, $startTime, $endTime, $id)) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Jadwal therapist bentrok pada waktu tersebut.',
                ])->setStatusCode(400);
            }
        }

        $data = [];

       if ($serviceIds !== null) {
            $data['end_time'] = $endTime;
        }

        if (!empty($input['customer_id'])) {
            $data['customer_id'] = (int) $input['customer_id'];
        }
        if (!empty($input['booking_date'])) {
            $data['booking_date'] = $bookingDate;
        }
        if (!empty($input['start_time'])) {
            $data['start_time'] = $startTime;
        }
        if (!empty($input['source'])) {
            $data['source'] = $input['source'];
        }
        if (array_key_exists('therapist_id', $input) && $input['therapist_id'] !== null) {
            $data['therapist_id'] = $therapistId;
        }
        if (array_key_exists('notes', $input) && $input['notes'] !== null) {
            $data['notes'] = $input['notes'];
        }
        $data['updated_by'] = session()->get('user_id');

        $this->bookingModel->update($id, $data);

        // Sync services if provided
        if ($serviceIds !== null && !empty($serviceIds)) {
            $this->bookingServiceModel->syncServices($id, $serviceIds);
        }

        log_audit('update', 'bookings', $id, $oldValues, $data);

        $updatedBooking = $this->bookingModel->getWithDetails()->find($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Booking berhasil diupdate.',
            'data'    => $updatedBooking,
        ]);
    }

    /**
     * Soft delete booking (set status to cancelled)
     */
    public function delete($id = null)
    {
        $booking = $this->bookingModel->find($id);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if (in_array($booking['status'], ['completed', 'cancelled', 'no_show'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking dengan status ' . $booking['status'] . ' tidak dapat dibatalkan.',
            ])->setStatusCode(400);
        }

        $role = session()->get('user_role');
        if ($role === 'staff' && $booking['status'] !== 'pending') {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Staff hanya dapat membatalkan booking dengan status pending.',
            ])->setStatusCode(403);
        }

        $txCount = (new TransactionModel())->where('booking_id', $id)->countAllResults();
        if ($txCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Booking tidak dapat dibatalkan karena sudah memiliki {$txCount} transaksi.",
            ])->setStatusCode(400);
        }

        $ratingCount = (new RatingModel())->where('booking_id', $id)->countAllResults();
        if ($ratingCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Booking tidak dapat dibatalkan karena sudah memiliki {$ratingCount} rating.",
            ])->setStatusCode(400);
        }

        $oldValues = $booking;

        $this->bookingModel->update($id, [
            'status'     => 'cancelled',
            'updated_by' => session()->get('user_id'),
        ]);

        log_audit('delete', 'bookings', $id, $oldValues, ['status' => 'cancelled']);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Booking berhasil dibatalkan.',
        ]);
    }

    /**
     * Check in a booking
     */
    public function checkIn($id = null)
    {
        $booking = $this->bookingModel->find($id);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if (!in_array($booking['status'], ['confirmed', 'pending'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking dengan status ' . $booking['status'] . ' tidak dapat di-check in.',
            ])->setStatusCode(400);
        }

        if (!empty($booking['checked_in_at'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking sudah di-check in sebelumnya.',
            ])->setStatusCode(400);
        }

        $oldValues = $booking;

        $this->bookingModel->update($id, [
            'status'        => 'confirmed',
            'checked_in_at' => date('Y-m-d H:i:s'),
            'updated_by'    => session()->get('user_id'),
        ]);

        // Notify therapist
        if ($booking['therapist_id']) {
            $therapistUser = $this->userModel->getTherapistUser($booking['therapist_id']);
            if ($therapistUser) {
                create_notification(
                    $therapistUser['id'],
                    'Check In Booking',
                    "Booking {$booking['booking_code']} sudah check in. Silakan mulai treatment.",
                    'booking',
                    $id
                );
            }
        }

        log_audit('check_in', 'bookings', $id, $oldValues, [
            'status'        => 'confirmed',
            'checked_in_at' => date('Y-m-d H:i:s'),
        ]);

        $updatedBooking = $this->bookingModel->getWithDetails()->find($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Booking berhasil check in.',
            'data'    => $updatedBooking,
        ]);
    }

    /**
     * Check out a booking
     */
    public function checkOut($id = null)
    {
        $booking = $this->bookingModel->find($id);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if ($booking['status'] !== 'in_progress') {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking harus dalam status in_progress untuk check out.',
            ])->setStatusCode(400);
        }

        $oldValues = $booking;

        $this->bookingModel->update($id, [
            'status'        => 'awaiting_payment',
            'checked_out_at' => date('Y-m-d H:i:s'),
            'updated_by'    => session()->get('user_id'),
        ]);

        log_audit('check_out', 'bookings', $id, $oldValues, [
            'status'         => 'awaiting_payment',
            'checked_out_at' => date('Y-m-d H:i:s'),
        ]);

        $updatedBooking = $this->bookingModel->getWithDetails()->find($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Booking berhasil check out.',
            'data'    => $updatedBooking,
        ]);
    }

    /**
     * Update booking status with transition validation
     */
    public function updateStatus($id = null)
    {
        $booking = $this->bookingModel->find($id);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        $rules = [
            'status' => 'required|in_list[pending,confirmed,in_progress,awaiting_payment,completed,cancelled,no_show]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input     = $this->getJsonInput();
        $newStatus = $input['status'] ?? null;

        // Define allowed transitions
        $allowedTransitions = [
            'pending'    => ['confirmed', 'cancelled', 'no_show'],
            'confirmed'  => ['in_progress', 'cancelled', 'no_show', 'pending'],
            'in_progress' => ['awaiting_payment', 'cancelled'],
            'awaiting_payment' => ['completed', 'cancelled'],
            'completed'  => [],
            'cancelled'  => ['pending'],
            'no_show'    => ['pending'],
        ];

        $currentStatus = $booking['status'];

        if (!isset($allowedTransitions[$currentStatus]) || !in_array($newStatus, $allowedTransitions[$currentStatus])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Perubahan status dari '{$currentStatus}' ke '{$newStatus}' tidak diperbolehkan.",
            ])->setStatusCode(400);
        }

        $oldValues = $booking;

        $this->bookingModel->update($id, [
            'status'     => $newStatus,
            'updated_by' => session()->get('user_id'),
        ]);

        if ($newStatus === 'completed' && $booking['customer_id']) {
            $customerModel = new CustomerModel();
            $customerModel->builder()->where('id', $booking['customer_id'])->increment('total_visits', 1);
        }

        log_audit('update_status', 'bookings', $id, $oldValues, ['status' => $newStatus]);

        $updatedBooking = $this->bookingModel->getWithDetails()->find($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Status booking berhasil diupdate.',
            'data'    => $updatedBooking,
        ]);
    }

    /**
     * Therapist updates treatment notes/status
     */
    public function updateTreatmentStatus($id = null)
    {
        $booking = $this->bookingModel->find($id);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        // Verify therapist owns this booking
        $therapistId = session()->get('therapist_id');
        if ($booking['therapist_id'] != $therapistId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Anda tidak memiliki akses ke booking ini.',
            ])->setStatusCode(403);
        }

        $rules = [
            'status'         => 'if_exist|in_list[in_progress,awaiting_payment]',
            'treatment_notes' => 'permit_empty|max_length[2000]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input = $this->getJsonInput();

        // Validate status transition
        if (isset($input['status'])) {
            $allowedFrom = [
                'in_progress'      => ['confirmed', 'pending'],
                'awaiting_payment' => ['in_progress'],
            ];
            $allowed = $allowedFrom[$input['status']] ?? [];
            if (!in_array($booking['status'], $allowed)) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => "Perubahan status dari '{$booking['status']}' ke '{$input['status']}' tidak diperbolehkan.",
                ])->setStatusCode(400);
            }
        }

        $oldValues = $booking;

        $data = [
            'updated_by' => session()->get('user_id'),
        ];

        if (isset($input['status'])) {
            $data['status'] = $input['status'];
            if ($input['status'] === 'awaiting_payment') {
                $data['end_time'] = date('H:i:s');
            }
            if ($input['status'] === 'in_progress' && empty($booking['checked_in_at'])) {
                $data['checked_in_at'] = date('Y-m-d H:i:s');
            }
        }
        if (isset($input['treatment_notes'])) {
            $data['notes'] = $input['treatment_notes'];
        }

        $this->bookingModel->update($id, $data);

        log_audit('update_treatment_status', 'bookings', $id, $oldValues, $data);

        $updatedBooking = $this->bookingModel->getWithDetails()->find($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Catatan treatment berhasil diupdate.',
            'data'    => $updatedBooking,
        ]);
    }

    /**
     * Get therapist's own bookings
     */
    public function myBookings()
    {
        $therapistId = session()->get('therapist_id');

        if (!$therapistId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Akun Anda tidak terhubung ke therapist.',
            ])->setStatusCode(403);
        }

        $query = $this->bookingModel->getWithDetails()
            ->where('bookings.therapist_id', $therapistId);

        // Filter by date
        $date = $this->request->getGet('date');
        if ($date) {
            $query->where('bookings.booking_date', $date);
        }

        // Filter by status
        $status = $this->request->getGet('status');
        if ($status) {
            $query->where('bookings.status', $status);
        }

        // Filter by date range
        $dateFrom = $this->request->getGet('date_from');
        $dateTo   = $this->request->getGet('date_to');
        if ($dateFrom) {
            $query->where('bookings.booking_date >=', $dateFrom);
        }
        if ($dateTo) {
            $query->where('bookings.booking_date <=', $dateTo);
        }

        $query->orderBy('bookings.booking_date', 'DESC')
              ->orderBy('bookings.start_time', 'DESC');

        $bookings = $query->paginate(20, 'default');
        $pager    = $this->bookingModel->pager;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Daftar booking therapist berhasil diambil.',
            'data'    => $bookings,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'total_pages'  => $pager->getPageCount(),
                'per_page'     => $pager->getPerPage(),
                'total'        => $pager->getTotal(),
            ],
        ]);
    }
}
