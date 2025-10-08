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

    public static function serialNumberGenerator(
        $model, 
        $prefixCode,
        $column, 
        $length = 4, 
        $searchColumn, 
        $operator, 
        $searchData, 
        $searchColumn2 = null, 
        $operator2 = null, 
        $searchData2 = null
    ) {
        // Start the query with the first condition
        $query = $model::where($searchColumn, $operator, $searchData);
    
        // Apply second condition only if provided
        if (!empty($searchColumn2) && !empty($operator2) && !empty($searchData2)) {
            $query->where($searchColumn2, $operator2, $searchData2);
        }
    
        // Get the latest record
        $data = $query->orderBy('id', 'desc')->first();
    
        if (!$data) {
            $increment_last_number = 1;
        } else {
            $code = substr($data->$column, strlen($data->$column) - $length, $length);
            $actual_last_number = ((int)$code);
            $increment_last_number = $actual_last_number + 1;
        }
    
        // Format the serial number with leading zeros
        $last_number_length = strlen($increment_last_number);
        $zeros = str_repeat("0", $length - $last_number_length);
    
        return $zeros . $increment_last_number;
    }
}