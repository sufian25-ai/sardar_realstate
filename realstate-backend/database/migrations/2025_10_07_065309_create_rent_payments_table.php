<?php
// database/migrations/2025_10_07_065309_create_rent_payments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRentPaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('rent_payments', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->foreignId('rent_id')->constrained('rents', 'rid');
            $table->foreignId('property_id')->constrained('properties', 'pid');
            $table->foreignId('user_id')->constrained('users');

            // Payment details
            $table->decimal('amount_paid', 12, 2);
            $table->decimal('cumulative_amount', 12, 2);
            $table->decimal('due_amount', 12, 2);

            // Payment information
            $table->string('transaction_id', 100);
            $table->string('payment_method', 50)->default('bank');
            $table->text('payment_notes')->nullable();

            // Installment information
            $table->integer('installment_number');
            $table->date('due_date');
            $table->date('payment_date');

            // Status
            $table->enum('status', ['pending', 'paid', 'overdue', 'failed'])->default('pending');
            $table->enum('type', ['down_payment', 'installment', 'final_payment'])->default('installment');

            $table->timestamps();

            // Indexes
            $table->index(['rent_id', 'user_id']);
            $table->index(['property_id', 'status']);
            $table->index(['due_date', 'status']);
            $table->unique(['rent_id', 'installment_number']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('rent_payments');
    }
}
