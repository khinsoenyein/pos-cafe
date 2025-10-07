<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'sku', 'description', 'image', 'unit_id', 'remark', 'created_user', 'modified_user'];

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
            ->withPivot('price', 'isactive', 'isdeleted')
            ->withTimestamps();
    }

    public function ingredients()
    {
        return $this->belongsToMany(Product::class, 'ingredient_product', 'product_id', 'ingredient_id')
            ->withPivot('quantity', 'shop_id')
            ->withTimestamps();
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }
    public function usedInProducts()
    {
        return $this->belongsToMany(Product::class, 'ingredient_product', 'ingredient_id', 'product_id')
            ->withPivot('quantity', 'shop_id')
            ->withTimestamps();
    }
}
