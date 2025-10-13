<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = ['voucher_number', 'shop_id', 'expense_category_id', 'payment_type_id', 'expense_date', 'amount', 'description', 'receipt_image', 'remark', 'isdeleted', 'isactive', 'created_user', 'modified_user'];

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }
    
    public function expenseCategory()
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id', 'id');
    }
    
    public function paymentType()
    {
        return $this->belongsTo(PaymentType::class, 'payment_type_id', 'id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_user', 'id');
    }

    public function modifiedBy()
    {
        return $this->belongsTo(User::class, 'modified_user', 'id');
    }
}
