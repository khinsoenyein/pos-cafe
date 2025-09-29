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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name');       // e.g., gram, ml, piece
            $table->string('symbol');     // e.g., g, ml, pc
            $table->string('base_unit');        // e.g., g (for gram and kg both)
            $table->decimal('conversion_rate', 10, 6); // e.g., 1 for gram, 1000 for kg
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
