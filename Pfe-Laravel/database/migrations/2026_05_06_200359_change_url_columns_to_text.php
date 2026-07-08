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
        Schema::table('villes', function (Blueprint $table) { $table->text('image_url')->nullable()->change(); });
        Schema::table('hotels', function (Blueprint $table) { $table->text('photo_url')->nullable()->change(); });
        Schema::table('restaurants', function (Blueprint $table) { $table->text('photo_url')->nullable()->change(); });
        Schema::table('stades', function (Blueprint $table) { $table->text('image_url')->nullable()->change(); });
        Schema::table('lieu_places', function (Blueprint $table) { $table->text('image_url')->nullable()->change(); });
        Schema::table('plan_tours', function (Blueprint $table) { $table->text('image_url')->nullable()->change(); });
        Schema::table('transports', function (Blueprint $table) { $table->text('photo_url')->nullable()->change(); });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('text', function (Blueprint $table) {
            //
        });
    }
};
