<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AlterTransactionsBookingIdNullable extends Migration
{
    public function up()
    {
        $this->forge->dropForeignKey('transactions', 'transactions_booking_id_foreign');
        $this->forge->modifyColumn('transactions', [
            'booking_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
        ]);
        $this->forge->addForeignKey('booking_id', 'bookings', 'id', 'SET NULL', 'SET NULL');
    }

    public function down()
    {
        $this->forge->dropForeignKey('transactions', 'transactions_booking_id_foreign');
        $this->forge->modifyColumn('transactions', [
            'booking_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => false],
        ]);
        $this->forge->addForeignKey('booking_id', 'bookings', 'id', 'RESTRICT', 'RESTRICT');
    }
}
