<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = ['name', 'description', 'unit_id', 'remark', 'created_user', 'modified_user'];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }

    public function inventory()
    {
        return $this->hasMany(Inventory::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
    public function shops()
    {
        return $this->belongsToMany(Shop::class)
                    ->withPivot('stock', 'isactive', 'isdeleted')
                    ->withTimestamps();
    }
    public function products()
    {
        return $this->belongsToMany(Product::class, 'ingredient_product', 'ingredient_id', 'product_id')
            ->withPivot('quantity', 'shop_id')
            ->withTimestamps();
    }
}
