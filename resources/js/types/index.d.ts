import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    adminOnly?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    admin: boolean;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Product = {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  image?: string;
  remark?: string;
  pivot: {
    price: number;
  };
};

export type ProductShop = {
  id: number;
  shop_id: number;
  product_id: number;
  price: number;
  stock: number;
  isactive: boolean;
  isdeleted: boolean;
  shop: {
    id: number,
    name: string
  };
  product: {
    id: number,
    name: string
  };
};

export type ProductWithPivot = Product & {
  pivot: {
    price: number;
    product_id: number;
    shop_id: number;
    isactive: boolean;
  };
};

export type Shop = {
  id: number;
  name: string;
  code: string;
  location?: string;
  remark?: string;
  products: Product[];
};

export type ShopWithProducts = Shop & {
  products: ProductWithPivot[];
};

export type ProductWithIngredients = Product & {
  ingredients: IngredientWithPivot[];
};

export type Ingredient = {
  id: number;
  name: string;
  description?: string;
  remark?: string;
  pivot: {
    stock: number;
  };
};


export type IngredientShop = {
  id: number;
  shop_id: number;
  ingredient_id: number;
  price: number;
  stock: number;
  isactive: boolean;
  isdeleted: boolean;
  shop: {
    id: number,
    name: string
  };
  ingredient: {
    id: number,
    name: string
  };
};

export type IngredientWithPivot = Ingredient & {
  pivot: {
    quantity: number;
    ingredient_id: number;
    shop_id: number;
    product_id: number;
    isactive: boolean;
  };
};

// export type IngredientProduct = {
//     shop: Shop;
//     product: Product;
//     ingredients: IngredientWithPivot[];
// }

export type IngredientProduct = {
  id: number;
  shop_id: number;
  product_id: number;
  ingredient_id: number;
  quantity: number;
  remark?: string;
  isactive: boolean;
  shop: Shop;
  product: Product;
  ingredient: Ingredient;
  created_by: {
    id: number,
    name: string
  };
  created_at: string
}

export type Inventory = {
  id: number;
  shop_id: number;
  ingredient_id: number;
  change: number;
  reason: number;
  remark?: string;
  shop: {
    id: number,
    name: string
  };
  ingredient: {
    id: number,
    name: string
  };
  created_by: {
    id: number,
    name: string
  };
  created_at: string
};

export type CartItem = {
  id: number; // Product ID
  name: string;
  price: number;
  qty: number;
  image_url?: string;
};

export type SaleItem = {
  product_id: number;
  product_name?: string;
  qty: number;
  price: number;
};

export type Sale = {
  id: number;
  shop_id: number;
  voucher_number: string;
  sale_date: Date;
  total: number;
  remark?: string;
  shop: {
    id: number,
    name: string
  };
  created_by: {
    id: number,
    name: string
  };
  created_at: string
};