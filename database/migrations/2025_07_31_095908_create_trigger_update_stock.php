<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Trigger for AFTER INSERT
        // DB::unprepared("
        //     CREATE TRIGGER update_stock_after_sale_insert
        //     AFTER INSERT ON sale_items
        //     FOR EACH ROW
        //     BEGIN
        //         DECLARE total_change INT DEFAULT 0;
        //         DECLARE total_sold INT DEFAULT 0;

        //         SELECT IFNULL(SUM(inventories.change), 0) INTO total_change
        //         FROM inventories
        //         WHERE shop_id = NEW.shop_id AND product_id = NEW.product_id;

        //         SELECT IFNULL(SUM(qty), 0) INTO total_sold
        //         FROM sale_items
        //         WHERE shop_id = NEW.shop_id AND product_id = NEW.product_id;

        //         UPDATE product_shop
        //         SET stock = total_change - total_sold
        //         WHERE shop_id = NEW.shop_id AND product_id = NEW.product_id;
        //     END;
        // ");

        // Trigger for AFTER UPDATE
        // DB::unprepared("
        //     CREATE TRIGGER update_stock_after_sale_update
        //     AFTER UPDATE ON sale_items
        //     FOR EACH ROW
        //     BEGIN
        //         DECLARE total_change INT DEFAULT 0;
        //         DECLARE total_sold INT DEFAULT 0;

        //         SELECT IFNULL(SUM(inventories.change), 0) INTO total_change
        //         FROM inventories
        //         WHERE shop_id = NEW.shop_id AND product_id = NEW.product_id;

        //         SELECT IFNULL(SUM(qty), 0) INTO total_sold
        //         FROM sale_items
        //         WHERE shop_id = NEW.shop_id AND product_id = NEW.product_id;

        //         UPDATE product_shop
        //         SET stock = total_change - total_sold
        //         WHERE shop_id = NEW.shop_id AND product_id = NEW.product_id;
        //     END;
        // ");

        // Trigger for AFTER INSERT
        DB::unprepared("
            CREATE TRIGGER update_stock_after_inventory_insert
            AFTER INSERT ON inventories
            FOR EACH ROW
            BEGIN
                DECLARE total_change INT DEFAULT 0;

                SELECT IFNULL(SUM(inventories.change), 0) INTO total_change
                FROM inventories
                WHERE shop_id = NEW.shop_id AND ingredient_id = NEW.ingredient_id;

                INSERT INTO ingredient_shop (shop_id, ingredient_id, unit_id, stock, created_at, created_user, updated_at)
                VALUES (NEW.shop_id, NEW.ingredient_id, NEW.unit_id, total_change, NOW(), NEW.created_user, NOW())
                ON DUPLICATE KEY UPDATE
                    stock = VALUES(stock),
                    modified_user = NEW.created_user,
                    updated_at = NOW();
            END;
        ");

        // Trigger for AFTER UPDATE
        // DB::unprepared("
        //     CREATE TRIGGER update_stock_after_inventory_update
        //     AFTER UPDATE ON inventories
        //     FOR EACH ROW
        //     BEGIN
        //         DECLARE total_change INT DEFAULT 0;

        //         SELECT IFNULL(SUM(inventories.change), 0) INTO total_change
        //         FROM inventories
        //         WHERE shop_id = NEW.shop_id AND ingredient_id = NEW.ingredient_id;

        //         UPDATE ingredient_shop
        //         SET stock = total_change
        //         WHERE shop_id = NEW.shop_id AND ingredient_id = NEW.ingredient_id;
        //     END;
        // ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop the triggers
        // DB::unprepared('DROP TRIGGER IF EXISTS update_stock_after_sale_insert');
        // DB::unprepared('DROP TRIGGER IF EXISTS update_stock_after_sale_update');

        DB::unprepared('DROP TRIGGER IF EXISTS update_stock_after_inventory_insert');
        // DB::unprepared('DROP TRIGGER IF EXISTS update_stock_after_inventory_update');
    }
};
