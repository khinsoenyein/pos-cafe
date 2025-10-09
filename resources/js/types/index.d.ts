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

export type Unit = {
  id: number;
  name: string;
  symbol: string;
  base_unit: string;
  conversion_rate: number;
};

export type Product = {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  unit_id: number;
  unit: Unit;
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
  isactive: boolean;
};

export type Supplier = {
  id: number;
  name: string;
  contact_name: string;
  phone?: string;
  email?: string;
  remark?: string;
};

export type PaymentType = {
  id: number;
  name: string;
  description?: string;
  remark?: string;
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
  unit_id: number;
  unit: Unit;
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
  unit: Unit;
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
  purchase: Purchase,
  sale: Sale,
  transfer: Transfer,
  unit: Unit;
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
  product?: Product
  qty: number;
  price: number;
};

export type Sale = {
  id: number;
  shop_id: number;
  voucher_number: string;
  sale_date: Date;
  sub_total: number;
  discount: number;
  tax: number;
  grand_total: number;
  pay: number;
  change: number;
  remark?: string;
  items: SaleItem[],
  shop: {
    id: number,
    name: string
  };
  payment_type: {
    id: number,
    name: string
  };
  created_by: {
    id: number,
    name: string
  };
  created_at: string
};

export type PurchaseLineItem = {
    tempId: string; // local key for mapping
    ingredient_id: number | null;
    unit_id: number | null;
    quantity: number; // keep as string for input
    unit_price: string; // string for input like "1.50"
    line_total: number;
    remark?: string;
};

export type Purchase = {
  id: number;
  supplier_id: number;
  shop_id: number;
  voucher_number: string;
  purchase_date: Date;
  total: number;
  other_cost: number;
  grand_total: number;
  remark?: string;
  items: PurchaseItem[],
  supplier: Supplier;
  shop: Shop;
  created_by: {
    id: number,
    name: string
  };
  created_at: string
};

export type PurchaseItem = {
    purchase_id: number | null;
    shop_id: number | null;
    ingredient_id: number | null;
    unit_id: number | null;
    qty: number; // keep as string for input
    price: string; // string for input like "1.50"
    total: number;
    remark?: string;
    purchase: Purchase;
    shop: Shop;
    ingredient: Ingredient;
    unit: Unit;
};

export type TransferLineItem = {
    tempId: string; // local key for mapping
    ingredient_id: number | null;
    unit_id: number | null;
    quantity: number; // keep as string for input
    remark?: string;
};


export type Transfer = {
  id: number;
  from_shop_id: number;
  to_shop_id: number;
  voucher_number: string;
  transfer_date: Date;
  total_qty: number;
  other_cost: number;
  remark?: string;
  items: TransferItem[],
  from_shop: Shop;
  to_shop: Shop;
  created_by: {
    id: number,
    name: string
  };
  created_at: string
};

export type TransferItem = {
    transfer_id: number | null;
    ingredient_id: number | null;
    unit_id: number | null;
    qty: number; // keep as string for input\
    remark?: string;
    transfer: Transfer;
    ingredient: Ingredient;
    unit: Unit;
};