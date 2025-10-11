<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('property_id')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new'); // new, reviewed, converted
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('inquiries');
    }
};
