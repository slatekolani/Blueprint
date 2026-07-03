<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('price')->default('Price on request');
            $table->timestamps();
        });

        $now = now();
        DB::table('services')
            ->orderBy('id')
            ->pluck('id')
            ->chunk(500)
            ->each(function ($serviceIds) use ($now) {
                DB::table('service_prices')->insert(
                    $serviceIds->map(fn ($serviceId) => [
                        'service_id' => $serviceId,
                        'price' => 'Price on request',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ])->all()
                );
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_prices');
    }
};
