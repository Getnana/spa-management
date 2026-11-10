<?php

namespace App\Models;

class AuditLogModel extends BaseModel
{
    protected $table            = 'audit_logs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = false;
    protected $useTimestamps    = true;
    protected $updatedField     = '';
    protected $allowedFields    = ['user_id', 'user_name', 'action', 'table_name', 'record_id', 'old_values', 'new_values', 'ip_address', 'user_agent'];
    protected $validationRules  = [
        'action'     => 'required|max_length[100]',
        'table_name' => 'required|max_length[100]',
    ];
}
