<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class RoleFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $session = session();
        $userRole = $session->get('user_role');

        if (!$userRole) {
            return service('response')->setJSON([
                'status' => false,
                'message' => 'Unauthorized.',
            ])->setStatusCode(401);
        }

        $allowedRoles = $arguments ?? [];

        if (!empty($allowedRoles) && !in_array($userRole, $allowedRoles)) {
            return service('response')->setJSON([
                'status' => false,
                'message' => 'Forbidden. You do not have permission to access this resource.',
            ])->setStatusCode(403);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}
