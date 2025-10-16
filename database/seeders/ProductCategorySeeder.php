<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'name' => 'Hot Cup',
            ],
            [
                'name' => 'Cold Cup',
            ],
            [
                'name' => 'Other',
            ],
        ];

        foreach ($datas as $data) {
            ProductCategory::create($data);
        }
    }
}
