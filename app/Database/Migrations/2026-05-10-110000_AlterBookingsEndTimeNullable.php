<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AlterBookingsEndTimeNullable extends Migration
{
    public function up()
    {
        $this->db->query('ALTER TABLE bookings MODIFY COLUMN end_time TIME NULL DEFAULT NULL');
    }

    public function down()
    {
        $this->db->query("ALTER TABLE bookings MODIFY COLUMN end_time TIME NOT NULL DEFAULT '00:00:00'");
    }
}
