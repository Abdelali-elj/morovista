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
        Schema::table('commentaires', function (Blueprint $table) {
            $table->string('pays')->nullable()->after('auteur_nom');
            $table->string('service_type')->nullable()->after('note'); // 'hotel', 'restaurant', etc.
            $table->unsignedBigInteger('service_id')->nullable()->after('service_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commentaires', function (Blueprint $table) {
            $table->dropColumn(['pays', 'service_type', 'service_id']);
        });
    }
};
