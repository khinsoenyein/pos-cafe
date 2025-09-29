<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            ['name' => 'gram', 'symbol' => 'g', 'base_unit' => 'g', 'conversion_rate' => '1' ],
            ['name' => 'kilogram', 'symbol' => 'kg', 'base_unit' => 'g', 'conversion_rate' => '1000' ],
            ['name' => 'milliliter', 'symbol' => 'ml', 'base_unit' => 'ml', 'conversion_rate' => '1' ],
            ['name' => 'liter', 'symbol' => 'L', 'base_unit' => 'ml', 'conversion_rate' => '1000' ],
            ['name' => 'piece', 'symbol' => 'pc', 'base_unit' => 'pc', 'conversion_rate' => '1' ],
        ];

        foreach ($datas as $data) {
            Unit::create($data);
        }
    }
}
