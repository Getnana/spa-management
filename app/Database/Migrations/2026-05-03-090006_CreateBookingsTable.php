<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBookingsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'booking_code' => ['type' => 'VARCHAR', 'constraint' => 20],
            'customer_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'therapist_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'service_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'status' => ['type' => "ENUM('pending','confirmed','in_progress','completed','cancelled','no_show')", 'default' => 'pending'],
            'booking_date' => ['type' => 'DATE'],
            'start_time' => ['type' => 'TIME'],
            'end_time' => ['type' => 'TIME'],
            'source' => ['type' => "ENUM('walk_in','whatsapp','phone','online')", 'default' => 'walk_in'],
            'notes' => ['type' => 'TEXT', 'null' => true],
            'checked_in_at' => ['type' => 'DATETIME', 'null' => true],
            'checked_out_at' => ['type' => 'DATETIME', 'null' => true],
            'created_by' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'updated_by' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('booking_code');
        $this->forge->addKey('customer_id');
        $this->forge->addKey('therapist_id');
        $this->forge->addKey('service_id');
        $this->forge->addKey('status');
        $this->forge->addKey('booking_date');
        $this->forge->addKey('source');
        $this->forge->addForeignKey('customer_id', 'customers', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('therapist_id', 'therapists', 'id', 'SET NULL', 'SET NULL');
        $this->forge->addForeignKey('service_id', 'services', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('created_by', 'users', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('updated_by', 'users', 'id', 'SET NULL', 'SET NULL');
        $this->forge->createTable('bookings');
    }

    public function down()
    {
        $this->forge->dropTable('bookings');
    }
}
