<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $fillable = ['shop_id', 'sale_date', 'voucher_number', 'total', 'remark', 'created_user', 'modified_user'];

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
   
    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
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
