<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateBookingServicesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'booking_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'service_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey(['booking_id', 'service_id']);
        $this->forge->addForeignKey('booking_id', 'bookings', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('service_id', 'services', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->createTable('booking_services');

        // Make service_id on bookings nullable since services are now in pivot table
        $this->forge->modifyColumn('bookings', [
            'service_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('booking_services');

        $this->forge->modifyColumn('bookings', [
            'service_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => false],
        ]);
    }
}
