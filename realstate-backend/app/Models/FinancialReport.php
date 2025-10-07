<?php
// app/Models/FinancialReport.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialReport extends Model
{
    use HasFactory;

    protected $table = 'financial_reports';
    protected $primaryKey = 'financial_report_id';

    protected $fillable = [
        'report_type',
        'report_name',
        'report_date',
        'time_range',
        'start_date',
        'end_date',
        'summary_data',
        'detailed_data',
        'chart_data',
        'generated_by',
        'is_auto_generated',
        'format',
        'is_public',
        'allowed_roles'
    ];

    protected $casts = [
        'report_date' => 'date',
        'start_date' => 'date',
        'end_date' => 'date',
        'summary_data' => 'array',
        'detailed_data' => 'array',
        'chart_data' => 'array',
        'allowed_roles' => 'array',
        'is_auto_generated' => 'boolean',
        'is_public' => 'boolean'
    ];

    // Relationships
    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    // Scopes
    public function scopeSalesReports($query)
    {
        return $query->where('report_type', 'sales');
    }

    public function scopeRentReports($query)
    {
        return $query->where('report_type', 'rent');
    }

    public function scopeEarningsReports($query)
    {
        return $query->where('report_type', 'earnings');
    }

    public function scopeAgentPerformanceReports($query)
    {
        return $query->where('report_type', 'agent_performance');
    }

    public function scopeFinancialSummaries($query)
    {
        return $query->where('report_type', 'financial_summary');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('report_date', [$startDate, $endDate]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('report_date', now()->month)
                    ->whereYear('report_date', now()->year);
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('report_date', now()->year);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    // Helper methods
    public function getReportTypeLabelAttribute()
    {
        $types = [
            'sales' => 'Sales Report',
            'rent' => 'Rent Report',
            'earnings' => 'Earnings Report',
            'agent_performance' => 'Agent Performance Report',
            'financial_summary' => 'Financial Summary Report'
        ];

        return $types[$this->report_type] ?? $this->report_type;
    }

    public function getTimeRangeLabelAttribute()
    {
        $ranges = [
            'daily' => 'Daily',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
            'quarterly' => 'Quarterly',
            'yearly' => 'Yearly',
            'custom' => 'Custom'
        ];

        return $ranges[$this->time_range] ?? $this->time_range;
    }

    public function canAccess($user)
    {
        if ($this->is_public) {
            return true;
        }

        if ($this->generated_by === $user->id) {
            return true;
        }

        if ($this->allowed_roles && in_array($user->role, $this->allowed_roles)) {
            return true;
        }

        return $user->role === 'admin';
    }

    public function getTotalRevenueAttribute()
    {
        return $this->summary_data['total_revenue'] ?? $this->summary_data['total_earnings'] ?? 0;
    }

    public function getTotalSalesAttribute()
    {
        return $this->summary_data['total_sales'] ?? $this->summary_data['sales_count'] ?? 0;
    }

    public function getTotalRentalsAttribute()
    {
        return $this->summary_data['total_rentals'] ?? $this->summary_data['rentals_count'] ?? 0;
    }
}
