<?php

namespace App\Models;

class BookingModel extends BaseModel
{
    protected $table            = 'bookings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = [
        'booking_code', 'customer_id', 'therapist_id', 'room_id', 'status',
        'booking_date', 'start_time', 'end_time', 'source', 'notes',
        'checked_in_at', 'checked_out_at', 'created_by', 'updated_by',
    ];
    protected $validationRules  = [
        'customer_id'  => 'required|is_natural_no_zero',
        'status'       => 'required|in_list[pending,confirmed,in_progress,awaiting_payment,completed,cancelled,no_show]',
        'booking_date' => 'required|valid_date',
        'start_time'   => 'required',
        'end_time'     => 'permit_empty',
        'source'       => 'required|in_list[walk_in,whatsapp,phone,online]',
    ];

    public function getWithDetails()
    {
        return $this->select('bookings.*, customers.name as customer_name, customers.phone as customer_phone,
            therapists.name as therapist_name, rooms.name as room_name,
            (SELECT GROUP_CONCAT(bs.service_id SEPARATOR ", ") FROM booking_services bs WHERE bs.booking_id = bookings.id) as service_ids,
            (SELECT GROUP_CONCAT(s2.name SEPARATOR ", ") FROM booking_services bs2 LEFT JOIN services s2 ON s2.id = bs2.service_id WHERE bs2.booking_id = bookings.id) as service_names,
            (SELECT COALESCE(SUM(s3.duration_minutes), 0) FROM booking_services bs3 LEFT JOIN services s3 ON s3.id = bs3.service_id WHERE bs3.booking_id = bookings.id) as total_duration,
            (SELECT COALESCE(SUM(s4.price), 0) FROM booking_services bs4 LEFT JOIN services s4 ON s4.id = bs4.service_id WHERE bs4.booking_id = bookings.id) as total_price')
            ->join('customers', 'customers.id = bookings.customer_id', 'left')
            ->join('therapists', 'therapists.id = bookings.therapist_id', 'left')
            ->join('rooms', 'rooms.id = bookings.room_id', 'left');
    }

    public function generateBookingCode(string $date): string
    {
        $prefix = 'BK-' . str_replace('-', '', $date) . '-';
        $lastBooking = $this->like('booking_code', $prefix, 'after')
            ->orderBy('id', 'DESC')
            ->first();

        $nextNum = 1;
        if ($lastBooking) {
            $codeNum = (int) substr(strrchr($lastBooking['booking_code'], '-'), 1);
            $nextNum = $codeNum + 1;
        }

        return $prefix . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
    }

    public function checkOverlap(int $therapistId, string $date, string $startTime, string $endTime, ?int $excludeId = null): bool
    {
        if (empty($endTime)) {
            return false;
        }

        $builder = $this->where('therapist_id', $therapistId)
            ->where('booking_date', $date)
            ->where('end_time IS NOT NULL', null, false)
            ->whereNotIn('status', ['cancelled', 'no_show', 'awaiting_payment', 'completed'])
            ->groupStart()
            ->where('start_time <', $endTime)
            ->where('end_time >', $startTime)
            ->groupEnd();

        if ($excludeId) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }
}
