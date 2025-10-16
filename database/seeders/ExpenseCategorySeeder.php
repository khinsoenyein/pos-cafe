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
            ['name' => 'ရေသန့်', 'expense_type' => 'cost'],
            ['name' => 'ရေခဲ', 'expense_type' => 'cost',],
            ['name' => 'ကားဆီ / မီးစက်ဆီ', 'expense_type' => 'cost',],
            ['name' => 'အထွေထွေစရိတ်', 'expense_type' => 'expense',],
            ['name' => 'ဝန်ထမ်းလစာ', 'expense_type' => 'expense',],
            ['name' => 'Commission', 'expense_type' => 'expense',],
            ['name' => 'Marketing', 'expense_type' => 'expense',],
            ['name' => 'Rent', 'expense_type' => 'expense',],
        ];

        foreach ($datas as $data) {
            ExpenseCategory::create($data);
        }
    }
}
