<?php

namespace App\Models;

class UserModel extends BaseModel
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = ['username', 'email', 'password', 'full_name', 'role', 'therapist_id', 'is_active', 'last_login'];
    protected $validationRules  = [
        'username'  => 'required|min_length[3]|max_length[50]|regex_match[/^[a-zA-Z0-9_]+$/]|is_unique[users.username,id,{id}]',
        'email'     => 'required|valid_email|max_length[100]|is_unique[users.email,id,{id}]',
        'password'  => 'required|min_length[8]',
        'full_name' => 'required|min_length[2]|max_length[100]',
        'role'      => 'required|in_list[owner,staff,therapist]',
        'is_active' => 'in_list[0,1]',
    ];

    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    protected function hashPassword(array $data)
    {
        if (isset($data['data']['password']) && !empty($data['data']['password'])) {
            $password = $data['data']['password'];
            if (strlen($password) < 60 || !str_starts_with($password, '$2y$')) {
                $data['data']['password'] = password_hash($password, PASSWORD_DEFAULT);
            }
        }
        return $data;
    }

    public function getTherapistUser(int $therapistId): ?array
    {
        return $this->where('therapist_id', $therapistId)
            ->where('is_active', 1)
            ->first();
    }
}
