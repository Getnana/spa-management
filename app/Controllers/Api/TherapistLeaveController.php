<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\TherapistLeaveModel;
use App\Models\TherapistModel;
use App\Models\UserModel;

class TherapistLeaveController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    protected $leaveModel;
    protected $therapistModel;
    protected $userModel;

    public function __construct()
    {
        $this->leaveModel     = new TherapistLeaveModel();
        $this->therapistModel = new TherapistModel();
        $this->userModel      = new UserModel();
    }

    /**
     * List therapist leaves with filters and pagination
     */
    public function index()
    {
        $query = $this->leaveModel->select('therapist_leaves.*, therapists.name as therapist_name')
            ->join('therapists', 'therapists.id = therapist_leaves.therapist_id', 'left');

        // Filter by therapist
        $therapistId = $this->request->getGet('therapist_id');
        if ($therapistId) {
            $query->where('therapist_leaves.therapist_id', $therapistId);
        }

        // Filter by date range
        $dateFrom = $this->request->getGet('date_from');
        $dateTo   = $this->request->getGet('date_to');
        if ($dateFrom) {
            $query->where('therapist_leaves.leave_date >=', $dateFrom);
        }
        if ($dateTo) {
            $query->where('therapist_leaves.leave_date <=', $dateTo);
        }

        $query->orderBy('therapist_leaves.leave_date', 'DESC');

        $leaves = $query->paginate(20, 'default');
        $pager  = $this->leaveModel->pager;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Daftar cuti therapist berhasil diambil.',
            'data'    => $leaves,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'total_pages'  => $pager->getPageCount(),
                'per_page'     => $pager->getPerPage(),
                'total'        => $pager->getTotal(),
            ],
        ]);
    }

    /**
     * Create therapist leave
     */
    public function create()
    {
        $rules = [
            'therapist_id' => 'required|is_natural_no_zero',
            'leave_date'   => 'required|valid_date',
            'reason'       => 'permit_empty|max_length[255]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $input       = $this->getJsonInput();
        $therapistId = (int) ($input['therapist_id'] ?? 0);
        $leaveDate   = $input['leave_date'] ?? null;
        $reason      = $input['reason'] ?? null;

        // Validate therapist exists
        $therapist = $this->therapistModel->find($therapistId);
        if (!$therapist) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Therapist tidak ditemukan.',
            ])->setStatusCode(404);
        }

        // Check for duplicate date for same therapist
        $existing = $this->leaveModel
            ->where('therapist_id', $therapistId)
            ->where('leave_date', $leaveDate)
            ->first();

        if ($existing) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Cuti pada tanggal ' . $leaveDate . ' untuk therapist ini sudah ada.',
            ])->setStatusCode(400);
        }

        $data = [
            'therapist_id' => $therapistId,
            'leave_date'   => $leaveDate,
            'reason'       => $reason,
            'created_by'   => session()->get('user_id'),
        ];

        $leaveId = $this->leaveModel->insert($data);

        if (!$leaveId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Gagal membuat cuti therapist.',
                'errors'  => $this->leaveModel->errors(),
            ])->setStatusCode(500);
        }

        log_audit('create', 'therapist_leaves', $leaveId, null, $data);

        $leave = $this->leaveModel->select('therapist_leaves.*, therapists.name as therapist_name')
            ->join('therapists', 'therapists.id = therapist_leaves.therapist_id', 'left')
            ->find($leaveId);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Cuti therapist berhasil dibuat.',
            'data'    => $leave,
        ])->setStatusCode(201);
    }

    /**
     * Update therapist leave
     */
    public function update($id = null)
    {
        $leave = $this->leaveModel->find($id);

        if (!$leave) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Cuti therapist tidak ditemukan.',
            ])->setStatusCode(404);
        }

        $rules = [
            'therapist_id' => 'permit_empty|is_natural_no_zero',
            'leave_date'   => 'permit_empty|valid_date',
            'reason'       => 'permit_empty|max_length[255]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validasi gagal.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $oldValues = $leave;

        $data  = [];
        $input = $this->getJsonInput();

        $newTherapistId = $input['therapist_id'] ?? null;
        $newLeaveDate   = $input['leave_date'] ?? null;
        $newReason      = $input['reason'] ?? null;

        $targetTherapistId = $newTherapistId ? (int) $newTherapistId : $leave['therapist_id'];
        $targetLeaveDate   = $newLeaveDate ? $newLeaveDate : $leave['leave_date'];

        // Check for duplicate date if therapist_id or leave_date changed
        if (($newTherapistId && (int) $newTherapistId != $leave['therapist_id'])
            || ($newLeaveDate && $newLeaveDate != $leave['leave_date'])
        ) {
            $duplicate = $this->leaveModel
                ->where('therapist_id', $targetTherapistId)
                ->where('leave_date', $targetLeaveDate)
                ->where('id !=', $id)
                ->first();

            if ($duplicate) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Cuti pada tanggal ' . $targetLeaveDate . ' untuk therapist ini sudah ada.',
                ])->setStatusCode(400);
            }
        }

        if ($newTherapistId) {
            // Validate therapist exists
            $therapist = $this->therapistModel->find((int) $newTherapistId);
            if (!$therapist) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Therapist tidak ditemukan.',
                ])->setStatusCode(404);
            }
            $data['therapist_id'] = (int) $newTherapistId;
        }

        if ($newLeaveDate) {
            $data['leave_date'] = $newLeaveDate;
        }

        if ($newReason !== null) {
            $data['reason'] = $newReason;
        }

        if (empty($data)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Tidak ada data yang diupdate.',
            ])->setStatusCode(400);
        }

        $this->leaveModel->update($id, $data);

        log_audit('update', 'therapist_leaves', $id, $oldValues, $data);

        $updatedLeave = $this->leaveModel->select('therapist_leaves.*, therapists.name as therapist_name')
            ->join('therapists', 'therapists.id = therapist_leaves.therapist_id', 'left')
            ->find($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Cuti therapist berhasil diupdate.',
            'data'    => $updatedLeave,
        ]);
    }

    /**
     * Soft delete therapist leave
     */
    public function delete($id = null)
    {
        $leave = $this->leaveModel->find($id);

        if (!$leave) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Cuti therapist tidak ditemukan.',
            ])->setStatusCode(404);
        }

        $oldValues = $leave;

        $this->leaveModel->delete($id);

        log_audit('delete', 'therapist_leaves', $id, $oldValues, null);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Cuti therapist berhasil dihapus.',
        ]);
    }
}
