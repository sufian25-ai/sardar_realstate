<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add default values to required fields in payments table
        DB::statement("ALTER TABLE payments MODIFY COLUMN remaining_amount DECIMAL(12,2) DEFAULT 0");
        DB::statement("ALTER TABLE payments MODIFY COLUMN property_price DECIMAL(12,2) DEFAULT 0");
        DB::statement("ALTER TABLE payments MODIFY COLUMN amount_with_interest DECIMAL(12,2) DEFAULT 0");
        DB::statement("ALTER TABLE payments MODIFY COLUMN installment_amount DECIMAL(12,2) DEFAULT 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to no default values
        DB::statement("ALTER TABLE payments MODIFY COLUMN remaining_amount DECIMAL(12,2) NOT NULL");
        DB::statement("ALTER TABLE payments MODIFY COLUMN property_price DECIMAL(12,2) NOT NULL");
        DB::statement("ALTER TABLE payments MODIFY COLUMN amount_with_interest DECIMAL(12,2) NOT NULL");
        DB::statement("ALTER TABLE payments MODIFY COLUMN installment_amount DECIMAL(12,2) NOT NULL");
    }
};
