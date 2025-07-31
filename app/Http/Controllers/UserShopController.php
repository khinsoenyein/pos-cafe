<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserShopController extends Controller
{
    public function index(Request $request)
    {
        $selectedUserId = $request->input('user_id') ?? 1;

        $shops = Shop::with(['users' => function ($query) use($selectedUserId){
            $query->where('user_id', $selectedUserId)
                ->select('users.id', 'users.name')
                ->withPivot('id', 'remark', 'isactive');
        }])->get();

        return Inertia::render('UserShop', [
            'users' => User::all(['id', 'name']),
            'shops' => $shops,
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : [],
        ]);
    }
}