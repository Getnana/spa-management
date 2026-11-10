<?php

namespace App\Models;

class TherapistModel extends BaseModel
{
    protected $table            = 'therapists';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = ['name', 'phone', 'specialty', 'commission_rate', 'status', 'avatar_path', 'notes'];
    protected $validationRules  = [
        'name'            => 'required|min_length[2]|max_length[100]',
        'phone'           => 'permit_empty|max_length[20]',
        'commission_rate' => 'required|decimal|greater_than_equal_to[0]|less_than_equal_to[100]',
        'status'          => 'required|in_list[active,inactive,on_leave]',
    ];

    public function getAverageRating(int $therapistId): float
    {
        $result = $this->db->table('ratings')
            ->selectAvg('rating')
            ->where('therapist_id', $therapistId)
            ->get()
            ->getRow();

        return $result ? (float) $result->rating : 0.0;
    }
}
