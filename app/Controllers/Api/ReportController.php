<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\Database\Exceptions\DatabaseException;
use App\Models\TransactionModel;
use App\Models\BookingModel;
use App\Models\RatingModel;
use App\Models\TherapistModel;

class ReportController extends ResourceController
{
    protected $format = 'json';

    protected function getJsonInput()
    {
        return $this->request->getJSON(true) ?? $this->request->getPost();
    }

    public function revenue()
    {
        $db = \Config\Database::connect();
        $startDate = $this->request->getGet('start_date') ?? date('Y-m-01');
        $endDate = $this->request->getGet('end_date') ?? date('Y-m-d');
        $period = $this->request->getGet('period') ?? 'daily';

        // Summary
        $summary = $db->table('transactions')
            ->select('
                COALESCE(SUM(total_amount), 0) as total_gross,
                COALESCE(SUM(net_revenue), 0) as total_net,
                COALESCE(SUM(commission_amount), 0) as total_commission,
                COALESCE(SUM(tax_amount), 0) as total_tax,
                COUNT(*) as transaction_count
            ')
            ->where('payment_status', 'paid')
            ->where('DATE(paid_at) >=', $startDate)
            ->where('DATE(paid_at) <=', $endDate)
            ->get()
            ->getRow();

        // Data points based on period
        $dataPoints = [];
        $current = strtotime($startDate);
        $end = strtotime($endDate);

        while ($current <= $end) {
            if ($period === 'daily') {
                $day = date('Y-m-d', $current);
                $label = date('d M Y', $current);
                $next = strtotime('+1 day', $current);

                $row = $db->table('transactions')
                    ->select('COALESCE(SUM(total_amount), 0) as gross, COALESCE(SUM(net_revenue), 0) as net, COALESCE(SUM(commission_amount), 0) as commission, COALESCE(SUM(tax_amount), 0) as tax, COUNT(*) as tx_count')
                    ->where('payment_status', 'paid')
                    ->where('DATE(paid_at)', $day)
                    ->get()
                    ->getRow();

                $dataPoints[] = [
                    'label'             => $label,
                    'gross_revenue'     => (float) $row->gross,
                    'net_revenue'       => (float) $row->net,
                    'commission'        => (float) $row->commission,
                    'tax'               => (float) $row->tax,
                    'transaction_count' => (int) $row->tx_count,
                ];
                $current = $next;
            } elseif ($period === 'weekly') {
                $weekStart = date('Y-m-d', $current);
                $weekEnd = date('Y-m-d', min(strtotime('+6 days', $current), $end));
                $label = date('d M', $current) . ' - ' . date('d M', strtotime($weekEnd));
                $next = strtotime('+7 days', $current);

                $row = $db->table('transactions')
                    ->select('COALESCE(SUM(total_amount), 0) as gross, COALESCE(SUM(net_revenue), 0) as net, COALESCE(SUM(commission_amount), 0) as commission, COALESCE(SUM(tax_amount), 0) as tax, COUNT(*) as tx_count')
                    ->where('payment_status', 'paid')
                    ->where('DATE(paid_at) >=', $weekStart)
                    ->where('DATE(paid_at) <=', $weekEnd)
                    ->get()
                    ->getRow();

                $dataPoints[] = [
                    'label'             => $label,
                    'gross_revenue'     => (float) $row->gross,
                    'net_revenue'       => (float) $row->net,
                    'commission'        => (float) $row->commission,
                    'tax'               => (float) $row->tax,
                    'transaction_count' => (int) $row->tx_count,
                ];
                $current = $next;
            } elseif ($period === 'monthly') {
                $month = date('Y-m', $current);
                $label = date('M Y', $current);
                $monthStartDay = date('Y-m-01', $current);
                $monthEndDay = date('Y-m-t', $current);
                $next = strtotime('+1 month', $current);

                $row = $db->table('transactions')
                    ->select('COALESCE(SUM(total_amount), 0) as gross, COALESCE(SUM(net_revenue), 0) as net, COALESCE(SUM(commission_amount), 0) as commission, COALESCE(SUM(tax_amount), 0) as tax, COUNT(*) as tx_count')
                    ->where('payment_status', 'paid')
                    ->where('DATE(paid_at) >=', $monthStartDay)
                    ->where('DATE(paid_at) <=', $monthEndDay)
                    ->get()
                    ->getRow();

                $dataPoints[] = [
                    'label'             => $label,
                    'gross_revenue'     => (float) $row->gross,
                    'net_revenue'       => (float) $row->net,
                    'commission'        => (float) $row->commission,
                    'tax'               => (float) $row->tax,
                    'transaction_count' => (int) $row->tx_count,
                ];
                $current = $next;
            }
        }

        // Monthly comparison
        $comparison = null;
        if ($period === 'monthly') {
            $startMonth = date('Y-m', strtotime($startDate));
            $endMonth = date('Y-m', strtotime($endDate));
            if ($startMonth !== $endMonth) {
                // Current period summary
                $currentRow = $db->table('transactions')
                    ->select('COALESCE(SUM(total_amount), 0) as total_gross, COALESCE(SUM(net_revenue), 0) as total_net')
                    ->where('payment_status', 'paid')
                    ->where('DATE(paid_at) >=', $startDate)
                    ->where('DATE(paid_at) <=', $endDate)
                    ->get()
                    ->getRow();

                // Previous period (same duration shifted back)
                $daysDiff = (strtotime($endDate) - strtotime($startDate)) / (60 * 60 * 24) + 1;
                $prevEnd = date('Y-m-d', strtotime('-1 day', strtotime($startDate)));
                $prevStart = date('Y-m-d', strtotime("-{$daysDiff} days", strtotime($startDate)));

                $prevRow = $db->table('transactions')
                    ->select('COALESCE(SUM(total_amount), 0) as total_gross, COALESCE(SUM(net_revenue), 0) as total_net')
                    ->where('payment_status', 'paid')
                    ->where('DATE(paid_at) >=', $prevStart)
                    ->where('DATE(paid_at) <=', $prevEnd)
                    ->get()
                    ->getRow();

                $comparison = [
                    'current_period' => [
                        'start_date' => $startDate,
                        'end_date'   => $endDate,
                        'gross'      => (float) $currentRow->total_gross,
                        'net'        => (float) $currentRow->total_net,
                    ],
                    'previous_period' => [
                        'start_date' => $prevStart,
                        'end_date'   => $prevEnd,
                        'gross'      => (float) $prevRow->total_gross,
                        'net'        => (float) $prevRow->total_net,
                    ],
                    'change' => [
                        'gross' => $prevRow->total_gross > 0
                            ? round(((float) $currentRow->total_gross - (float) $prevRow->total_gross) / (float) $prevRow->total_gross * 100, 2)
                            : null,
                        'net' => $prevRow->total_net > 0
                            ? round(((float) $currentRow->total_net - (float) $prevRow->total_net) / (float) $prevRow->total_net * 100, 2)
                            : null,
                    ],
                ];
            }
        }

        $result = [
            'summary'    => [
                'total_gross'      => (float) $summary->total_gross,
                'total_net'        => (float) $summary->total_net,
                'total_commission' => (float) $summary->total_commission,
                'total_tax'        => (float) $summary->total_tax,
                'transaction_count' => (int) $summary->transaction_count,
            ],
            'data'       => $dataPoints,
        ];

        if ($comparison !== null) {
            $result['comparison'] = $comparison;
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Revenue report retrieved.',
            'data'    => $result,
        ]);
    }

    public function transactions()
    {
        $db = \Config\Database::connect();
        $startDate = $this->request->getGet('start_date');
        $endDate = $this->request->getGet('end_date');
        $status = $this->request->getGet('status');
        $paymentMethod = $this->request->getGet('payment_method');
        $page = (int) ($this->request->getGet('page') ?? 1);
        $perPage = (int) ($this->request->getGet('per_page') ?? 15);

        $builder = $db->table('transactions')
            ->select('transactions.*, customers.name as customer_name,
                therapists.name as therapist_name, staff.full_name as staff_name')
            ->join('customers', 'customers.id = transactions.customer_id', 'left')
            ->join('therapists', 'therapists.id = transactions.therapist_id', 'left')
            ->join('users as staff', 'staff.id = transactions.staff_id', 'left')
            ->where('transactions.deleted_at IS NULL', null, false);

        if ($startDate) {
            $builder->where('DATE(transactions.paid_at) >=', $startDate);
        }
        if ($endDate) {
            $builder->where('DATE(transactions.paid_at) <=', $endDate);
        }
        if ($status) {
            $builder->where('transactions.payment_status', $status);
        }
        if ($paymentMethod) {
            $builder->where('transactions.payment_method', $paymentMethod);
        }

        // Summary stats
        $summaryBuilder = clone $builder;
        $summaryRow = $summaryBuilder
            ->select('COALESCE(SUM(transactions.total_amount), 0) as total,
                COALESCE(AVG(transactions.total_amount), 0) as average,
                COALESCE(MIN(transactions.total_amount), 0) as min_amount,
                COALESCE(MAX(transactions.total_amount), 0) as max_amount,
                COALESCE(SUM(transactions.tax_amount), 0) as total_tax,
                COUNT(*) as count')
            ->get()
            ->getRow();

        // Paginated data
        $offset = ($page - 1) * $perPage;
        $results = $builder->orderBy('transactions.paid_at', 'DESC')
            ->limit($perPage, $offset)
            ->get()
            ->getResultArray();

        $totalRecords = $db->table('transactions')
            ->where('deleted_at', null)
            ->countAllResults();

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Transaction report retrieved.',
            'data'    => [
                'summary' => [
                    'total'     => (float) $summaryRow->total,
                    'average'   => (float) $summaryRow->average,
                    'min'       => (float) $summaryRow->min_amount,
                    'max'       => (float) $summaryRow->max_amount,
                    'total_tax' => (float) $summaryRow->total_tax,
                    'count'     => (int) $summaryRow->count,
                ],
                'transactions' => $results,
                'pagination'   => [
                    'page'       => $page,
                    'per_page'   => $perPage,
                    'total'      => (int) $summaryRow->count,
                    'total_pages' => (int) ceil((int) $summaryRow->count / $perPage),
                ],
            ],
        ]);
    }

    public function therapistPerformance()
    {
        $db = \Config\Database::connect();
        $startDate = $this->request->getGet('start_date') ?? date('Y-m-01');
        $endDate = $this->request->getGet('end_date') ?? date('Y-m-d');
        $therapistId = $this->request->getGet('therapist_id');

        $builder = $db->table('therapists t')
            ->select('t.id, t.name, t.specialty, t.commission_rate')
            ->where('t.deleted_at', null);

        if ($therapistId) {
            $builder->where('t.id', $therapistId);
        }

        $therapists = $builder->get()->getResultArray();

        $performance = [];
        foreach ($therapists as $therapist) {
            $tid = $therapist['id'];

            // Services handled (completed bookings)
            $servicesHandled = $db->table('bookings')
                ->where('therapist_id', $tid)
                ->where('booking_date >=', $startDate)
                ->where('booking_date <=', $endDate)
                ->where('status', 'completed')
                ->where('deleted_at', null)
                ->countAllResults();

            // Total bookings in range (for completion rate)
            $totalBookings = $db->table('bookings')
                ->where('therapist_id', $tid)
                ->where('booking_date >=', $startDate)
                ->where('booking_date <=', $endDate)
                ->whereNotIn('status', ['cancelled'])
                ->where('deleted_at', null)
                ->countAllResults();

            // Hours worked: sum of service durations for completed bookings
            $hoursRow = $db->table('bookings b')
                ->select('COALESCE(SUM(s.duration_minutes), 0) as total_minutes')
                ->join('booking_services bs', 'bs.booking_id = b.id')
                ->join('services s', 's.id = bs.service_id')
                ->where('b.therapist_id', $tid)
                ->where('b.booking_date >=', $startDate)
                ->where('b.booking_date <=', $endDate)
                ->where('b.status', 'completed')
                ->where('b.deleted_at', null)
                ->get()
                ->getRow();

            $hoursWorked = round((float) $hoursRow->total_minutes / 60, 2);

            // Revenue generated
            $revenueRow = $db->table('transactions')
                ->select('COALESCE(SUM(total_amount), 0) as revenue, COALESCE(SUM(commission_amount), 0) as commission, COALESCE(SUM(tax_amount), 0) as tax')
                ->where('therapist_id', $tid)
                ->where('payment_status', 'paid')
                ->where('DATE(paid_at) >=', $startDate)
                ->where('DATE(paid_at) <=', $endDate)
                ->where('deleted_at', null)
                ->get()
                ->getRow();

            // Average rating
            $ratingRow = $db->table('ratings')
                ->selectAvg('rating', 'avg_rating')
                ->where('therapist_id', $tid)
                ->where('rated_at >=', $startDate . ' 00:00:00')
                ->where('rated_at <=', $endDate . ' 23:59:59')
                ->get()
                ->getRow();

            $avgRating = $ratingRow ? round((float) $ratingRow->avg_rating, 1) : 0.0;

            // Completion rate
            $completionRate = $totalBookings > 0
                ? round(($servicesHandled / $totalBookings) * 100, 1)
                : 0.0;

            $performance[] = [
                'therapist_id'      => $tid,
                'name'              => $therapist['name'],
                'specialty'         => $therapist['specialty'],
                'commission_rate'   => (float) $therapist['commission_rate'],
                'services_handled'  => $servicesHandled,
                'hours_worked'      => $hoursWorked,
                'revenue_generated' => (float) $revenueRow->revenue,
                'commission_earned' => (float) $revenueRow->commission,
                'tax'               => (float) $revenueRow->tax,
                'avg_rating'        => $avgRating,
                'completion_rate'   => $completionRate,
            ];
        }

        // Sort by revenue desc
        usort($performance, fn($a, $b) => $b['revenue_generated'] <=> $a['revenue_generated']);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Therapist performance report retrieved.',
            'data'    => $performance,
        ]);
    }

    public function exportPdf($type = 'revenue')
    {
        if (!in_array($type, ['revenue', 'transactions', 'therapist', 'therapist-performance'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Invalid report type.',
            ])->setStatusCode(400);
        }

        $startDate = $this->request->getGet('start_date') ?? date('Y-m-01');
        $endDate = $this->request->getGet('end_date') ?? date('Y-m-d');

        $typeKey = ($type === 'therapist-performance') ? 'therapist' : $type;

        if ($typeKey === 'revenue') {
            $data = $this->_getRevenueData($startDate, $endDate);
            $html = $this->_renderRevenuePdf($data, $startDate, $endDate);
        } elseif ($typeKey === 'transactions') {
            $data = $this->_getTransactionData($startDate, $endDate);
            $html = $this->_renderTransactionPdf($data, $startDate, $endDate);
        } else {
            $data = $this->_getTherapistData($startDate, $endDate);
            $html = $this->_renderTherapistPdf($data, $startDate, $endDate);
        }

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        $filename = "{$type}_report_{$startDate}_to_{$endDate}.pdf";

        return $this->response
            ->setHeader('Content-Type', 'application/pdf')
            ->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
            ->setBody($dompdf->output());
    }

    public function exportExcel($type = 'revenue')
    {
        if (!in_array($type, ['revenue', 'transactions', 'therapist', 'therapist-performance'])) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Invalid report type.',
            ])->setStatusCode(400);
        }

        $startDate = $this->request->getGet('start_date') ?? date('Y-m-01');
        $endDate = $this->request->getGet('end_date') ?? date('Y-m-d');

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $typeKey = ($type === 'therapist-performance') ? 'therapist' : $type;

        if ($typeKey === 'revenue') {
            $this->_buildRevenueSheet($sheet, $startDate, $endDate);
        } elseif ($typeKey === 'transactions') {
            $this->_buildTransactionSheet($sheet, $startDate, $endDate);
        } else {
            $this->_buildTherapistSheet($sheet, $startDate, $endDate);
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $filename = WRITEPATH . "uploads/{$type}_report_{$startDate}_to_{$endDate}.xlsx";

        if (!is_dir(WRITEPATH . 'uploads')) {
            mkdir(WRITEPATH . 'uploads', 0777, true);
        }

        $writer->save($filename);

        return $this->response
            ->setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->setHeader('Content-Disposition', 'attachment; filename="' . basename($filename) . '"')
            ->setBody(file_get_contents($filename));
    }

    // --- Private helpers for PDF ---

    private function _getRevenueData($startDate, $endDate)
    {
        $db = \Config\Database::connect();
        return $db->table('transactions')
            ->select("DATE(paid_at) as date, SUM(total_amount) as gross, SUM(net_revenue) as net, SUM(commission_amount) as commission, SUM(tax_amount) as tax, COUNT(*) as tx_count")
            ->where('payment_status', 'paid')
            ->where('DATE(paid_at) >=', $startDate)
            ->where('DATE(paid_at) <=', $endDate)
            ->groupBy('DATE(paid_at)')
            ->orderBy('date', 'ASC')
            ->get()
            ->getResultArray();
    }

    private function _getTransactionData($startDate, $endDate)
    {
        $db = \Config\Database::connect();
        return $db->table('transactions')
            ->select('transactions.transaction_code, transactions.paid_at, customers.name as customer_name, therapists.name as therapist_name,
                transactions.total_amount, transactions.payment_method, transactions.payment_status,
                transactions.tax_amount, transactions.commission_amount, transactions.net_revenue')
            ->join('customers', 'customers.id = transactions.customer_id', 'left')
            ->join('therapists', 'therapists.id = transactions.therapist_id', 'left')
            ->where('transactions.deleted_at', null)
            ->where('DATE(transactions.paid_at) >=', $startDate)
            ->where('DATE(transactions.paid_at) <=', $endDate)
            ->orderBy('transactions.paid_at', 'DESC')
            ->get()
            ->getResultArray();
    }

    private function _getTherapistData($startDate, $endDate)
    {
        $db = \Config\Database::connect();
        $therapists = $db->table('therapists')
            ->select('id, name, specialty, commission_rate')
            ->where('deleted_at', null)
            ->get()
            ->getResultArray();

        $result = [];
        foreach ($therapists as $t) {
            $completed = $db->table('bookings')
                ->where('therapist_id', $t['id'])
                ->where('booking_date >=', $startDate)
                ->where('booking_date <=', $endDate)
                ->where('status', 'completed')
                ->where('deleted_at', null)
                ->countAllResults();

            $hoursRow = $db->table('bookings b')
                ->select('COALESCE(SUM(s.duration_minutes), 0) as total_minutes')
                ->join('booking_services bs', 'bs.booking_id = b.id')
                ->join('services s', 's.id = bs.service_id')
                ->where('b.therapist_id', $t['id'])
                ->where('b.booking_date >=', $startDate)
                ->where('b.booking_date <=', $endDate)
                ->where('b.status', 'completed')
                ->where('b.deleted_at', null)
                ->get()
                ->getRow();

            $revRow = $db->table('transactions')
                ->select('COALESCE(SUM(total_amount), 0) as revenue, COALESCE(SUM(commission_amount), 0) as commission, COALESCE(SUM(tax_amount), 0) as tax')
                ->where('therapist_id', $t['id'])
                ->where('payment_status', 'paid')
                ->where('DATE(paid_at) >=', $startDate)
                ->where('DATE(paid_at) <=', $endDate)
                ->where('deleted_at', null)
                ->get()->getRow();

            $result[] = [
                'name'             => $t['name'],
                'services_handled' => $completed,
                'hours_worked'     => round((float) $hoursRow->total_minutes / 60, 2),
                'revenue'          => (float) $revRow->revenue,
                'commission'       => (float) $revRow->commission,
                'tax'              => (float) $revRow->tax,
            ];
        }
        return $result;
    }

    private function _renderRevenuePdf($data, $startDate, $endDate)
    {
        $rows = '';
        $totalGross = 0;
        $totalNet = 0;
        $totalTax = 0;
        foreach ($data as $row) {
            $totalGross += $row['gross'];
            $totalNet += $row['net'];
            $totalTax += $row['tax'];
            $rows .= '<tr>
                <td>' . esc($row['date']) . '</td>
                <td>' . number_format($row['tx_count']) . '</td>
                <td>Rp ' . number_format($row['gross'], 0, ',', '.') . '</td>
                <td>Rp ' . number_format($row['tax'], 0, ',', '.') . '</td>
                <td>Rp ' . number_format($row['net'], 0, ',', '.') . '</td>
                <td>Rp ' . number_format($row['commission'], 0, ',', '.') . '</td>
            </tr>';
        }
        $rows .= '<tr style="font-weight:bold; background:#f0f0f0;">
            <td>TOTAL</td>
            <td>-</td>
            <td>Rp ' . number_format($totalGross, 0, ',', '.') . '</td>
            <td>Rp ' . number_format($totalTax, 0, ',', '.') . '</td>
            <td>Rp ' . number_format($totalNet, 0, ',', '.') . '</td>
            <td>-</td>
        </tr>';

        return '<html><head><style>
            body{font-family:Arial,sans-serif;font-size:12px}
            h2{text-align:center;margin-bottom:5px}
            .subtitle{text-align:center;color:#666;margin-bottom:20px}
            table{width:100%;border-collapse:collapse}
            th,td{border:1px solid #ddd;padding:8px;text-align:left}
            th{background:#4CAF50;color:white}
        </style></head><body>
        <h2>Laporan Revenue</h2>
        <p class="subtitle">Periode: ' . esc($startDate) . ' s/d ' . esc($endDate) . '</p>
        <table>
            <tr><th>Tanggal</th><th>Transaksi</th><th>Gross Revenue</th><th>Pajak</th><th>Net Revenue</th><th>Komisi</th></tr>
            ' . $rows . '
        </table></body></html>';
    }

    private function _renderTransactionPdf($data, $startDate, $endDate)
    {
        $rows = '';
        foreach ($data as $row) {
            $rows .= '<tr>
                <td>' . esc($row['transaction_code']) . '</td>
                <td>' . esc($row['paid_at']) . '</td>
                <td>' . esc($row['customer_name']) . '</td>
                <td>' . esc($row['therapist_name']) . '</td>
                <td>Rp ' . number_format($row['total_amount'], 0, ',', '.') . '</td>
                <td>Rp ' . number_format($row['tax_amount'], 0, ',', '.') . '</td>
                <td>' . esc($row['payment_method']) . '</td>
                <td>' . esc($row['payment_status']) . '</td>
            </tr>';
        }

        return '<html><head><style>
            body{font-family:Arial,sans-serif;font-size:11px}
            h2{text-align:center;margin-bottom:5px}
            .subtitle{text-align:center;color:#666;margin-bottom:20px}
            table{width:100%;border-collapse:collapse}
            th,td{border:1px solid #ddd;padding:6px;text-align:left}
            th{background:#2196F3;color:white}
        </style></head><body>
        <h2>Laporan Transaksi</h2>
        <p class="subtitle">Periode: ' . esc($startDate) . ' s/d ' . esc($endDate) . '</p>
        <table>
            <tr><th>Kode</th><th>Tanggal</th><th>Pelanggan</th><th>Terapis</th><th>Total</th><th>Pajak</th><th>Metode</th><th>Status</th></tr>
            ' . $rows . '
        </table></body></html>';
    }

    private function _renderTherapistPdf($data, $startDate, $endDate)
    {
        $rows = '';
        foreach ($data as $row) {
            $rows .= '<tr>
                <td>' . esc($row['name']) . '</td>
                <td>' . $row['services_handled'] . '</td>
                <td>' . $row['hours_worked'] . ' jam</td>
                <td>Rp ' . number_format($row['revenue'], 0, ',', '.') . '</td>
                <td>Rp ' . number_format($row['tax'], 0, ',', '.') . '</td>
                <td>Rp ' . number_format($row['commission'], 0, ',', '.') . '</td>
            </tr>';
        }

        return '<html><head><style>
            body{font-family:Arial,sans-serif;font-size:12px}
            h2{text-align:center;margin-bottom:5px}
            .subtitle{text-align:center;color:#666;margin-bottom:20px}
            table{width:100%;border-collapse:collapse}
            th,td{border:1px solid #ddd;padding:8px;text-align:left}
            th{background:#FF9800;color:white}
        </style></head><body>
        <h2>Laporan Kinerja Terapis</h2>
        <p class="subtitle">Periode: ' . esc($startDate) . ' s/d ' . esc($endDate) . '</p>
        <table>
            <tr><th>Nama Terapis</th><th>Layanan Ditangani</th><th>Jam Kerja</th><th>Revenue</th><th>Pajak</th><th>Komisi</th></tr>
            ' . $rows . '
        </table></body></html>';
    }

    // --- Private helpers for Excel ---

    private function _buildRevenueSheet($sheet, $startDate, $endDate)
    {
        $data = $this->_getRevenueData($startDate, $endDate);
        $sheet->setCellValue('A1', 'Laporan Revenue');
        $sheet->setCellValue('A2', 'Periode: ' . $startDate . ' s/d ' . $endDate);
        $sheet->setCellValue('A4', 'Tanggal');
        $sheet->setCellValue('B4', 'Jumlah Transaksi');
        $sheet->setCellValue('C4', 'Gross Revenue');
        $sheet->setCellValue('D4', 'Pajak');
        $sheet->setCellValue('E4', 'Net Revenue');
        $sheet->setCellValue('F4', 'Komisi');

        $row = 5;
        foreach ($data as $item) {
            $sheet->setCellValue('A' . $row, $item['date']);
            $sheet->setCellValue('B' . $row, $item['tx_count']);
            $sheet->setCellValue('C' . $row, $item['gross']);
            $sheet->setCellValue('D' . $row, $item['tax']);
            $sheet->setCellValue('E' . $row, $item['net']);
            $sheet->setCellValue('F' . $row, $item['commission']);
            $row++;
        }
    }

    private function _buildTransactionSheet($sheet, $startDate, $endDate)
    {
        $data = $this->_getTransactionData($startDate, $endDate);
        $sheet->setCellValue('A1', 'Laporan Transaksi');
        $sheet->setCellValue('A2', 'Periode: ' . $startDate . ' s/d ' . $endDate);
        $sheet->setCellValue('A4', 'Kode');
        $sheet->setCellValue('B4', 'Tanggal');
        $sheet->setCellValue('C4', 'Pelanggan');
        $sheet->setCellValue('D4', 'Terapis');
        $sheet->setCellValue('E4', 'Total');
        $sheet->setCellValue('F4', 'Pajak');
        $sheet->setCellValue('G4', 'Metode Pembayaran');
        $sheet->setCellValue('H4', 'Status');

        $row = 5;
        foreach ($data as $item) {
            $sheet->setCellValue('A' . $row, $item['transaction_code']);
            $sheet->setCellValue('B' . $row, $item['paid_at']);
            $sheet->setCellValue('C' . $row, $item['customer_name']);
            $sheet->setCellValue('D' . $row, $item['therapist_name']);
            $sheet->setCellValue('E' . $row, $item['total_amount']);
            $sheet->setCellValue('F' . $row, $item['tax_amount']);
            $sheet->setCellValue('G' . $row, $item['payment_method']);
            $sheet->setCellValue('H' . $row, $item['payment_status']);
            $row++;
        }
    }

    private function _buildTherapistSheet($sheet, $startDate, $endDate)
    {
        $data = $this->_getTherapistData($startDate, $endDate);
        $sheet->setCellValue('A1', 'Laporan Kinerja Terapis');
        $sheet->setCellValue('A2', 'Periode: ' . $startDate . ' s/d ' . $endDate);
        $sheet->setCellValue('A4', 'Nama Terapis');
        $sheet->setCellValue('B4', 'Layanan Ditangani');
        $sheet->setCellValue('C4', 'Jam Kerja');
        $sheet->setCellValue('D4', 'Revenue');
        $sheet->setCellValue('E4', 'Pajak');
        $sheet->setCellValue('F4', 'Komisi');

        $row = 5;
        foreach ($data as $item) {
            $sheet->setCellValue('A' . $row, $item['name']);
            $sheet->setCellValue('B' . $row, $item['services_handled']);
            $sheet->setCellValue('C' . $row, $item['hours_worked']);
            $sheet->setCellValue('D' . $row, $item['revenue']);
            $sheet->setCellValue('E' . $row, $item['tax']);
            $sheet->setCellValue('F' . $row, $item['commission']);
            $row++;
        }
    }
}
