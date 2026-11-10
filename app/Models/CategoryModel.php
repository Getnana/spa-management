<?php

namespace App\Models;

class CategoryModel extends BaseModel
{
    protected $table            = 'categories';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = ['name', 'description', 'is_active'];
    protected $validationRules  = [
        'name'      => 'required|min_length[2]|max_length[100]|is_unique[categories.name,id,{id}]',
        'is_active' => 'in_list[0,1]',
    ];
}
