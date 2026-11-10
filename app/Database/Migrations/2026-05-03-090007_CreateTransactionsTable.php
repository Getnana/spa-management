<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTransactionsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'transaction_code' => ['type' => 'VARCHAR', 'constraint' => 20],
            'booking_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'customer_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'staff_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'therapist_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'null' => true],
            'service_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'subtotal' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0.00],
            'discount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0.00],
            'total_amount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0.00],
            'payment_method' => ['type' => "ENUM('cash','transfer','qris','card','other')", 'default' => 'cash'],
            'payment_status' => ['type' => "ENUM('paid','unpaid','refunded')", 'default' => 'unpaid'],
            'commission_amount' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0.00],
            'net_revenue' => ['type' => 'DECIMAL', 'constraint' => '12,2', 'default' => 0.00],
            'paid_at' => ['type' => 'DATETIME', 'null' => true],
            'created_by' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('transaction_code');
        $this->forge->addKey('booking_id');
        $this->forge->addKey('customer_id');
        $this->forge->addKey('staff_id');
        $this->forge->addKey('therapist_id');
        $this->forge->addKey('payment_status');
        $this->forge->addForeignKey('booking_id', 'bookings', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('customer_id', 'customers', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('staff_id', 'users', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('therapist_id', 'therapists', 'id', 'SET NULL', 'SET NULL');
        $this->forge->addForeignKey('service_id', 'services', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addForeignKey('created_by', 'users', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->createTable('transactions');
    }

    public function down()
    {
        $this->forge->dropTable('transactions');
    }
}
