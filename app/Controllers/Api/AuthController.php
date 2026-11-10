<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\SettingsModel;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        $recaptchaToken = $input['recaptcha_token'] ?? '';

        // Verify reCAPTCHA if enabled
        $settingsModel = new SettingsModel();
        $recaptchaEnabled = $settingsModel->getValue('recaptcha_enabled', '0');
        if ($recaptchaEnabled === '1') {
            $secretKey = $settingsModel->getValue('recaptcha_secret_key', '');
            if (!empty($secretKey) && empty($recaptchaToken)) {
                return $this->response->setJSON([
                    'status'  => false,
                    'message' => 'Verifikasi reCAPTCHA wajib dilakukan.',
                ])->setStatusCode(422);
            }
            if (!empty($secretKey) && !empty($recaptchaToken)) {
                $client = \Config\Services::curlrequest();
                $response = $client->post('https://www.google.com/recaptcha/api/siteverify', [
                    'form_params' => [
                        'secret'   => $secretKey,
                        'response' => $recaptchaToken,
                    ],
                ]);
                $result = json_decode($response->getBody(), true);
                if (empty($result['success'])) {
                    return $this->response->setJSON([
                        'status'  => false,
                        'message' => 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.',
                    ])->setStatusCode(422);
                }
            }
        }

        $errors = [];
        if (empty($username)) {
            $errors[] = 'Username wajib diisi.';
        } elseif (strlen($username) < 3) {
            $errors[] = 'Username minimal 3 karakter.';
        }
        if (empty($password)) {
            $errors[] = 'Password wajib diisi.';
        } elseif (strlen($password) < 8) {
            $errors[] = 'Password minimal 8 karakter.';
        }
        if (!empty($errors)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => implode(' ', $errors),
                'errors'  => $errors,
            ])->setStatusCode(422);
        }

        $userModel = new UserModel();
        $user = $userModel->where('username', $username)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Username atau password salah. Pastikan Caps Lock tidak aktif dan periksa kembali data Anda.',
            ])->setStatusCode(401);
        }

        if (!$user['is_active']) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Akun Anda dinonaktifkan. Silakan hubungi administrator untuk informasi lebih lanjut.',
            ])->setStatusCode(403);
        }

        $session = session();
        $session->set([
            'user_id'    => $user['id'],
            'user_name'  => $user['full_name'],
            'user_role'  => $user['role'],
            'username'   => $user['username'],
            'therapist_id' => $user['therapist_id'] ?? null,
        ]);

        $userModel->update($user['id'], ['last_login' => date('Y-m-d H:i:s')]);
        log_audit('login', 'users', $user['id']);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'id'           => $user['id'],
                'username'     => $user['username'],
                'full_name'    => $user['full_name'],
                'email'        => $user['email'],
                'role'         => $user['role'],
                'therapist_id' => $user['therapist_id'],
            ],
        ]);
    }

    public function logout()
    {
        $userId = session()->get('user_id');
        if ($userId) {
            log_audit('logout', 'users', $userId);
        }
        session()->destroy();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    public function me()
    {
        $session = session();
        $userModel = new UserModel();
        $user = $userModel->find($session->get('user_id'));

        if (!$user) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'User tidak ditemukan.',
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => [
                'id'           => $user['id'],
                'username'     => $user['username'],
                'full_name'    => $user['full_name'],
                'email'        => $user['email'],
                'role'         => $user['role'],
                'therapist_id' => $user['therapist_id'],
            ],
        ]);
    }

    public function changePassword()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();
        $currentPassword = $input['current_password'] ?? '';
        $newPassword = $input['new_password'] ?? '';
        $confirmPassword = $input['confirm_password'] ?? '';

        if (empty($currentPassword) || empty($newPassword) || empty($confirmPassword)) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Semua field wajib diisi.',
            ])->setStatusCode(422);
        }

        if (strlen($newPassword) < 8) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Password baru minimal 8 karakter.',
            ])->setStatusCode(422);
        }

        if ($newPassword !== $confirmPassword) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Konfirmasi password tidak cocok.',
            ])->setStatusCode(422);
        }

        $userId = session()->get('user_id');
        $userModel = new UserModel();
        $user = $userModel->find($userId);

        if (!$user) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'User tidak ditemukan.',
            ])->setStatusCode(404);
        }

        if (!password_verify($currentPassword, $user['password'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Password lama salah.',
            ])->setStatusCode(400);
        }

        $userModel->update($userId, [
            'password' => $newPassword,
        ]);

        log_audit('update', 'users', $userId, null, ['action' => 'change_password']);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Password berhasil diubah.',
        ]);
    }
}
