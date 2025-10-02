<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = ['supplier_id', 'shop_id', 'purchase_date', 'voucher_number', 'total', 'status', 'remark', 'created_user', 'modified_user'];
   
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
}
