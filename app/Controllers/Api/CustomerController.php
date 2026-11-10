<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CustomerModel;
use App\Models\BookingModel;
use App\Models\TransactionModel;
use App\Models\RatingModel;

class CustomerController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    public function index()
    {
        $model = new CustomerModel();

        $search = $this->request->getGet('search');
        $isMember = $this->request->getGet('is_member');
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 15);

        $builder = $model;

        if ($search !== null && $search !== '') {
            $builder = $builder->groupStart()
                ->like('name', $search)
                ->orLike('phone', $search)
                ->orLike('email', $search)
                ->groupEnd();
        }

        if ($isMember !== null && $isMember !== '') {
            $builder = $builder->where('is_member', $isMember);
        }

        $data = $builder->orderBy('name', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Customers retrieved successfully.',
            'data'    => $data,
            'pagination' => [
                'current_page' => $model->pager->getCurrentPage(),
                'total_pages'  => $model->pager->getPageCount(),
                'per_page'     => $model->pager->getPerPage(),
                'total'        => $model->pager->getTotal(),
            ],
        ]);
    }

    public function create()
    {
        $rules = [
            'name'       => 'required|min_length[2]|max_length[100]',
            'phone'      => 'permit_empty|max_length[20]',
            'email'      => 'permit_empty|valid_email|max_length[100]',
            'notes'      => 'permit_empty|max_length[1000]',
            'is_member'  => 'permit_empty|in_list[0,1]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $json = $this->getJsonInput();
        $data = [
            'name'          => $json['name'],
            'phone'         => $json['phone'] ?? null,
            'email'         => $json['email'] ?? null,
            'notes'         => $json['notes'] ?? null,
            'total_visits'  => 0,
            'loyalty_points' => 0,
            'is_member'     => $json['is_member'] ?? 0,
        ];

        $model = new CustomerModel();
        $id = $model->insert($data);

        if (!$id) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Failed to create customer.',
            ])->setStatusCode(500);
        }

        log_audit('create', 'customers', $id, null, $data);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Customer created successfully.',
            'data'    => $model->find($id),
        ])->setStatusCode(201);
    }

    public function show($id = null)
    {
        $model = new CustomerModel();
        $customer = $model->find($id);

        if (!$customer) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Customer not found.',
            ])->setStatusCode(404);
        }

        $bookingModel = new BookingModel();
        $totalBookings = $bookingModel->where('customer_id', $id)
            ->countAllResults();

        $completedBookings = $bookingModel->where('customer_id', $id)
            ->where('status', 'completed')
            ->countAllResults();

        $cancelledBookings = $bookingModel->where('customer_id', $id)
            ->where('status', 'cancelled')
            ->countAllResults();

        $transactionModel = new TransactionModel();
        $totalSpending = $transactionModel->select('SUM(total_amount) as total')
            ->where('customer_id', $id)
            ->where('payment_status', 'paid')
            ->get()
            ->getRow();

        $stats = [
            'total_bookings'    => $totalBookings,
            'completed_bookings' => $completedBookings,
            'cancelled_bookings' => $cancelledBookings,
            'total_spending'    => $totalSpending ? (float) $totalSpending->total : 0,
        ];

        return $this->response->setJSON([
            'status' => true,
            'message' => 'Customer retrieved successfully.',
            'data'   => $customer,
            'stats'  => $stats,
        ]);
    }

    public function update($id = null)
    {
        $model = new CustomerModel();
        $customer = $model->find($id);

        if (!$customer) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Customer not found.',
            ])->setStatusCode(404);
        }

        $json = $this->getJsonInput() ?? [];

        $rules = [
            'name'      => 'permit_empty|min_length[2]|max_length[100]',
            'phone'     => 'permit_empty|max_length[20]',
            'email'     => 'permit_empty|valid_email|max_length[100]',
            'notes'     => 'permit_empty|max_length[1000]',
            'is_member' => 'permit_empty|in_list[0,1]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $oldValues = $customer;

        $updateData = array_filter([
            'name'      => $json['name'] ?? null,
            'phone'     => $json['phone'] ?? null,
            'email'     => $json['email'] ?? null,
            'notes'     => $json['notes'] ?? null,
            'is_member' => $json['is_member'] ?? null,
        ], fn($v) => $v !== null);

        if (empty($updateData)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'No data to update.',
            ])->setStatusCode(400);
        }

        $model->update($id, $updateData);
        log_audit('update', 'customers', $id, $oldValues, $updateData);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Customer updated successfully.',
            'data'    => $model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $model = new CustomerModel();
        $customer = $model->find($id);

        if (!$customer) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Customer not found.',
            ])->setStatusCode(404);
        }

        $bookingCount = (new BookingModel())->where('customer_id', $id)->countAllResults();
        if ($bookingCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Customer tidak dapat dihapus karena masih memiliki {$bookingCount} booking.",
            ])->setStatusCode(400);
        }

        $transactionCount = (new TransactionModel())->where('customer_id', $id)->countAllResults();
        if ($transactionCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Customer tidak dapat dihapus karena masih memiliki {$transactionCount} transaksi.",
            ])->setStatusCode(400);
        }

        $ratingCount = (new RatingModel())->where('customer_id', $id)->countAllResults();
        if ($ratingCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Customer tidak dapat dihapus karena masih memiliki {$ratingCount} rating.",
            ])->setStatusCode(400);
        }

        log_audit('delete', 'customers', $id, $customer, null);
        $model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Customer deleted successfully.',
        ]);
    }

    public function history($id = null)
    {
        $customerModel = new CustomerModel();
        $customer = $customerModel->find($id);

        if (!$customer) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Customer not found.',
            ])->setStatusCode(404);
        }

        $bookingModel = new BookingModel();
        $bookings = $bookingModel->getWithDetails()
            ->where('bookings.customer_id', $id)
            ->orderBy('bookings.booking_date', 'DESC')
            ->orderBy('bookings.start_time', 'DESC')
            ->limit(50)
            ->find();

        $transactionModel = new TransactionModel();
        $transactions = $transactionModel->getWithDetails()
            ->where('transactions.customer_id', $id)
            ->orderBy('transactions.created_at', 'DESC')
            ->limit(50)
            ->find();

        return $this->response->setJSON([
            'status'       => true,
            'message'      => 'Customer history retrieved successfully.',
            'bookings'     => $bookings,
            'transactions' => $transactions,
        ]);
    }
}
