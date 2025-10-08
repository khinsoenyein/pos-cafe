<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PriceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::get('/', [AuthenticatedSessionController::class, 'create'])
        ->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/shops', [ShopController::class, 'index'])->name('shops.index');
    Route::post('/shops', [ShopController::class, 'store'])->name('shops.store');
    Route::put('/shops/{id}', [ShopController::class, 'update'])->name('shops.update');
    Route::get('/shops/status', [ShopController::class, 'status'])->name('shops.status');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update');

    Route::get('/price', [PriceController::class, 'index'])->name('price.index');
    Route::post('/price', [PriceController::class, 'store'])->name('price.store');
    Route::put('/price/{id}', [PriceController::class, 'update'])->name('price.update');
    Route::get('/price/status', [PriceController::class, 'status'])->name('price.status');

    Route::get('/ingredients', [IngredientController::class, 'index'])->name('ingredients.index');
    Route::post('/ingredients', [IngredientController::class, 'store'])->name('ingredients.store');
    Route::put('/ingredients/{id}', [IngredientController::class, 'update'])->name('ingredients.update');

    Route::get('/recipe', [RecipeController::class, 'index'])->name('recipe.index');
    Route::post('/recipe', [RecipeController::class, 'store'])->name('recipe.store');
    Route::put('/recipe/{id}', [RecipeController::class, 'update'])->name('recipe.update');
    Route::get('/recipe/get-ingredient', [RecipeController::class, 'getIngredient'])->name('recipe.get.ingredient');
    Route::get('/recipe/status', [RecipeController::class, 'status'])->name(name: 'recipe.status');

    Route::get('/inventory-transaction', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('/inventory-transaction', [InventoryController::class, 'store'])->name('inventory.store');
    Route::get('/inventory-balance', [InventoryController::class, 'balance'])->name('inventory.balance');
    Route::post('/inventory/inout', [InventoryController::class, 'inout'])->name('inventory.inout');

    Route::get('/sales/create', [SaleController::class, 'create'])->name('sales.create');
    Route::post('/sales/store', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales/list', [SaleController::class, 'list'])->name('sales.list');

    Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
    Route::post('/purchases/store', [PurchaseController::class, 'store'])->name('purchases.store');
    Route::get('/purchases/list', [PurchaseController::class, 'list'])->name('purchases.list');

    Route::get('/transfer/create', [TransferController::class, 'create'])->name('transfer.create');
    Route::post('/transfer/store', [TransferController::class, 'store'])->name('transfer.store');
    Route::get('/transfer/list', [TransferController::class, 'list'])->name('transfer.list');

    Route::get('/user/shop', [UserController::class, 'shop'])->name('user.shop');

    Route::get('testing', [SaleController::class, 'testing']);

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
