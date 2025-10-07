<?php
// database/migrations/2025_10_07_064100_create_rents_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRentsTable extends Migration
{
    public function up()
    {
        Schema::create('rents', function (Blueprint $table) {
            $table->id('rid');

            // Applicant information
            $table->string('applicant_name', 100);
            $table->string('applicant_email', 100);
            $table->string('applicant_phone', 15);
            $table->text('applicant_message');

            // Property information
            $table->foreignId('property_id')->constrained('properties', 'pid');
            $table->string('property_type', 20); // sale/rent
            $table->string('property_title', 200);
            $table->decimal('property_price', 12, 2);
            $table->decimal('installment_amount', 12, 2)->default(0);

            // Relationships
            $table->foreignId('user_id')->constrained('users'); // Property owner/agent
            $table->foreignId('applicant_user_id')->constrained('users'); // Applicant user

            // Agent information
            $table->string('agent_name', 200);
            $table->string('agent_email', 200);

            // Application details
            $table->string('duration_months', 3)->nullable(); // For rent
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled', 'completed'])->default('pending');
            $table->text('admin_notes')->nullable();

            // Dates
            $table->timestamp('application_date')->useCurrent();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['property_id', 'user_id']);
            $table->index(['applicant_user_id', 'status']);
            $table->index(['status', 'application_date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('rents');
    }
}
