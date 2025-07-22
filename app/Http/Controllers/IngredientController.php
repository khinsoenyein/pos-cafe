<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class IngredientController extends Controller
{
    public function index()
    {
        $ingredients = Ingredient::all();
        return Inertia::render('Ingredient', [
            'ingredients' => $ingredients
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name',
            'description' => 'required|string',
            'remark' => 'nullable|string',
        ]);

        Ingredient::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'remark' => $validated['remark'] ?? '',
            'created_user' => Auth::user()->id
        ]);

        return redirect()->route('ingredients.index')->with('success', 'Ingredient added!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:100|unique:ingredients,name,' . $id,
            'description' => 'required|string',
            'remark' => 'nullable|string',
        ]);

        $Ingredient = Ingredient::findOrFail($id);

        $Ingredient->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'remark' => $validated['remark'] ?? '',
            'modified_user' => Auth::user()->id
        ]);

        return redirect()->route('ingredients.index')->with('success', 'Ingredient added!');
    }
}
