<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\RatingModel;
use App\Models\BookingModel;
use App\Models\TherapistModel;
use App\Models\CustomerModel;
use App\Models\UserModel;

class RatingController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    protected $ratingModel;
    protected $bookingModel;
    protected $therapistModel;
    protected $customerModel;
    protected $userModel;

    public function __construct()
    {
        $this->ratingModel    = new RatingModel();
        $this->bookingModel   = new BookingModel();
        $this->therapistModel = new TherapistModel();
        $this->customerModel  = new CustomerModel();
        $this->userModel      = new UserModel();
    }

    /**
     * List ratings with therapist/customer info, pagination
     */
    public function index()
    {
        $query = $this->ratingModel->select('ratings.*, customers.name as customer_name,
            therapists.name as therapist_name')
            ->join('customers', 'customers.id = ratings.customer_id', 'left')
            ->join('therapists', 'therapists.id = ratings.therapist_id', 'left');

        // Filter by therapist
        $therapistId = $this->request->getGet('therapist_id');
        if ($therapistId) {
            $query->where('ratings.therapist_id', $therapistId);
        }

        // Filter by rating score
        $ratingScore = $this->request->getGet('rating');
        if ($ratingScore) {
            $query->where('ratings.rating', $ratingScore);
        }

        $query->orderBy('ratings.rated_at', 'DESC');

        $ratings = $query->paginate(20, 'default');
        $pager   = $this->ratingModel->pager;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Daftar rating berhasil diambil.',
            'data'    => $ratings,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'total_pages'  => $pager->getPageCount(),
                'per_page'     => $pager->getPerPage(),
                'total'        => $pager->getTotal(),
            ],
        ]);
    }

    /**
     * Get single rating
     */
    public function show($id = null)
    {
        $rating = $this->ratingModel->select('ratings.*, customers.name as customer_name,
            therapists.name as therapist_name')
            ->join('customers', 'customers.id = ratings.customer_id', 'left')
            ->join('therapists', 'therapists.id = ratings.therapist_id', 'left')
            ->find($id);

        if (!$rating) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Rating tidak ditemukan.',
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $rating,
        ]);
    }

    /**
     * Staff creates rating at checkout
     */
    public function create()
    {
        $rules = [
            'booking_id'  => 'required|is_natural_no_zero',
            'customer_id' => 'required|is_natural_no_zero',
            'rating'      => 'required|is_natural_no_zero|less_than_equal_to[5]',
            'comment'     => 'permit_empty|max_length[1000]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input      = $this->getJsonInput();
        $bookingId  = (int) ($input['booking_id'] ?? 0);
        $customerId = (int) ($input['customer_id'] ?? 0);
        $rating     = (int) ($input['rating'] ?? 0);
        $comment    = $input['comment'] ?? null;

        $booking = $this->bookingModel->find($bookingId);

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        // Check if rating already exists for this booking
        $existingRating = $this->ratingModel->where('booking_id', $bookingId)->first();
        if ($existingRating) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Rating untuk booking ini sudah ada.',
            ])->setStatusCode(400);
        }

        $data = [
            'booking_id'    => $bookingId,
            'customer_id'   => $customerId,
            'therapist_id'  => $booking['therapist_id'],
            'rating'        => $rating,
            'comment'       => $comment,
            'rated_at'      => date('Y-m-d H:i:s'),
        ];

        $ratingId = $this->ratingModel->insert($data);

        if (!$ratingId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Gagal membuat rating.',
                'errors'  => $this->ratingModel->errors(),
            ])->setStatusCode(500);
        }

        log_audit('create', 'ratings', $ratingId, null, $data);

        $createdRating = $this->ratingModel->select('ratings.*, customers.name as customer_name,
            therapists.name as therapist_name')
            ->join('customers', 'customers.id = ratings.customer_id', 'left')
            ->join('therapists', 'therapists.id = ratings.therapist_id', 'left')
            ->find($ratingId);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Rating berhasil dibuat.',
            'data'    => $createdRating,
        ])->setStatusCode(201);
    }

    /**
     * Public form - return booking info for QR rating form (no auth)
     */
    public function publicForm($bookingCode = null)
    {
        if (!$bookingCode) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking code diperlukan.',
            ])->setStatusCode(400);
        }

        $booking = $this->bookingModel->getWithDetails()->where('booking_code', $bookingCode)->first();

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if ($booking['status'] !== 'completed') {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Rating hanya bisa diberikan untuk booking yang sudah selesai.',
            ])->setStatusCode(400);
        }

        // Check if already rated
        $existingRating = $this->ratingModel->where('booking_id', $booking['id'])->first();
        if ($existingRating) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking ini sudah diberi rating.',
            ])->setStatusCode(400);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => [
                'booking_code'  => $booking['booking_code'],
                'customer_name' => $booking['customer_name'],
                'service_name'  => $booking['service_name'],
                'therapist_name' => $booking['therapist_name'],
                'booking_date'  => $booking['booking_date'],
            ],
        ]);
    }

    /**
     * Public submit - customer submits rating via QR (no auth)
     */
    public function publicSubmit()
    {
        $rules = [
            'booking_code' => 'required|min_length[3]|max_length[20]',
            'rating'       => 'required|is_natural_no_zero|less_than_equal_to[5]',
            'comment'      => 'permit_empty|max_length[1000]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input       = $this->getJsonInput();
        $bookingCode = $input['booking_code'] ?? null;
        $rating      = (int) ($input['rating'] ?? 0);
        $comment     = $input['comment'] ?? null;

        $booking = $this->bookingModel->where('booking_code', $bookingCode)->first();

        if (!$booking) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if ($booking['status'] !== 'completed') {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Rating hanya bisa diberikan untuk booking yang sudah selesai.',
            ])->setStatusCode(400);
        }

        // Check if already rated
        $existingRating = $this->ratingModel->where('booking_id', $booking['id'])->first();
        if ($existingRating) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Booking ini sudah diberi rating.',
            ])->setStatusCode(400);
        }

        $data = [
            'booking_id'    => $booking['id'],
            'customer_id'   => $booking['customer_id'],
            'therapist_id'  => $booking['therapist_id'],
            'rating'        => $rating,
            'comment'       => $comment,
            'rated_at'      => date('Y-m-d H:i:s'),
        ];

        $ratingId = $this->ratingModel->insert($data);

        if (!$ratingId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Gagal menyimpan rating.',
                'errors'  => $this->ratingModel->errors(),
            ])->setStatusCode(500);
        }

        log_audit('public_submit', 'ratings', $ratingId, null, $data);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Terima kasih! Rating berhasil disimpan.',
            'data'    => [
                'id'     => $ratingId,
                'rating' => $rating,
            ],
        ]);
    }

    /**
     * Get therapist's own ratings
     */
    public function myRatings()
    {
        $therapistId = session()->get('therapist_id');

        if (!$therapistId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Akun Anda tidak terhubung ke therapist.',
            ])->setStatusCode(403);
        }

        $query = $this->ratingModel->select('ratings.*, customers.name as customer_name,
            therapists.name as therapist_name')
            ->join('customers', 'customers.id = ratings.customer_id', 'left')
            ->join('therapists', 'therapists.id = ratings.therapist_id', 'left')
            ->where('ratings.therapist_id', $therapistId);

        $query->orderBy('ratings.rated_at', 'DESC');

        $ratings = $query->paginate(20, 'default');
        $pager   = $this->ratingModel->pager;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Daftar rating therapist berhasil diambil.',
            'data'    => $ratings,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'total_pages'  => $pager->getPageCount(),
                'per_page'     => $pager->getPerPage(),
                'total'        => $pager->getTotal(),
            ],
        ]);
    }
}
