<?php

namespace App\Models;

class RatingModel extends BaseModel
{
    protected $table            = 'ratings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['booking_id', 'customer_id', 'therapist_id', 'rating', 'comment', 'rated_at'];
    protected $validationRules  = [
        'booking_id'    => 'required|is_natural_no_zero',
        'customer_id'   => 'required|is_natural_no_zero',
        'therapist_id'  => 'required|is_natural_no_zero',
        'rating'        => 'required|is_natural_no_zero|less_than_equal_to[5]',
        'comment'       => 'permit_empty|max_length[1000]',
    ];
}
