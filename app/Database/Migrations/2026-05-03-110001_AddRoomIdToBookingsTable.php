<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddRoomIdToBookingsTable extends Migration
{
    public function up()
    {
        $this->forge->addColumn('bookings', [
            'room_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
                'after'      => 'therapist_id',
            ],
        ]);

        $this->forge->addForeignKey('room_id', 'rooms', 'id', 'SET NULL', 'SET NULL');
    }

    public function down()
    {
        $this->forge->dropForeignKey('bookings', 'bookings_room_id_foreign');
        $this->forge->dropColumn('bookings', 'room_id');
    }
}
