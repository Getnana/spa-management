<?php

namespace App\Models;

class ServiceModel extends BaseModel
{
    protected $table            = 'services';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = ['name', 'category_id', 'description', 'duration_minutes', 'price', 'is_active'];
    protected $validationRules  = [
        'name'             => 'required|min_length[2]|max_length[150]',
        'category_id'      => 'required|is_natural_no_zero',
        'duration_minutes' => 'required|is_natural_no_zero|less_than[480]',
        'price'            => 'required|decimal',
        'is_active'        => 'in_list[0,1]',
    ];

    public function getWithCategory()
    {
        return $this->select('services.*, categories.name as category_name')
            ->join('categories', 'categories.id = services.category_id', 'left');
    }
}
