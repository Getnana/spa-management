<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\Database\Exceptions\DatabaseException;
use App\Models\AuditLogModel;

class AuditLogController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    public function index()
    {
        $model = new AuditLogModel();
        $db = \Config\Database::connect();

        $userId = $this->request->getGet('user_id');
        $action = $this->request->getGet('action');
        $tableName = $this->request->getGet('table_name');
        $startDate = $this->request->getGet('start_date');
        $endDate = $this->request->getGet('end_date');
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 20);

        $builder = $db->table('audit_logs')
            ->select('audit_logs.id, audit_logs.user_name, audit_logs.action, audit_logs.table_name,
                audit_logs.record_id, audit_logs.ip_address, audit_logs.created_at');

        if ($userId) {
            $builder->where('audit_logs.user_id', $userId);
        }

        if ($action) {
            $builder->where('audit_logs.action', $action);
        }

        if ($tableName) {
            $builder->where('audit_logs.table_name', $tableName);
        }

        if ($startDate) {
            $builder->where('DATE(audit_logs.created_at) >=', $startDate);
        }

        if ($endDate) {
            $builder->where('DATE(audit_logs.created_at) <=', $endDate);
        }

        // Get total count
        $countBuilder = clone $builder;
        $total = $countBuilder->countAllResults();

        // Get paginated data
        $offset = ($page - 1) * $perPage;
        $data = $builder->orderBy('audit_logs.created_at', 'DESC')
            ->limit($perPage, $offset)
            ->get()
            ->getResultArray();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Audit logs retrieved successfully.',
            'data'    => $data,
            'pagination' => [
                'page'        => $page,
                'per_page'    => $perPage,
                'total'       => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ]);
    }

    public function show($id = null)
    {
        $model = new AuditLogModel();
        $log = $model->find($id);

        if (!$log) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Audit log not found.',
            ])->setStatusCode(404);
        }

        // Decode JSON values
        $log['old_values'] = $log['old_values'] ? json_decode($log['old_values'], true) : null;
        $log['new_values'] = $log['new_values'] ? json_decode($log['new_values'], true) : null;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Audit log retrieved successfully.',
            'data'    => $log,
        ]);
    }
}
