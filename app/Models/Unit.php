<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    public static function convert($amount, $fromUnitId, $toUnitId)
    {
        $from = self::findOrFail($fromUnitId);
        $to = self::findOrFail($toUnitId);

        // Must be same base unit
        if ($from->base_unit !== $to->base_unit) {
            throw new \Exception("Incompatible units: {$from->symbol} to {$to->symbol}");
        }

        // Convert amount to base unit then to target unit
        $amountInBase = $amount * $from->conversion_rate;
        return $amountInBase / $to->conversion_rate;
    }
}
