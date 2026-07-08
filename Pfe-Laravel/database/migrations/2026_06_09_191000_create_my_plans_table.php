<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('my_plans', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. plan_1717900000000
            $table->string('userId')->nullable();
            $table->string('userName')->nullable();
            $table->string('city')->nullable();
            $table->integer('duration')->nullable();
            $table->integer('totalBudget')->nullable();
            $table->string('tier')->nullable();
            $table->string('tagline')->nullable();
            $table->text('image')->nullable();
            $table->longText('dayPlans')->nullable(); // Store the itinerary JSON
            $table->string('vibe')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('my_plans');
    }
};
