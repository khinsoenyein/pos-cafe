<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    protected $fillable = ['voucher_number', 'transfer_date', 'from_shop_id', 'to_shop_id', 'other_cost', 'total_qty', 'remark', 'isdeleted', 'isactive', 'created_user', 'modified_user'];

    public function fromShop()
    {
        return $this->belongsTo(Shop::class, 'from_shop_id', 'id');
    }
    public function toShop()
    {
        return $this->belongsTo(Shop::class, 'to_shop_id', 'id');
    }
    public function items()
    {
        return $this->hasMany(TransferItem::class);
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
