<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NotificationModel;

class NotificationController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    protected $notificationModel;

    public function __construct()
    {
        $this->notificationModel = new NotificationModel();
    }

    /**
     * List notifications for current user, newest first, paginated
     */
    public function index()
    {
        $userId = session()->get('user_id');

        if (!$userId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'User belum login.',
            ])->setStatusCode(401);
        }

        $query = $this->notificationModel->where('user_id', $userId);

        // Filter by type
        $type = $this->request->getGet('type');
        if ($type) {
            $query->where('type', $type);
        }

        // Filter by read status
        $isRead = $this->request->getGet('is_read');
        if ($isRead !== null && $isRead !== '') {
            $query->where('is_read', (int) $isRead);
        }

        $query->orderBy('id', 'DESC');

        $notifications = $query->paginate(20, 'default');
        $pager         = $this->notificationModel->pager;

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Daftar notifikasi berhasil diambil.',
            'data'    => $notifications,
            'pagination' => [
                'current_page' => $pager->getCurrentPage(),
                'total_pages'  => $pager->getPageCount(),
                'per_page'     => $pager->getPerPage(),
                'total'        => $pager->getTotal(),
            ],
        ]);
    }

    /**
     * Mark single notification as read
     */
    public function markRead($id = null)
    {
        $userId = session()->get('user_id');

        if (!$userId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'User belum login.',
            ])->setStatusCode(401);
        }

        $notification = $this->notificationModel->find($id);

        if (!$notification) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Notifikasi tidak ditemukan.',
            ])->setStatusCode(404);
        }

        // Verify notification belongs to current user
        if ($notification['user_id'] != $userId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Anda tidak memiliki akses ke notifikasi ini.',
            ])->setStatusCode(403);
        }

        if ($notification['is_read'] == 1) {
            return $this->response->setJSON([
                'status'  => true,
                'message' => 'Notifikasi sudah ditandai sebagai dibaca.',
                'data'    => $notification,
            ]);
        }

        $this->notificationModel->update($id, ['is_read' => 1]);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Notifikasi ditandai sebagai dibaca.',
            'data'    => $this->notificationModel->find($id),
        ]);
    }

    /**
     * Mark all notifications as read for current user
     */
    public function markAllRead()
    {
        $userId = session()->get('user_id');

        if (!$userId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'User belum login.',
            ])->setStatusCode(401);
        }

        $this->notificationModel
            ->where('user_id', $userId)
            ->where('is_read', 0)
            ->set(['is_read' => 1])
            ->update();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Semua notifikasi ditandai sebagai dibaca.',
        ]);
    }

    /**
     * Count of unread notifications for current user
     */
    public function unreadCount()
    {
        $userId = session()->get('user_id');

        if (!$userId) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'User belum login.',
            ])->setStatusCode(401);
        }

        $count = $this->notificationModel
            ->where('user_id', $userId)
            ->where('is_read', 0)
            ->countAllResults();

        return $this->response->setJSON([
            'status' => true,
            'data'   => [
                'unread_count' => $count,
            ],
        ]);
    }
}
