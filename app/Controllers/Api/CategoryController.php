<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CategoryModel;
use App\Models\ServiceModel;

class CategoryController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    public function index()
    {
        $model = new CategoryModel();

        $search = $this->request->getGet('search');
        $isActive = $this->request->getGet('is_active');
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 15);

        $builder = $model;

        if ($search !== null && $search !== '') {
            $builder = $builder->like('name', $search);
        }

        if ($isActive !== null && $isActive !== '') {
            $builder = $builder->where('is_active', $isActive);
        }

        $data = $builder->orderBy('name', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Categories retrieved successfully.',
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
            'name'        => 'required|min_length[2]|max_length[100]|is_unique[categories.name]',
            'description' => 'permit_empty|max_length[500]',
            'is_active'   => 'permit_empty|in_list[0,1]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $model = new CategoryModel();
        $input = $this->getJsonInput();
        $data = [
            'name'        => $input['name'],
            'description' => $input['description'] ?? null,
            'is_active'   => $input['is_active'] ?? 1,
        ];

        $id = $model->insert($data);

        if (!$id) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Failed to create category.',
            ])->setStatusCode(500);
        }

        log_audit('create', 'categories', $id, null, $data);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Category created successfully.',
            'data'    => $model->find($id),
        ])->setStatusCode(201);
    }

    public function show($id = null)
    {
        $model = new CategoryModel();
        $category = $model->find($id);

        if (!$category) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Category not found.',
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Category retrieved successfully.',
            'data'    => $category,
        ]);
    }

    public function update($id = null)
    {
        $model = new CategoryModel();
        $category = $model->find($id);

        if (!$category) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Category not found.',
            ])->setStatusCode(404);
        }

        $json = $this->getJsonInput() ?? [];

        $rules = [
            'name'        => 'permit_empty|min_length[2]|max_length[100]|is_unique[categories.name,id,' . $id . ']',
            'description' => 'permit_empty|max_length[500]',
            'is_active'   => 'permit_empty|in_list[0,1]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $oldValues = $category;

        $updateData = array_filter([
            'name'        => $json['name'] ?? null,
            'description' => $json['description'] ?? null,
            'is_active'   => $json['is_active'] ?? null,
        ], fn($v) => $v !== null);

        if (empty($updateData)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'No data to update.',
            ])->setStatusCode(400);
        }

        $model->update($id, $updateData);
        log_audit('update', 'categories', $id, $oldValues, $updateData);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Category updated successfully.',
            'data'    => $model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $model = new CategoryModel();
        $category = $model->find($id);

        if (!$category) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Category not found.',
            ])->setStatusCode(404);
        }

        $serviceModel = new ServiceModel();
        $serviceCount = $serviceModel->where('category_id', $id)->countAllResults();
        if ($serviceCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Kategori tidak dapat dihapus karena masih digunakan oleh {$serviceCount} layanan.",
            ])->setStatusCode(400);
        }

        log_audit('delete', 'categories', $id, $category, null);
        $model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Category deleted successfully.',
        ]);
    }
}
