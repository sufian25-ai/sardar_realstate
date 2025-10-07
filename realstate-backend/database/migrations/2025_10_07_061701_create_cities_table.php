<?php
// database/migrations/2025_10_07_061701_create_cities_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCitiesTable extends Migration
{
    public function up()
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id('cid');
            $table->string('cname', 100);
            $table->string('slug', 100);
            $table->foreignId('state_id')->constrained('states', 'sid');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['cname', 'state_id']);
            $table->index(['slug', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('cities');
    }
}
