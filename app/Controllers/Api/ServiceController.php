<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ServiceModel;
use App\Models\CategoryModel;
use App\Models\BookingModel;
use App\Models\TransactionModel;
use App\Models\BookingServiceModel;

class ServiceController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    public function index()
    {
        $model = new ServiceModel();

        $search = $this->request->getGet('search');
        $categoryId = $this->request->getGet('category_id');
        $isActive = $this->request->getGet('is_active');
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 15);

        $builder = $model->getWithCategory();

        if ($search !== null && $search !== '') {
            $builder = $builder->like('services.name', $search);
        }

        if ($categoryId !== null && $categoryId !== '') {
            $builder = $builder->where('services.category_id', $categoryId);
        }

        if ($isActive !== null && $isActive !== '') {
            $builder = $builder->where('services.is_active', $isActive);
        }

        $data = $builder->orderBy('services.name', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Services retrieved successfully.',
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
            'name'             => 'required|min_length[2]|max_length[150]',
            'category_id'      => 'required|is_natural_no_zero',
            'description'      => 'permit_empty|max_length[1000]',
            'duration_minutes' => 'required|is_natural_no_zero|less_than[480]',
            'price'            => 'required|decimal',
            'is_active'        => 'permit_empty|in_list[0,1]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $categoryModel = new CategoryModel();
        $input = $this->getJsonInput();
        $categoryId = $input['category_id'];
        $category = $categoryModel->find($categoryId);

        if (!$category) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Category not found.',
            ])->setStatusCode(404);
        }

        $json = $this->getJsonInput();
        $data = [
            'name'             => $json['name'],
            'category_id'      => $json['category_id'],
            'description'      => $json['description'] ?? null,
            'duration_minutes' => $json['duration_minutes'],
            'price'            => $json['price'],
            'is_active'        => $json['is_active'] ?? 1,
        ];

        $model = new ServiceModel();
        $id = $model->insert($data);

        if (!$id) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Failed to create service.',
            ])->setStatusCode(500);
        }

        log_audit('create', 'services', $id, null, $data);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Service created successfully.',
            'data'    => $model->getWithCategory()->find($id),
        ])->setStatusCode(201);
    }

    public function show($id = null)
    {
        $model = new ServiceModel();
        $service = $model->getWithCategory()->find($id);

        if (!$service) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Service not found.',
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Service retrieved successfully.',
            'data'    => $service,
        ]);
    }

    public function update($id = null)
    {
        $model = new ServiceModel();
        $service = $model->find($id);

        if (!$service) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Service not found.',
            ])->setStatusCode(404);
        }

        $json = $this->getJsonInput() ?? [];

        $rules = [
            'name'             => 'permit_empty|min_length[2]|max_length[150]',
            'category_id'      => 'permit_empty|is_natural_no_zero',
            'description'      => 'permit_empty|max_length[1000]',
            'duration_minutes' => 'permit_empty|is_natural_no_zero|less_than[480]',
            'price'            => 'permit_empty|decimal',
            'is_active'        => 'permit_empty|in_list[0,1]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        if (isset($json['category_id'])) {
            $categoryModel = new CategoryModel();
            $category = $categoryModel->find($json['category_id']);
            if (!$category) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Category not found.',
                ])->setStatusCode(404);
            }
        }

        $oldValues = $service;

        $updateData = array_filter([
            'name'             => $json['name'] ?? null,
            'category_id'      => $json['category_id'] ?? null,
            'description'      => $json['description'] ?? null,
            'duration_minutes' => $json['duration_minutes'] ?? null,
            'price'            => $json['price'] ?? null,
            'is_active'        => $json['is_active'] ?? null,
        ], fn($v) => $v !== null);

        if (empty($updateData)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'No data to update.',
            ])->setStatusCode(400);
        }

        $model->update($id, $updateData);
        log_audit('update', 'services', $id, $oldValues, $updateData);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Service updated successfully.',
            'data'    => $model->getWithCategory()->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $model = new ServiceModel();
        $service = $model->find($id);

        if (!$service) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Service not found.',
            ])->setStatusCode(404);
        }

        $bookingCount = (new BookingModel())->where('service_id', $id)->countAllResults();
        if ($bookingCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Layanan tidak dapat dihapus karena masih digunakan oleh {$bookingCount} booking.",
            ])->setStatusCode(400);
        }

        $bookingServiceCount = (new BookingServiceModel())->where('service_id', $id)->countAllResults();
        if ($bookingServiceCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Layanan tidak dapat dihapus karena masih digunakan oleh {$bookingServiceCount} booking service.",
            ])->setStatusCode(400);
        }

        $transactionCount = (new TransactionModel())->where('service_id', $id)->countAllResults();
        if ($transactionCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Layanan tidak dapat dihapus karena masih digunakan oleh {$transactionCount} transaksi.",
            ])->setStatusCode(400);
        }

        log_audit('delete', 'services', $id, $service, null);
        $model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Service deleted successfully.',
        ]);
    }

    public function list()
    {
        $model = new ServiceModel();
        $isActive = $this->request->getGet('is_active');
        $categoryId = $this->request->getGet('category_id');

        $builder = $model->select('id, name, price, duration_minutes');

        if ($isActive !== null && $isActive !== '') {
            $builder = $builder->where('is_active', $isActive);
        }

        if ($categoryId !== null && $categoryId !== '') {
            $builder = $builder->where('category_id', $categoryId);
        }

        $data = $builder->where('is_active', 1)
            ->orderBy('name', 'ASC')
            ->findAll();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Service list retrieved successfully.',
            'data'    => $data,
        ]);
    }
}
