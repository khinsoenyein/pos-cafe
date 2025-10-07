<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = ['supplier_id', 'shop_id', 'purchase_date', 'voucher_number', 'total', 'other_cost', 'grand_total', 'status', 'remark', 'created_user', 'modified_user'];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }
    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
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
