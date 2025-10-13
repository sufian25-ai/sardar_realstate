<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop user_orders table - redundant with payments table
        Schema::dropIfExists('user_orders');
        
        // Drop user_properties table - can be derived from payments
        Schema::dropIfExists('user_properties');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate user_orders table if needed to rollback
        Schema::create('user_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained('properties', 'pid')->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
            $table->enum('order_type', ['purchase', 'rent', 'inquiry'])->default('inquiry');
            $table->text('notes')->nullable();
            $table->json('payment_details')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // Recreate user_properties table if needed to rollback
        Schema::create('user_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained('properties', 'pid')->onDelete('cascade');
            $table->enum('ownership_type', ['owned', 'rented', 'pending', 'sold'])->default('owned');
            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->date('lease_start_date')->nullable();
            $table->date('lease_end_date')->nullable();
            $table->decimal('monthly_rent', 10, 2)->nullable();
            $table->text('ownership_notes')->nullable();
            $table->json('documents')->nullable();
            $table->timestamps();
        });
    }
};
