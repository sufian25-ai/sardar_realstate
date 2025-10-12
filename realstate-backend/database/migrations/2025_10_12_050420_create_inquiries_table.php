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
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->unsignedBigInteger('property_id')->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['new', 'reviewed', 'converted'])->default('new');
            $table->timestamps();

            // Foreign key constraint (if properties table exists)
            // $table->foreign('property_id')->references('pid')->on('properties')->onDelete('set null');

            // Indexes for better performance
            $table->index('status');
            $table->index('property_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
