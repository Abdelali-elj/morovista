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
        Schema::create('souvenirs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tag')->nullable();
            $table->string('category')->nullable();
            $table->string('origin')->nullable();
            $table->integer('price')->default(0);
            $table->string('badge')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('likes')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('souvenirs');
    }
};
