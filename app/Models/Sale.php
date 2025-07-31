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
}
