<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'name' => 'Rent',
                'description' => 'Monthly office or shop rent expenses',
            ],
            [
                'name' => 'Utilities',
                'description' => 'Electricity, water, and internet bills',
            ],
            [
                'name' => 'Supplies',
                'description' => 'Office and shop supplies expenses',
            ],
            [
                'name' => 'Transportation',
                'description' => 'Travel and delivery related costs',
            ],
            [
                'name' => 'Maintenance',
                'description' => 'Equipment or property maintenance',
            ],
            [
                'name' => 'Salaries',
                'description' => 'Staff salary and wages',
            ],
            [
                'name' => 'Marketing',
                'description' => 'Promotional or advertising expenses',
            ],
            [
                'name' => 'Miscellaneous',
                'description' => 'Other general expenses not categorized',
            ],
        ];

        foreach ($datas as $data) {
            ExpenseCategory::create($data);
        }
    }
}
