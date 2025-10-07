<?php
// database/migrations/2025_10_07_064200_create_payments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties', 'pid');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('rent_id')->nullable()->constrained('rents', 'rid');

            // Payment details
            $table->decimal('amount_paid', 12, 2);
            $table->decimal('remaining_amount', 12, 2);
            $table->decimal('property_price', 12, 2);
            $table->decimal('installment_amount', 12, 2);

            // Interest and discount
            $table->string('interest_rate', 20)->default('0%');
            $table->decimal('amount_with_interest', 12, 2);
            $table->decimal('discount', 12, 2)->default(0);

            // Payment info
            $table->string('transaction_id', 100)->unique();
            $table->string('payment_method', 50)->default('bank');
            $table->text('payment_details')->nullable();

            // Status and dates
            $table->enum('status', ['pending', 'approved', 'failed', 'refunded'])->default('pending');
            $table->timestamp('payment_date')->useCurrent();
            $table->timestamp('approved_at')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['property_id', 'user_id']);
            $table->index(['status', 'payment_date']);
            $table->index('transaction_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
}
