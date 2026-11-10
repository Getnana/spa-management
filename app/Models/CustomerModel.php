<?php

namespace App\Models;

class CustomerModel extends BaseModel
{
    protected $table            = 'customers';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = ['name', 'phone', 'email', 'notes', 'total_visits', 'loyalty_points', 'is_member'];
    protected $validationRules  = [
        'name'      => 'required|min_length[2]|max_length[100]',
        'phone'     => 'permit_empty|max_length[20]',
        'email'     => 'permit_empty|valid_email|max_length[100]',
        'is_member' => 'in_list[0,1]',
    ];
}
