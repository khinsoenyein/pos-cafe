<?php

namespace App\Helpers;

class CodeGenerator
{
    public static function generateID($model, $searchData, $searchColumn, $getColumn, $prefixCode, $length = 4)
    {
        $maxCodeId = $model::where($searchColumn, $searchData)->max($getColumn);

        if (!$maxCodeId) {
            $increase_code_gen = 1;
        } else {
            $lastDigit = $model::selectRaw("RIGHT($getColumn, $length) as last_digit")
                ->where($getColumn, $maxCodeId)
                ->orderBy('id', 'desc')
                ->first();

            $num_digit = (int) $lastDigit->last_digit;
            $increase_code_gen = $num_digit + 1;
        }

        $formatted_code = str_pad($increase_code_gen, $length, '0', STR_PAD_LEFT);

        $auto_code_gen = $prefixCode . $formatted_code;

        return $auto_code_gen;
    }
}