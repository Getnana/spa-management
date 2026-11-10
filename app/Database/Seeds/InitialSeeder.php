<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use App\Models\CategoryModel;
use App\Models\RoomModel;
use App\Models\TherapistModel;
use App\Models\TherapistScheduleModel;
use App\Models\UserModel;
use App\Models\ServiceModel;
use App\Models\CustomerModel;

class InitialSeeder extends Seeder
{
    public function run()
    {
        // Categories
        $catModel = new CategoryModel();
        if ($catModel->countAllResults() === 0) {
            $catModel->insertBatch([
                ['name' => 'Relaksasi', 'description' => 'Layanan pijat relaksasi untuk mengurangi stres', 'is_active' => 1],
                ['name' => 'Medis', 'description' => 'Layanan pijat terapi medis', 'is_active' => 1],
                ['name' => 'Kecantikan', 'description' => 'Layanan perawatan kecantikan', 'is_active' => 1],
            ]);
        }
        $categories = $catModel->findAll();
        $catIds = array_column($categories, 'id');

        // Therapist
        $therapistModel = new TherapistModel();
        $therapistId = null;
        if ($therapistModel->countAllResults() === 0) {
            $therapistModel->insert([
                'name' => 'Sari Dewi',
                'phone' => '081234567890',
                'specialty' => 'Pijat Relaksasi, Reflexology',
                'commission_rate' => 30.00,
                'status' => 'active',
            ]);
            $therapistId = $therapistModel->getInsertID();

            $scheduleModel = new TherapistScheduleModel();
            $schedules = [];
            for ($day = 1; $day <= 6; $day++) {
                $schedules[] = [
                    'therapist_id' => $therapistId,
                    'day_of_week' => $day,
                    'start_time' => '09:00:00',
                    'end_time' => '17:00:00',
                    'is_available' => 1,
                ];
            }
            $scheduleModel->insertBatch($schedules);
        } else {
            $therapistId = $therapistModel->first()['id'];
        }

        // Users
        $userModel = new UserModel();
        if ($userModel->countAllResults() === 0) {
            $users = [
                [
                    'username' => 'owner',
                    'email' => 'owner@spa.com',
                    'password' => password_hash('owner123', PASSWORD_DEFAULT),
                    'full_name' => 'Spa Owner',
                    'role' => 'owner',
                    'is_active' => 1,
                ],
                [
                    'username' => 'staff',
                    'email' => 'staff@spa.com',
                    'password' => password_hash('staff123', PASSWORD_DEFAULT),
                    'full_name' => 'Staff Resepsionis',
                    'role' => 'staff',
                    'is_active' => 1,
                ],
                [
                    'username' => 'sari',
                    'email' => 'sari@spa.com',
                    'password' => password_hash('therapist123', PASSWORD_DEFAULT),
                    'full_name' => 'Sari Dewi',
                    'role' => 'therapist',
                    'therapist_id' => $therapistId,
                    'is_active' => 1,
                ],
            ];
            foreach ($users as $user) {
                $userModel->insert($user);
            }
        }

        // Services
        $serviceModel = new ServiceModel();
        if ($serviceModel->countAllResults() === 0) {
            $serviceModel->insertBatch([
                ['name' => 'Pijat Relaksasi 60 min', 'category_id' => $catIds[0], 'description' => 'Pijat tubuh full relaksasi 60 menit', 'duration_minutes' => 60, 'price' => 150000.00, 'is_active' => 1],
                ['name' => 'Pijat Relaksasi 90 min', 'category_id' => $catIds[0], 'description' => 'Pijat tubuh full relaksasi 90 menit', 'duration_minutes' => 90, 'price' => 200000.00, 'is_active' => 1],
                ['name' => 'Reflexology 45 min', 'category_id' => $catIds[1], 'description' => 'Pijat refleksi kaki 45 menit', 'duration_minutes' => 45, 'price' => 100000.00, 'is_active' => 1],
                ['name' => 'Pijat Leher 30 min', 'category_id' => $catIds[1], 'description' => 'Pijat leher dan bahu 30 menit', 'duration_minutes' => 30, 'price' => 75000.00, 'is_active' => 1],
                ['name' => 'Facial Treatment', 'category_id' => $catIds[2], 'description' => 'Perawatan wajah 60 menit', 'duration_minutes' => 60, 'price' => 180000.00, 'is_active' => 1],
                ['name' => 'Body Scrub', 'category_id' => $catIds[2], 'description' => 'Lulur tubuh 60 menit', 'duration_minutes' => 60, 'price' => 165000.00, 'is_active' => 1],
            ]);
        }

        // Rooms
        $roomModel = new RoomModel();
        if ($roomModel->countAllResults() === 0) {
            $roomModel->insertBatch([
                ['name' => 'Ruang 1', 'status' => 'active'],
                ['name' => 'Ruang 2', 'status' => 'active'],
                ['name' => 'Ruang VIP', 'status' => 'active'],
                ['name' => 'Ruang Facial', 'status' => 'active'],
            ]);
        }

        // Sample customers
        $customerModel = new CustomerModel();
        if ($customerModel->countAllResults() === 0) {
            $customerModel->insertBatch([
                ['name' => 'Budi Santoso', 'phone' => '081111222333', 'email' => 'budi@email.com', 'notes' => 'Preferensi tekanan sedang', 'total_visits' => 3, 'loyalty_points' => 30, 'is_member' => 1],
                ['name' => 'Ani Wijaya', 'phone' => '082222333444', 'email' => 'ani@email.com', 'notes' => 'Alergi minyak lavender', 'total_visits' => 1, 'loyalty_points' => 10, 'is_member' => 0],
            ]);
        }

        echo "Initial data seeded successfully.\n";
        echo "Users: owner/owner123, staff/staff123, sari/therapist123\n";
    }
}
