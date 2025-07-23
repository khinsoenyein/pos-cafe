<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IngredientProduct extends Model
{
    protected $table = 'ingredient_product';
    protected $fillable = ['shop_id', 'product_id', 'ingredient_id', 'quantity', 'remark'];

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id', 'id');
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
