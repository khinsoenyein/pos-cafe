<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransferItem extends Model
{
    protected $fillable = ['transfer_id', 'ingredient_id', 'unit_id', 'qty', 'remark', 'isdeleted', 'isactive', 'created_user', 'modified_user'];

    public function transfer()
    {
        return $this->belongsTo(Transfer::class);
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }
}
