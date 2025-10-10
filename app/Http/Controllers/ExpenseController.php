<?php

namespace App\Http\Controllers;

use App\Helpers\CodeGenerator;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\PaymentType;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        return Inertia::render('Expenses/Create', [
            'expenses' => Expense::with(['shop','expenseCategory','paymentType', 'createdBy'])->get(),
            'shops' => Shop::get(),
            'expense_categories' => ExpenseCategory::where(['isdeleted' => '0', 'isactive' => '1'])->get(),
            'payment_types' => PaymentType::where(['isdeleted' => '0', 'isactive' => '1'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());

        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'expense_category_id' => 'required|exists:expense_categories,id',
            'payment_type_id' => 'required|exists:payment_types,id',
            'amount'      => 'required|numeric|min:1',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'remark' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {

            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('expenses', 'public');
            }

            $shop = Shop::findOrFail($validated['shop_id']);

            $voucher_number = CodeGenerator::serialNumberGenerator(
                Expense::class,
                'E' . $shop->code . '-' . date("ymd") . '-',
                'voucher_number',
                4,
                'shop_id',
                '=',
                $validated['shop_id'],
                'expense_date',
                '=',
                date("Y-m-d")
            );

            Expense::create([
                'voucher_number' => $voucher_number,
                'expense_date' => date("Y-m-d"),
                'shop_id' => $validated['shop_id'],
                'expense_category_id' => $validated['expense_category_id'],
                'payment_type_id' => $validated['payment_type_id'],
                'amount' => $validated['amount'],
                'description' => $validated['description'] ?? '',
                'image' => $validated['image'] ?? '',
                'remark' => $validated['remark'] ?? '',
                'created_user' => Auth::user()->id
            ]);

            DB::commit();
            return redirect()->route('expenses.index')->with('success', value: 'Expense recorded successfully!');
        } catch (\Throwable $e) {
            DB::rollback();
            // Optionally, log error
            // dd($e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    // public function update(Request $request, $id)
    // {
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'sku' => 'nullable|string|max:100|unique:products,sku,' . $id,
    //         'description' => 'nullable|string',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    //         'unit_id' => 'required|exists:units,id',
    //         'remark' => 'nullable|string',
    //     ]);

    //     $product = Product::findOrFail($id);

    //     // Check for new image
    //     if ($request->hasFile('image')) {
    //         // Delete old image from storage if exists
    //         if ($product->image && Storage::disk('public')->exists($product->image)) {
    //             Storage::disk('public')->delete($product->image);
    //         }

    //         // Save new image
    //         $validated['image'] = $request->file('image')->store('products', 'public');
    //     }

    //     $product->update([
    //         'name' => $validated['name'],
    //         'sku' => $validated['sku'],
    //         'description' => $validated['description'] ?? '',
    //         'image' => $validated['image'] ?? '',
    //         'unit_id' => $validated['unit_id'],
    //         'remark' => $validated['remark'] ?? '',
    //         'modified_user' => Auth::user()->id
    //     ]);

    //     return redirect()->route('products.index')->with('success', 'Product added!');
    // }
}
