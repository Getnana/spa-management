<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class CorsFilter implements FilterInterface
{
    private function setCorsHeaders(ResponseInterface $response): void
    {
        $allowedOrigins = env('CORS_ALLOWED_ORIGINS', 'http://localhost:8080');
        $allowedOrigins = array_map('trim', explode(',', $allowedOrigins));

        $requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? null;
        $allowedOrigin = in_array($requestOrigin, $allowedOrigins, true) ? $requestOrigin : '';

        if ($allowedOrigin) {
            $response->setHeader('Access-Control-Allow-Origin', $allowedOrigin);
            $response->setHeader('Access-Control-Allow-Credentials', 'true');
        }
        $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN');
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->setHeader('Access-Control-Max-Age', '86400');
    }

    public function before(RequestInterface $request, $arguments = null)
    {
        $response = service('response');
        $this->setCorsHeaders($response);

        if (strtolower($request->getMethod()) === 'options') {
            $response->setStatusCode(204);
            return $response;
        }

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $this->setCorsHeaders($response);
    }
}
