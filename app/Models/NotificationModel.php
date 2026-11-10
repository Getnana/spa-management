<?php

namespace App\Models;

class NotificationModel extends BaseModel
{
    protected $table            = 'notifications';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = false;
    protected $allowedFields    = ['user_id', 'title', 'message', 'type', 'reference_id', 'is_read'];
    protected $validationRules  = [
        'user_id' => 'required|is_natural_no_zero',
        'title'   => 'required|max_length[200]',
        'type'    => 'required|in_list[booking,schedule,payment,system,rating]',
    ];
}
