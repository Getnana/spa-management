<?php

namespace App\Models;

class BookingServiceModel extends BaseModel
{
    protected $table            = 'booking_services';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useTimestamps    = false;
    protected $allowedFields    = ['booking_id', 'service_id', 'created_at'];
    protected $validationRules  = [
        'booking_id' => 'required|is_natural_no_zero',
        'service_id' => 'required|is_natural_no_zero',
    ];

    public function syncServices(int $bookingId, array $serviceIds): void
    {
        $this->db->transStart();

        // Disable FK checks temporarily to allow hard delete of booking_services
        // even when referenced service has been soft-deleted
        $this->db->query('SET FOREIGN_KEY_CHECKS = 0');
        $this->where('booking_id', $bookingId)->delete();
        $this->db->query('SET FOREIGN_KEY_CHECKS = 1');

        foreach ($serviceIds as $serviceId) {
            $this->insert([
                'booking_id' => $bookingId,
                'service_id' => (int) $serviceId,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        $this->db->transComplete();
    }

    public function getServicesByBooking(int $bookingId): array
    {
        return $this->select('booking_services.*, services.name as service_name, services.duration_minutes, services.price')
            ->join('services', 'services.id = booking_services.service_id', 'left')
            ->where('booking_id', $bookingId)
            ->findAll();
    }
}
