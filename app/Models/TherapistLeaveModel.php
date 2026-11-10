<?php

namespace App\Models;

class TherapistLeaveModel extends BaseModel
{
    protected $table            = 'therapist_leaves';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = ['therapist_id', 'leave_date', 'reason', 'created_by'];
    protected $validationRules  = [
        'therapist_id' => 'required|is_natural_no_zero',
        'leave_date'   => 'required|valid_date',
        'created_by'   => 'required|is_natural_no_zero',
    ];
}
