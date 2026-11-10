<?php

namespace App\Models;

class SettingsModel extends BaseModel
{
    protected $table            = 'settings';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = false;
    protected $allowedFields    = ['key', 'value'];
    protected $validationRules  = [
        'key'   => 'required|max_length[100]',
        'value' => 'permit_empty|max_length[500]',
    ];

    public function getValue(string $key, $default = null)
    {
        $row = $this->where('key', $key)->first();
        return $row ? $row['value'] : $default;
    }

    public function setValue(string $key, string $value): bool
    {
        $existing = $this->where('key', $key)->first();
        if ($existing) {
            return $this->update($existing['id'], ['value' => $value]);
        }
        return $this->insert(['key' => $key, 'value' => $value]) !== false;
    }

    public function getAll(): array
    {
        $rows = $this->findAll();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['key']] = $row['value'];
        }
        return $settings;
    }
}
