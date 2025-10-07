<?php
// database/migrations/2025_10_07_071207_create_financial_reports_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFinancialReportsTable extends Migration
{
    public function up()
    {
        Schema::create('financial_reports', function (Blueprint $table) {
            $table->id('financial_report_id');

            // Report metadata
            $table->string('report_type', 50); // sales, rent, earnings, agent_performance, financial_summary
            $table->string('report_name');
            $table->date('report_date');
            $table->string('time_range', 50); // daily, weekly, monthly, quarterly, yearly, custom
            $table->date('start_date');
            $table->date('end_date');

            // Report data (JSON format for flexibility)
            $table->json('summary_data'); // Key metrics and totals
            $table->json('detailed_data')->nullable(); // Detailed breakdown
            $table->json('chart_data')->nullable(); // Data for charts

            // Generation info
            $table->foreignId('generated_by')->constrained('users');
            $table->boolean('is_auto_generated')->default(false);
            $table->string('format', 20)->default('json'); // json, csv, pdf

            // Access control
            $table->boolean('is_public')->default(false);
            $table->json('allowed_roles')->nullable(); // Which roles can access

            $table->timestamps();

            // Indexes
            $table->index(['report_type', 'report_date']);
            $table->index(['start_date', 'end_date']);
            $table->index(['generated_by', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('financial_reports');
    }
}
