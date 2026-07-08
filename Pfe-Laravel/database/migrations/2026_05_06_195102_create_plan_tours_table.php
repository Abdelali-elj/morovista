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
        Schema::create('plan_tours', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('image_url')->nullable();
            $table->decimal('prix', 10, 2)->nullable();
            $table->string('duree')->nullable();
            $table->string('status')->default('active');
            $table->string('addedBy')->nullable();
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
        Schema::dropIfExists('plan_tours');
    }
};
