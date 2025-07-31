<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserShop extends Model
{
    protected $table = 'user_shops';
    protected $fillable = ['shop_id', 'user_id', 'remark', 'isactive'];
   
    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
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
