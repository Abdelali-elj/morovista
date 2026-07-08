<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->string('email')->nullable()->after('contact');
            $table->decimal('prix_chambre', 10, 2)->nullable()->after('email');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->string('email')->nullable()->after('contact');
            $table->decimal('prix_moyen', 10, 2)->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->dropColumn(['email', 'prix_chambre']);
        });
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn(['email', 'prix_moyen']);
        });
    }
};
