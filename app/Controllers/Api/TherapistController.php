<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\TherapistModel;
use App\Models\UserModel;
use App\Models\BookingModel;
use App\Models\TransactionModel;
use App\Models\RatingModel;
use App\Models\TherapistScheduleModel;

class TherapistController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    public function index()
    {
        $model = new TherapistModel();

        $search = $this->request->getGet('search');
        $status = $this->request->getGet('status');
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 15);

        $builder = $model->select('therapists.*, (SELECT AVG(rating) FROM ratings WHERE ratings.therapist_id = therapists.id) as avg_rating');

        if ($search !== null && $search !== '') {
            $builder = $builder->like('therapists.name', $search);
        }

        if ($status !== null && $status !== '') {
            $builder = $builder->where('therapists.status', $status);
        }

        $data = $builder->orderBy('therapists.name', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Therapists retrieved successfully.',
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
            'name'            => 'required|min_length[2]|max_length[100]',
            'phone'           => 'permit_empty|max_length[20]',
            'specialty'       => 'permit_empty|max_length[200]',
            'commission_rate' => 'permit_empty|decimal|greater_than_equal_to[0]|less_than_equal_to[100]',
            'status'          => 'required|in_list[active,inactive,on_leave]',
            'avatar_path'     => 'permit_empty|max_length[500]',
            'notes'           => 'permit_empty|max_length[1000]',
            'create_user'     => 'permit_empty|in_list[0,1]',
            'username'        => 'permit_empty|min_length[3]|max_length[50]|regex_match[/^[a-zA-Z0-9_]+$/]|is_unique[users.username]',
            'email'           => 'permit_empty|valid_email|max_length[100]|is_unique[users.email]',
            'password'        => 'permit_empty|min_length[8]',
        ];

        $messages = [
            'name'            => ['required' => 'Nama lengkap wajib diisi.', 'min_length' => 'Nama minimal 2 karakter.', 'max_length' => 'Nama maksimal 100 karakter.'],
            'phone'           => ['max_length' => 'No. telepon maksimal 20 karakter.'],
            'specialty'       => ['max_length' => 'Spesialisasi maksimal 200 karakter.'],
            'commission_rate' => ['decimal' => 'Komisi harus berupa angka desimal.', 'greater_than_equal_to' => 'Komisi minimal 0%.', 'less_than_equal_to' => 'Komisi maksimal 100%.'],
            'status'          => ['required' => 'Status wajib dipilih.', 'in_list' => 'Status tidak valid.'],
            'username'        => ['min_length' => 'Username minimal 3 karakter.', 'max_length' => 'Username maksimal 50 karakter.', 'regex_match' => 'Username hanya boleh huruf, angka, dan underscore.', 'is_unique' => 'Username sudah digunakan.'],
            'email'           => ['valid_email' => 'Format email tidak valid.', 'max_length' => 'Email maksimal 100 karakter.', 'is_unique' => 'Email sudah terdaftar.'],
            'password'        => ['min_length' => 'Password minimal 8 karakter.'],
        ];

        if (!$this->validate($rules, $messages)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $json = $this->getJsonInput();
        $createUser = ($json['create_user'] ?? 0) == 1;

        if ($createUser) {
            $missing = [];
            if (empty($json['username'])) $missing[] = 'Username';
            if (empty($json['email'])) $missing[] = 'Email';
            if (empty($json['password'])) $missing[] = 'Password';
            if (!empty($missing)) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => implode(', ', $missing) . ' wajib diisi untuk membuat akun login.',
                ])->setStatusCode(422);
            }
        }

        $model = new TherapistModel();
        $settingsModel = new \App\Models\SettingsModel();
        $defaultRate = (float) $settingsModel->getValue('default_commission_rate', '0');

        $commissionRate = session()->get('user_role') === 'owner'
            ? (isset($json['commission_rate']) && $json['commission_rate'] !== '' ? (float) $json['commission_rate'] : $defaultRate)
            : $defaultRate;

        $data = [
            'name'            => $json['name'],
            'phone'           => $json['phone'] ?? null,
            'specialty'       => $json['specialty'] ?? null,
            'commission_rate' => $commissionRate,
            'status'          => $json['status'],
            'avatar_path'     => $json['avatar_path'] ?? null,
            'notes'           => $json['notes'] ?? null,
        ];

        $id = $model->insert($data);

        if (!$id) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Failed to create therapist.',
            ])->setStatusCode(500);
        }

        if ($createUser) {
            $userModel = new UserModel();
            $userData = [
                'username'     => $json['username'],
                'email'        => $json['email'],
                'password'     => $json['password'],
                'full_name'    => $json['name'],
                'role'         => 'therapist',
                'therapist_id' => $id,
                'is_active'    => 1,
            ];

            $userId = $userModel->insert($userData);

            if (!$userId) {
                $model->delete($id);
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Failed to create linked user account. Therapist creation rolled back.',
                ])->setStatusCode(500);
            }

            create_notification(
                $userId,
                'Akun Dibuat',
                'Akun Anda telah dibuat. Silakan login menggunakan kredensial yang diberikan.',
                'system',
                $id
            );
        }

        log_audit('create', 'therapists', $id, null, $data);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Therapist created successfully.',
            'data'    => $model->find($id),
        ])->setStatusCode(201);
    }

    public function show($id = null)
    {
        $model = new TherapistModel();
        $therapist = $model->find($id);

        if (!$therapist) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Therapist not found.',
            ])->setStatusCode(404);
        }

        $avgRating = $model->getAverageRating($id);
        $therapist['avg_rating'] = round($avgRating, 1);

        $bookingModel = new BookingModel();
        $completedBookings = $bookingModel->where('therapist_id', $id)
            ->where('status', 'completed')
            ->countAllResults();

        $cancelledBookings = $bookingModel->where('therapist_id', $id)
            ->where('status', 'cancelled')
            ->countAllResults();

        $noShowBookings = $bookingModel->where('therapist_id', $id)
            ->where('status', 'no_show')
            ->countAllResults();

        $transactionModel = new TransactionModel();
        $totalRevenue = $transactionModel->select('SUM(net_revenue) as total')
            ->where('therapist_id', $id)
            ->where('payment_status', 'paid')
            ->get()
            ->getRow();

        $ratingModel = new RatingModel();
        $totalRatings = $ratingModel->where('therapist_id', $id)->countAllResults();

        $performance = [
            'completed_bookings' => $completedBookings,
            'cancelled_bookings' => $cancelledBookings,
            'no_show_bookings'   => $noShowBookings,
            'total_revenue'      => $totalRevenue ? (float) $totalRevenue->total : 0,
            'total_ratings'      => $totalRatings,
            'avg_rating'         => round($avgRating, 1),
        ];

        return $this->response->setJSON([
            'status'      => true,
            'message'     => 'Therapist retrieved successfully.',
            'data'        => $therapist,
            'performance' => $performance,
        ]);
    }

    public function update($id = null)
    {
        $model = new TherapistModel();
        $therapist = $model->find($id);

        if (!$therapist) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Therapist not found.',
            ])->setStatusCode(404);
        }

        $json = $this->getJsonInput() ?? [];

        $rules = [
            'name'            => 'permit_empty|min_length[2]|max_length[100]',
            'phone'           => 'permit_empty|max_length[20]',
            'specialty'       => 'permit_empty|max_length[200]',
            'commission_rate' => 'permit_empty|decimal|greater_than_equal_to[0]|less_than_equal_to[100]',
            'status'          => 'permit_empty|in_list[active,inactive,on_leave]',
            'avatar_path'     => 'permit_empty|max_length[500]',
            'notes'           => 'permit_empty|max_length[1000]',
        ];

        $messages = [
            'name'            => ['min_length' => 'Nama minimal 2 karakter.', 'max_length' => 'Nama maksimal 100 karakter.'],
            'phone'           => ['max_length' => 'No. telepon maksimal 20 karakter.'],
            'specialty'       => ['max_length' => 'Spesialisasi maksimal 200 karakter.'],
            'commission_rate' => ['decimal' => 'Komisi harus berupa angka desimal.', 'greater_than_equal_to' => 'Komisi minimal 0%.', 'less_than_equal_to' => 'Komisi maksimal 100%.'],
            'status'          => ['in_list' => 'Status tidak valid.'],
        ];

        if (!$this->validate($rules, $messages)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $oldValues = $therapist;

        $updateData = array_filter([
            'name'            => $json['name'] ?? null,
            'phone'           => $json['phone'] ?? null,
            'specialty'       => $json['specialty'] ?? null,
            'commission_rate' => session()->get('user_role') === 'owner' ? ($json['commission_rate'] ?? null) : null,
            'status'          => $json['status'] ?? null,
            'avatar_path'     => $json['avatar_path'] ?? null,
            'notes'           => $json['notes'] ?? null,
        ], fn($v) => $v !== null);

        if (empty($updateData)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'No data to update.',
            ])->setStatusCode(400);
        }

        $model->update($id, $updateData);
        log_audit('update', 'therapists', $id, $oldValues, $updateData);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Therapist updated successfully.',
            'data'    => $model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $model = new TherapistModel();
        $therapist = $model->find($id);

        if (!$therapist) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Therapist not found.',
            ])->setStatusCode(404);
        }

        $bookingCount = (new BookingModel())->where('therapist_id', $id)->countAllResults();
        if ($bookingCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Terapis tidak dapat dihapus karena masih memiliki {$bookingCount} booking.",
            ])->setStatusCode(400);
        }

        $transactionCount = (new TransactionModel())->where('therapist_id', $id)->countAllResults();
        if ($transactionCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Terapis tidak dapat dihapus karena masih memiliki {$transactionCount} transaksi.",
            ])->setStatusCode(400);
        }

        $ratingCount = (new RatingModel())->where('therapist_id', $id)->countAllResults();
        if ($ratingCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Terapis tidak dapat dihapus karena masih memiliki {$ratingCount} rating.",
            ])->setStatusCode(400);
        }

        log_audit('delete', 'therapists', $id, $therapist, null);
        $model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Therapist deleted successfully.',
        ]);
    }

    public function list()
    {
        $model = new TherapistModel();
        $status = $this->request->getGet('status');

        $builder = $model->select('id, name, status');

        if ($status !== null && $status !== '') {
            $builder = $builder->where('status', $status);
        }

        $data = $builder->orderBy('name', 'ASC')->findAll();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Therapist list retrieved successfully.',
            'data'    => $data,
        ]);
    }

    public function schedule($id = null)
    {
        $therapistModel = new TherapistModel();
        $therapist = $therapistModel->find($id);

        if (!$therapist) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Therapist not found.',
            ])->setStatusCode(404);
        }

        $scheduleModel = new TherapistScheduleModel();
        $schedules = $scheduleModel->where('therapist_id', $id)
            ->orderBy('day_of_week', 'ASC')
            ->orderBy('start_time', 'ASC')
            ->findAll();

        $dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

        $data = array_map(function ($schedule) use ($dayNames) {
            $schedule['day_name'] = $dayNames[$schedule['day_of_week']] ?? '';
            return $schedule;
        }, $schedules);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Therapist schedule retrieved successfully.',
            'data'    => $data,
        ]);
    }

    public function mySchedule()
    {
        $therapistId = session()->get('therapist_id');

        if (!$therapistId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'No therapist associated with your account.',
            ])->setStatusCode(403);
        }

        $startDate = $this->request->getGet('start_date');
        $endDate   = $this->request->getGet('end_date');

        $bookingModel   = new BookingModel();
        $query = $bookingModel->getWithDetails()
            ->where('bookings.therapist_id', $therapistId)
            ->whereNotIn('bookings.status', ['cancelled', 'no_show']);

        if ($startDate) {
            $query->where('bookings.booking_date >=', $startDate);
        }
        if ($endDate) {
            $query->where('bookings.booking_date <=', $endDate);
        }

        $bookings = $query->orderBy('bookings.booking_date', 'ASC')
            ->orderBy('bookings.start_time', 'ASC')
            ->findAll();

        $data = array_map(function ($b) {
            return [
                'id'            => $b['id'],
                'booking_date'  => $b['booking_date'],
                'start_time'    => $b['start_time'],
                'end_time'      => $b['end_time'],
                'status'        => $b['status'],
                'customer_name' => $b['customer_name'],
                'service_name'  => $b['service_name'],
            ];
        }, $bookings);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'My schedule retrieved successfully.',
            'data'    => $data,
        ]);
    }

    public function myPerformance()
    {
        $therapistId = session()->get('therapist_id');

        if (!$therapistId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'No therapist associated with your account.',
            ])->setStatusCode(403);
        }

        $bookingModel = new BookingModel();
        $transactionModel = new TransactionModel();
        $ratingModel = new RatingModel();
        $therapistModel = new TherapistModel();

        $completedBookings = $bookingModel->where('therapist_id', $therapistId)
            ->where('status', 'completed')
            ->countAllResults();

        $totalBookings = $bookingModel->where('therapist_id', $therapistId)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->countAllResults();

        $completionRate = $totalBookings > 0 ? round(($completedBookings / $totalBookings) * 100, 0) : 0;

        $totalMinutes = $bookingModel
            ->select('SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 60) as total_minutes')
            ->where('therapist_id', $therapistId)
            ->where('status', 'completed')
            ->get()
            ->getRow();

        $hoursWorked = $totalMinutes ? round((float) $totalMinutes->total_minutes / 60, 1) : 0;

        $totalRevenue = $transactionModel->select('SUM(net_revenue) as total')
            ->where('therapist_id', $therapistId)
            ->where('payment_status', 'paid')
            ->get()
            ->getRow();

        $avgRating = $therapistModel->getAverageRating($therapistId);

        $totalRatings = $ratingModel->where('therapist_id', $therapistId)->countAllResults();

        $data = [
            'therapist_id'       => (int) $therapistId,
            'services_handled'   => $completedBookings,
            'hours_worked'       => $hoursWorked,
            'revenue_generated'  => $totalRevenue ? (float) $totalRevenue->total : 0,
            'avg_rating'         => round($avgRating, 1),
            'total_ratings'      => $totalRatings,
            'completion_rate'    => $completionRate,
            'weekly_data'        => $this->getWeeklyPerformance($therapistId),
        ];

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'My performance retrieved successfully.',
            'data'    => $data,
        ]);
    }

    private function getWeeklyPerformance(int $therapistId): array
    {
        $bookingModel = new BookingModel();
        $transactionModel = new TransactionModel();
        $weeks = [];

        for ($i = 3; $i >= 0; $i--) {
            $weekStart = date('Y-m-d', strtotime("monday this week -{$i} weeks"));
            $weekEnd = date('Y-m-d', strtotime("sunday this week -{$i} weeks"));

            $completedCount = $bookingModel->where('therapist_id', $therapistId)
                ->where('status', 'completed')
                ->where('booking_date >=', $weekStart)
                ->where('booking_date <=', $weekEnd)
                ->countAllResults();

            $minutes = $bookingModel
                ->select('SUM(TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 60) as total_minutes')
                ->where('therapist_id', $therapistId)
                ->where('status', 'completed')
                ->where('booking_date >=', $weekStart)
                ->where('booking_date <=', $weekEnd)
                ->get()->getRow();

            $revenue = $transactionModel->select('SUM(net_revenue) as total')
                ->where('therapist_id', $therapistId)
                ->where('payment_status', 'paid')
                ->where('created_at >=', $weekStart . ' 00:00:00')
                ->where('created_at <=', $weekEnd . ' 23:59:59')
                ->get()->getRow();

            $weeks[] = [
                'label'          => date('d M', strtotime($weekStart)) . ' - ' . date('d M', strtotime($weekEnd)),
                'total_services' => $completedCount,
                'total_hours'    => $minutes ? round((float) $minutes->total_minutes / 60, 1) : 0,
                'revenue'        => $revenue ? (float) $revenue->total : 0,
            ];
        }

        return $weeks;
    }
}
