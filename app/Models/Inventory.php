<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    protected $fillable = ['shop_id', 'product_id', 'change', 'reason', 'remark', 'created_user', 'modified_user'];

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
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
