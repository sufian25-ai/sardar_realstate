<?php
// database/migrations/2025_10_07_064000_create_properties_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertiesTable extends Migration
{
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id('pid');
            $table->string('title', 200);
            $table->string('slug', 220)->unique();
            $table->longText('pcontent');
            $table->string('type', 100); // apartment, house, villa, commercial, etc.
            $table->enum('stype', ['sale', 'rent']);
            $table->integer('bedroom');
            $table->integer('bathroom');
            $table->integer('balcony');
            $table->integer('kitchen');
            $table->integer('drawing_room');
            $table->integer('dining_room');
            $table->string('floor', 50);
            $table->integer('size'); // in sq ft
            $table->decimal('price', 12, 2);
            $table->text('location');

            // Foreign keys for city and state
            $table->foreignId('city_id')->constrained('cities', 'cid');
            $table->foreignId('state_id')->constrained('states', 'sid');

            $table->longText('feature');
            $table->string('pimage', 300);
            $table->string('image1', 300)->nullable();
            $table->string('pimage2', 300)->nullable();
            $table->string('pimage3', 300)->nullable();
            $table->string('pimage4', 300)->nullable();

            $table->foreignId('user_id')->constrained('users');
            $table->enum('status', ['available', 'sold', 'rented', 'pending'])->default('available');

            $table->string('mapimage', 300)->nullable();
            $table->string('groundmapimage', 300)->nullable();
            $table->string('totalfloor', 50)->nullable();

            // Additional fields for better search
            $table->boolean('featured')->default(false);
            $table->boolean('verified')->default(false);
            $table->integer('view_count')->default(0);
            $table->timestamp('date')->useCurrent();
            $table->timestamps();

            // Indexes for better performance
            $table->index(['city_id', 'state_id']);
            $table->index(['type', 'stype']);
            $table->index(['price', 'status']);
            $table->index(['featured', 'verified']);
            $table->index(['created_at', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('properties');
    }
};

