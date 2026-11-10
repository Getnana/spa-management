<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\RoomModel;
use App\Models\BookingModel;

class RoomController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    public function index()
    {
        $model = new RoomModel();

        $search = $this->request->getGet('search');
        $status = $this->request->getGet('status');
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 15);

        $builder = $model;

        if ($search !== null && $search !== '') {
            $builder = $builder->like('name', $search);
        }

        if ($status !== null && $status !== '') {
            $builder = $builder->where('status', $status);
        }

        $data = $builder->orderBy('name', 'ASC')
            ->paginate($perPage, 'default', $page);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Rooms retrieved successfully.',
            'data'    => $data,
            'pagination' => [
                'current_page' => $model->pager->getCurrentPage(),
                'total_pages'  => $model->pager->getPageCount(),
                'per_page'     => $model->pager->getPerPage(),
                'total'        => $model->pager->getTotal(),
            ],
        ]);
    }

    public function list()
    {
        $model = new RoomModel();
        $status = $this->request->getGet('status');

        $builder = $model->select('id, name, status');

        if ($status !== null && $status !== '') {
            $builder = $builder->where('status', $status);
        }

        $data = $builder->orderBy('name', 'ASC')->findAll();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Room list retrieved successfully.',
            'data'    => $data,
        ]);
    }

    public function create()
    {
        $rules = [
            'name'   => 'required|min_length[1]|max_length[100]|is_unique[rooms.name]',
            'status' => 'permit_empty|in_list[active,inactive]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $model = new RoomModel();
        $input = $this->getJsonInput();
        $data = [
            'name'   => $input['name'],
            'status' => $input['status'] ?? 'active',
        ];

        $id = $model->insert($data);

        if (!$id) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Failed to create room.',
            ])->setStatusCode(500);
        }

        log_audit('create', 'rooms', $id, null, $data);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Room created successfully.',
            'data'    => $model->find($id),
        ])->setStatusCode(201);
    }

    public function show($id = null)
    {
        $model = new RoomModel();
        $room = $model->find($id);

        if (!$room) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Room not found.',
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Room retrieved successfully.',
            'data'    => $room,
        ]);
    }

    public function update($id = null)
    {
        $model = new RoomModel();
        $room = $model->find($id);

        if (!$room) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Room not found.',
            ])->setStatusCode(404);
        }

        $json = $this->getJsonInput() ?? [];

        $rules = [
            'name'   => 'permit_empty|min_length[1]|max_length[100]|is_unique[rooms.name,id,' . $id . ']',
            'status' => 'permit_empty|in_list[active,inactive]',
        ];

        if (!$this->validate($rules)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Validation failed.',
                'errors'  => $this->validator->getErrors(),
            ])->setStatusCode(422);
        }

        $oldValues = $room;

        $updateData = array_filter([
            'name'   => $json['name'] ?? null,
            'status' => $json['status'] ?? null,
        ], fn($v) => $v !== null);

        if (empty($updateData)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'No data to update.',
            ])->setStatusCode(400);
        }

        $model->update($id, $updateData);
        log_audit('update', 'rooms', $id, $oldValues, $updateData);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Room updated successfully.',
            'data'    => $model->find($id),
        ]);
    }

    public function delete($id = null)
    {
        $model = new RoomModel();
        $room = $model->find($id);

        if (!$room) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Room not found.',
            ])->setStatusCode(404);
        }

        $bookingModel = new BookingModel();
        $bookingCount = $bookingModel->where('room_id', $id)->countAllResults();
        if ($bookingCount > 0) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => "Ruangan tidak dapat dihapus karena masih digunakan oleh {$bookingCount} booking.",
            ])->setStatusCode(400);
        }

        log_audit('delete', 'rooms', $id, $room, null);
        $model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Room deleted successfully.',
        ]);
    }
}
