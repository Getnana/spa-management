<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTherapistsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 100],
            'phone' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'specialty' => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => true],
            'commission_rate' => ['type' => 'DECIMAL', 'constraint' => '5,2', 'default' => 0.00],
            'status' => ['type' => "ENUM('active','inactive','on_leave')", 'default' => 'active'],
            'avatar_path' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'notes' => ['type' => 'TEXT', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('status');
        $this->forge->addKey('name');
        $this->forge->createTable('therapists');
    }

    public function down()
    {
        $this->forge->dropTable('therapists');
    }
}
