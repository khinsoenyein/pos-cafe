<?php

namespace Database\Seeders;

use App\Models\PaymentType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $payment_types = [
            ['name' => 'Cash'],
            ['name' => 'KPay'],
            ['name' => 'KBZ Bank'],
            ['name' => 'KBZ Special'],
            ['name' => 'AYA Pay'],
            ['name' => 'AYA Bank'],
            ['name' => 'CB Pay'],
            ['name' => 'CB Bank'],
            ['name' => 'One Pay'],
            ['name' => 'Wave Money'],
        ];

        foreach ($payment_types as $payment_type) {
            PaymentType::create($payment_type);
        }
    }
}
