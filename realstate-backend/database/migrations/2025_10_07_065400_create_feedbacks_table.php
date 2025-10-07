<?php
// database/migrations/2025_10_07_065400_create_feedbacks_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeedbacksTable extends Migration
{
    public function up()
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id('fid');

            // Relationships
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('property_id')->constrained('properties', 'pid');

            // Feedback content
            $table->text('description');
            $table->integer('rating')->default(5); // 1-5 stars

            // Status and visibility
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_verified')->default(false); // Verified purchase/rent

            // Admin management
            $table->text('admin_notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');

            // Dates
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('date')->useCurrent();

            $table->timestamps();

            // Indexes
            $table->index(['property_id', 'is_approved']);
            $table->index(['user_id', 'created_at']);
            $table->index(['rating', 'is_featured']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedbacks');
    }
}
