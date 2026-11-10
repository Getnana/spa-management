<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\TransactionModel;
use App\Models\BookingModel;
use App\Models\TherapistModel;
use App\Models\ServiceModel;
use App\Models\CustomerModel;
use App\Models\UserModel;
use App\Models\SettingsModel;

class TransactionController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    protected $transactionModel;
    protected $bookingModel;
    protected $therapistModel;
    protected $serviceModel;
    protected $customerModel;
    protected $userModel;

    public function __construct()
    {
        $this->transactionModel = new TransactionModel();
        $this->bookingModel     = new BookingModel();
        $this->therapistModel   = new TherapistModel();
        $this->serviceModel     = new ServiceModel();
        $this->customerModel    = new CustomerModel();
        $this->userModel        = new UserModel();
    }

    /**
     * List transactions with filters and pagination
     */
    public function index()
    {
        $query = $this->transactionModel->getWithDetails();

        // Filter by date range
        $dateFrom = $this->request->getGet('date_from');
        $dateTo   = $this->request->getGet('date_to');
        if ($dateFrom) {
            $query->where('transactions.created_at >=', $dateFrom . ' 00:00:00');
        }
        if ($dateTo) {
            $query->where('transactions.created_at <=', $dateTo . ' 23:59:59');
        }

        // Filter by status
        $paymentStatus = $this->request->getGet('payment_status');
        if ($paymentStatus) {
            $query->where('transactions.payment_status', $paymentStatus);
        }

        // Filter by payment method
        $paymentMethod = $this->request->getGet('payment_method');
        if ($paymentMethod) {
            $query->where('transactions.payment_method', $paymentMethod);
        }

        // Filter by booking
        $bookingId = $this->request->getGet('booking_id');
        if ($bookingId) {
            $query->where('transactions.booking_id', $bookingId);
        }

        // Filter by therapist
        $therapistId = $this->request->getGet('therapist_id');
        if ($therapistId) {
            $query->where('transactions.therapist_id', $therapistId);
        }

        // Filter by staff
        $staffId = $this->request->getGet('staff_id');
        if ($staffId) {
            $query->where('transactions.staff_id', $staffId);
        }

        // Search by transaction code
        $search = $this->request->getGet('search');
        if ($search) {
            $query->groupStart()
                ->like('transactions.transaction_code', $search)
                ->orLike('customers.name', $search)
                ->groupEnd();
        }

        $query->orderBy('transactions.created_at', 'DESC');

        $transactions = $query->paginate(20, 'default');
        $pager        = $this->transactionModel->pager;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Daftar transaksi berhasil diambil.',
            'data'    => $transactions,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'total_pages'  => $pager->getPageCount(),
                'per_page'     => $pager->getPerPage(),
                'total'        => $pager->getTotal(),
            ],
        ]);
    }

    /**
     * Auto-create transaction from booking checkout
     */
    public function create()
    {
        $rules = [
            'booking_id'     => 'required|is_natural_no_zero',
            'payment_method' => 'required|in_list[cash,transfer,qris,card,other]',
            'discount'       => 'permit_empty|decimal|greater_than_equal_to[0]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input         = $this->getJsonInput();
        $bookingId     = (int) ($input['booking_id'] ?? 0);
        $paymentMethod = $input['payment_method'] ?? null;
        $discount      = $input['discount'] ?? 0;

        $booking = $this->bookingModel->find($bookingId);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if (!in_array($booking['status'], ['completed', 'awaiting_payment'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Transaksi hanya bisa dibuat dari booking yang sudah selesai (awaiting_payment).',
            ])->setStatusCode(400);
        }

        // Check if transaction already exists for this booking
        $existingTx = $this->transactionModel->where('booking_id', $bookingId)->first();
        if ($existingTx) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Transaksi untuk booking ini sudah ada.',
            ])->setStatusCode(400);
        }

       // Get subtotal from booking_services
            $db = \Config\Database::connect();

            $subtotalRow = $db->table('booking_services bs')
                ->select('COALESCE(SUM(s.price),0) as subtotal')
                ->join('services s', 's.id = bs.service_id')
                ->where('bs.booking_id', $bookingId)
                ->get()
                ->getRow();

            $subtotal = (float) ($subtotalRow->subtotal ?? 0);

            $afterDiscount = $subtotal - (float) $discount;
            $serviceRow = $db->table('booking_services')
            ->select('service_id')
            ->where('booking_id', $bookingId)
            ->get()
            ->getRow();

        $serviceId = $serviceRow->service_id ?? null;

            if ($afterDiscount < 0) {
                $afterDiscount = 0;
            }


        // Calculate tax
        $settingsModel = new SettingsModel();
        $taxEnabled = $settingsModel->getValue('tax_enabled', '0');
        $taxRate     = (float) $settingsModel->getValue('tax_rate', '0');
        $taxAmount   = 0;

        if ($taxEnabled === '1' && $taxRate > 0) {
            $taxAmount = round($afterDiscount * $taxRate / 100, 2);
        }

        $totalAmount = $afterDiscount + $taxAmount;

        // Calculate commission
        $commissionAmount = 0;
        $netRevenue       = $totalAmount;

        if ($booking['therapist_id']) {
            $therapist = $this->therapistModel->find($booking['therapist_id']);
            if ($therapist) {
                $commissionRate  = (float) $therapist['commission_rate'];
                $commissionAmount = round($afterDiscount * $commissionRate / 100, 2);
                $netRevenue      = round($totalAmount - $taxAmount - $commissionAmount, 2);
            }
        }

        $transactionCode = $this->transactionModel->generateTransactionCode();

        $data = [
            'transaction_code'  => $transactionCode,
            'booking_id'        => $bookingId,
            'customer_id'       => $booking['customer_id'],
            'staff_id'          => session()->get('user_id'),
            'therapist_id'      => $booking['therapist_id'],
            'service_id'        => $serviceId,
            'subtotal'          => $subtotal,
            'discount'          => (float) $discount,
            'tax_amount'        => $taxAmount,
            'total_amount'      => $totalAmount,
            'payment_method'    => $paymentMethod,
            'payment_status'    => 'paid',
            'commission_amount' => $commissionAmount,
            'net_revenue'       => $netRevenue,
            'paid_at'           => date('Y-m-d H:i:s'),
            'created_by'        => session()->get('user_id'),
        ];

        $transactionId = $this->transactionModel->insert($data);

        if (!$transactionId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Gagal membuat transaksi.',
                'errors'  => $this->transactionModel->errors(),
            ])->setStatusCode(500);
        }

        log_audit('create', 'transactions', $transactionId, null, $data);

        // Update booking status to completed after payment
        if ($booking['status'] === 'awaiting_payment') {
            $this->bookingModel->update($bookingId, [
                'status'     => 'completed',
                'updated_by' => session()->get('user_id'),
            ]);
            log_audit('update_status', 'bookings', $bookingId, ['status' => 'awaiting_payment'], ['status' => 'completed']);

            // Increment customer total_visits
            if ($booking['customer_id']) {
                $this->customerModel->builder()->where('id', $booking['customer_id'])->increment('total_visits', 1);
            }
        }

        $transaction = $this->transactionModel->getWithDetails()->find($transactionId);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Transaksi berhasil dibuat.',
            'data'    => $transaction,
        ])->setStatusCode(201);
    }

    /**
     * Get transaction detail
     */
    public function show($id = null)
    {
        $transaction = $this->transactionModel->getWithDetails()->find($id);

        if (!$transaction) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Transaksi tidak ditemukan.',
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $transaction,
        ]);
    }

    /**
     * Update transaction (discount, payment method, recalculate net_revenue)
     */
    public function update($id = null)
    {
        $transaction = $this->transactionModel->find($id);

        if (!$transaction) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Transaksi tidak ditemukan.',
            ])->setStatusCode(404);
        }

        $rules = [
            'discount'       => 'permit_empty|decimal|greater_than_equal_to[0]',
            'payment_method' => 'permit_empty|in_list[cash,transfer,qris,card,other]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $oldValues = $transaction;

        $input          = $this->getJsonInput();
        $discount       = $input['discount'] ?? null;
        $paymentMethod  = $input['payment_method'] ?? null;

        $data = [];

        if ($discount !== null) {
            $discount = (float) $discount;
            $subtotal = (float) $transaction['subtotal'];
            $afterDiscount = $subtotal - $discount;

            if ($afterDiscount < 0) {
                $afterDiscount = 0;
            }

            // Recalculate tax
            $settingsModel = new SettingsModel();
            $taxEnabled = $settingsModel->getValue('tax_enabled', '0');
            $taxRate     = (float) $settingsModel->getValue('tax_rate', '0');
            $taxAmount   = 0;

            if ($taxEnabled === '1' && $taxRate > 0) {
                $taxAmount = round($afterDiscount * $taxRate / 100, 2);
            }

            $totalAmount = $afterDiscount + $taxAmount;

            // Recalculate commission and net revenue
            $commissionAmount = 0;
            $netRevenue       = $totalAmount;

            if ($transaction['therapist_id']) {
                $therapist = $this->therapistModel->find($transaction['therapist_id']);
                if ($therapist) {
                    $commissionRate   = (float) $therapist['commission_rate'];
                    $commissionAmount = round($afterDiscount * $commissionRate / 100, 2);
                    $netRevenue       = round($totalAmount - $taxAmount - $commissionAmount, 2);
                }
            }

            $data['discount']          = $discount;
            $data['tax_amount']        = $taxAmount;
            $data['total_amount']      = $totalAmount;
            $data['commission_amount'] = $commissionAmount;
            $data['net_revenue']       = $netRevenue;
        }

        if ($paymentMethod !== null) {
            $data['payment_method'] = $paymentMethod;
        }

        if (empty($data)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Tidak ada data yang diupdate.',
            ])->setStatusCode(400);
        }

        $this->transactionModel->update($id, $data);

        log_audit('update', 'transactions', $id, $oldValues, $data);

        $updatedTransaction = $this->transactionModel->getWithDetails()->find($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Transaksi berhasil diupdate.',
            'data'    => $updatedTransaction,
        ]);
    }

    /**
     * Staff creates manual transaction without booking
     */
    public function manualCreate()
    {
        $rules = [
            'customer_id'    => 'required|is_natural_no_zero',
            'therapist_id'   => 'permit_empty|is_natural_no_zero',
            'service_id'     => 'required|is_natural_no_zero',
            'payment_method' => 'required|in_list[cash,transfer,qris,card,other]',
            'total_amount'   => 'required|decimal|greater_than_equal_to[0]',
            'discount'       => 'permit_empty|decimal|greater_than_equal_to[0]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input         = $this->getJsonInput();
        $customerId    = (int) ($input['customer_id'] ?? 0);
        $therapistId   = !empty($input['therapist_id']) ? (int) $input['therapist_id'] : null;
        $serviceId     = (int) ($input['service_id'] ?? 0);
        $paymentMethod = $input['payment_method'] ?? null;
        $totalAmount   = (float) ($input['total_amount'] ?? 0);
        $discount      = $input['discount'] ?? 0;

        // Validate customer exists
        $customer = $this->customerModel->find($customerId);
        if (!$customer) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Customer tidak ditemukan.',
            ])->setStatusCode(404);
        }

        // Validate service exists
        $service = $this->serviceModel->find($serviceId);
        if (!$service) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Layanan tidak ditemukan.',
            ])->setStatusCode(404);
        }

        // Validate therapist exists if provided
        if ($therapistId) {
            $therapist = $this->therapistModel->find($therapistId);
            if (!$therapist) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Therapist tidak ditemukan.',
                ])->setStatusCode(404);
            }
        }

        $discount     = (float) $discount;
        $afterDiscount = $totalAmount - $discount;
        $subtotal     = $totalAmount;

        if ($afterDiscount < 0) {
            $afterDiscount = 0;
        }

        // Calculate tax
        $settingsModel = new SettingsModel();
        $taxEnabled = $settingsModel->getValue('tax_enabled', '0');
        $taxRate     = (float) $settingsModel->getValue('tax_rate', '0');
        $taxAmount   = 0;

        if ($taxEnabled === '1' && $taxRate > 0) {
            $taxAmount = round($afterDiscount * $taxRate / 100, 2);
        }

        $finalTotal = $afterDiscount + $taxAmount;

        // Calculate commission
        $commissionAmount = 0;
        $netRevenue       = $finalTotal;

        if ($therapistId) {
            $therapist = $this->therapistModel->find($therapistId);
            if ($therapist) {
                $commissionRate   = (float) $therapist['commission_rate'];
                $commissionAmount = round($afterDiscount * $commissionRate / 100, 2);
                $netRevenue       = round($finalTotal - $taxAmount - $commissionAmount, 2);
            }
        }

        $transactionCode = $this->transactionModel->generateTransactionCode();

        $data = [
            'transaction_code'  => $transactionCode,
            'booking_id'        => null,
            'customer_id'       => $customerId,
            'staff_id'          => session()->get('user_id'),
            'therapist_id'      => $therapistId,
            'service_id'        => $serviceId,
            'subtotal'          => $subtotal,
            'discount'          => $discount,
            'tax_amount'        => $taxAmount,
            'total_amount'      => $finalTotal,
            'payment_method'    => $paymentMethod,
            'payment_status'    => 'paid',
            'commission_amount' => $commissionAmount,
            'net_revenue'       => $netRevenue,
            'paid_at'           => date('Y-m-d H:i:s'),
            'created_by'        => session()->get('user_id'),
        ];

        $transactionId = $this->transactionModel->insert($data);

        if (!$transactionId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Gagal membuat transaksi manual.',
                'errors'  => $this->transactionModel->errors(),
            ])->setStatusCode(500);
        }

        log_audit('manual_create', 'transactions', $transactionId, null, $data);

        $transaction = $this->transactionModel->getWithDetails()->find($transactionId);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Transaksi manual berhasil dibuat.',
            'data'    => $transaction,
        ])->setStatusCode(201);
    }

    /**
     * Soft delete transaction (set payment_status to refunded)
     */
    public function delete($id = null)
    {
        if (session()->get('user_role') !== 'owner') {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Hanya owner yang dapat menghapus transaksi.',
            ])->setStatusCode(403);
        }

        $transaction = $this->transactionModel->find($id);

        if (!$transaction) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Transaksi tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if ($transaction['payment_status'] === 'refunded') {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Transaksi sudah di-refund.',
            ])->setStatusCode(400);
        }

        $oldValues = $transaction;

        $this->transactionModel->update($id, [
            'payment_status' => 'refunded',
        ]);

        log_audit('delete', 'transactions', $id, $oldValues, ['payment_status' => 'refunded']);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Transaksi berhasil di-refund.',
        ]);
    }
}
