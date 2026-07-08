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
        Schema::create('service_locals', function (Blueprint $table) {
            $table->id();
            $table->string('nom_service');
            $table->string('type')->nullable();
            $table->string('telephone')->nullable();
            $table->string('adresse')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('ville_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_locals');
    }
};
