<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IngredientShop extends Model
{
    protected $table = 'ingredient_shop';
    protected $fillable = ['shop_id', 'ingredient_id', 'unit_id', 'stock', 'remark'];

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id', 'id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
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
