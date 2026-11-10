<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTherapistLeavesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'therapist_id' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'leave_date' => ['type' => 'DATE'],
            'reason' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'created_by' => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
            'deleted_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('therapist_id');
        $this->forge->addKey('leave_date');
        $this->forge->addForeignKey('therapist_id', 'therapists', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('created_by', 'users', 'id', 'RESTRICT', 'RESTRICT');
        $this->forge->addUniqueKey(['therapist_id', 'leave_date']);
        $this->forge->createTable('therapist_leaves');
    }

    public function down()
    {
        $this->forge->dropTable('therapist_leaves');
    }
}
