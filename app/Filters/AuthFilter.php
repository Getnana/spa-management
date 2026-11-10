<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $session = session();

        if (!$session->get('user_id')) {
            return $this->respondUnauthorized();
        }

        // Verify user still active
        $userModel = new \App\Models\UserModel();
        $user = $userModel->find($session->get('user_id'));

        if (!$user || !$user['is_active']) {
            $session->destroy();
            return $this->respondUnauthorized();
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }

    private function respondUnauthorized()
    {
        $response = service('response');
        return $response->setJSON([
            'status' => false,
            'message' => 'Unauthorized. Please login first.',
        ])->setStatusCode(401);
    }
}
