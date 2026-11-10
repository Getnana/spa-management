<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddAwaitingPaymentToBookingsStatus extends Migration
{
    public function up()
    {
        $this->db->query("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','confirmed','in_progress','awaiting_payment','completed','cancelled','no_show') DEFAULT 'pending'");
    }

    public function down()
    {
        $this->db->query("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','confirmed','in_progress','completed','cancelled','no_show') DEFAULT 'pending'");
    }
}
