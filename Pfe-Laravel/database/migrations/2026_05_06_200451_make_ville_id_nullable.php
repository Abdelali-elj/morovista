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
        Schema::table('hotels', function (Blueprint $table) { $table->unsignedBigInteger('ville_id')->nullable()->change(); });
        Schema::table('restaurants', function (Blueprint $table) { $table->unsignedBigInteger('ville_id')->nullable()->change(); });
        Schema::table('stades', function (Blueprint $table) { $table->unsignedBigInteger('ville_id')->nullable()->change(); });
        Schema::table('lieu_places', function (Blueprint $table) { $table->unsignedBigInteger('ville_id')->nullable()->change(); });
        Schema::table('plan_tours', function (Blueprint $table) { $table->unsignedBigInteger('ville_id')->nullable()->change(); });
        Schema::table('service_locals', function (Blueprint $table) { $table->unsignedBigInteger('ville_id')->nullable()->change(); });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
