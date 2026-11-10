<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddTaxToSettingsAndTransactions extends Migration
{
    public function up()
    {
        // Add tax_amount column to transactions
        $this->forge->addColumn('transactions', [
            'tax_amount' => [
                'type' => 'DECIMAL',
                'constraint' => '12,2',
                'null' => true,
                'after' => 'discount',
            ],
        ]);

        // Insert tax settings
        $this->db->table('settings')->insertBatch([
            ['key' => 'tax_enabled', 'value' => '0', 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')],
            ['key' => 'tax_rate', 'value' => '0', 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')],
            ['key' => 'tax_label', 'value' => 'Pajak', 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')],
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('transactions', 'tax_amount');
        $this->db->table('settings')->whereIn('key', ['tax_enabled', 'tax_rate', 'tax_label'])->delete();
    }
}
