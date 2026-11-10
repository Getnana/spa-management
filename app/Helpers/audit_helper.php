<?php

if (!function_exists('log_audit')) {
    function log_audit(string $action, string $tableName, int $recordId, ?array $oldValues = null, ?array $newValues = null): void
    {
        $session = session();
        $auditModel = new \App\Models\AuditLogModel();

        $auditModel->insert([
            'user_id'    => $session->get('user_id'),
            'user_name'  => $session->get('user_name'),
            'action'     => $action,
            'table_name' => $tableName,
            'record_id'  => $recordId,
            'old_values' => $oldValues ? json_encode($oldValues) : null,
            'new_values' => $newValues ? json_encode($newValues) : null,
            'ip_address' => service('request')->getIPAddress(),
            'user_agent' => service('request')->getUserAgent()->getAgentString(),
        ]);
    }
}

if (!function_exists('create_notification')) {
    function create_notification(int $userId, string $title, string $message, string $type = 'system', ?int $referenceId = null): void
    {
        $notifModel = new \App\Models\NotificationModel();
        $notifModel->insert([
            'user_id'      => $userId,
            'title'        => $title,
            'message'      => $message,
            'type'         => $type,
            'reference_id' => $referenceId,
        ]);
    }
}
