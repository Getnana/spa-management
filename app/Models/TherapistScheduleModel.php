<?php

namespace App\Models;

class TherapistScheduleModel extends BaseModel
{
    protected $table            = 'therapist_schedules';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['therapist_id', 'day_of_week', 'start_time', 'end_time', 'is_available'];
    protected $validationRules  = [
        'therapist_id' => 'required|is_natural_no_zero',
        'day_of_week'  => 'required|is_natural|less_than[7]',
        'start_time'   => 'required',
        'end_time'     => 'required',
        'is_available' => 'in_list[0,1]',
    ];
}
