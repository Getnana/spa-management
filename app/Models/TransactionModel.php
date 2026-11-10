<?php

namespace App\Models;

class TransactionModel extends BaseModel
{
    protected $table            = 'transactions';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $useSoftDeletes   = true;
    protected $allowedFields    = [
        'transaction_code', 'booking_id', 'customer_id', 'staff_id', 'therapist_id',
        'service_id', 'subtotal', 'discount', 'tax_amount', 'total_amount', 'payment_method',
        'payment_status', 'commission_amount', 'net_revenue', 'paid_at', 'created_by',
    ];
    protected $validationRules  = [
        'booking_id'     => 'permit_empty|is_natural_no_zero',
        'customer_id'    => 'required|is_natural_no_zero',
        'staff_id'       => 'required|is_natural_no_zero',
        'total_amount'   => 'required|decimal',
        'payment_method' => 'required|in_list[cash,transfer,qris,card,other]',
        'payment_status' => 'required|in_list[paid,unpaid,refunded]',
    ];

    public function getWithDetails()
    {
        return $this->select('transactions.*, customers.name as customer_name,
            services.name as service_name, therapists.name as therapist_name,
            therapists.commission_rate, staff.full_name as staff_name')
            ->join('customers', 'customers.id = transactions.customer_id', 'left')
            ->join('services', 'services.id = transactions.service_id', 'left')
            ->join('therapists', 'therapists.id = transactions.therapist_id', 'left')
            ->join('users as staff', 'staff.id = transactions.staff_id', 'left');
    }

    public function generateTransactionCode(): string
    {
        $prefix = 'TX-' . date('Ymd') . '-';
        $lastTx = $this->like('transaction_code', $prefix, 'after')
            ->orderBy('id', 'DESC')
            ->first();

        $nextNum = 1;
        if ($lastTx) {
            $codeNum = (int) substr(strrchr($lastTx['transaction_code'], '-'), 1);
            $nextNum = $codeNum + 1;
        }

        return $prefix . str_pad($nextNum, 4, '0', STR_PAD_LEFT);
    }
}
