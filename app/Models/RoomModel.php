<?php

namespace App\Models;

class RoomModel extends BaseModel
{
    protected $table            = 'rooms';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = ['name', 'status'];

    protected $validationRules = [
        'name'   => 'required|min_length[1]|max_length[100]',
        'status' => 'required|in_list[active,inactive]',
    ];
}
