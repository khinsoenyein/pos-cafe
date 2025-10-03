import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

import type { Shop, SaleItem } from '@/types';
import ConfirmDialog from '../ConfirmDialog';

type Props = {
  shop?: Shop;
  items: SaleItem[];
  onQtyChange: (product_id: number, delta: number) => void;
  onPriceChange: (product_id: number, price: number) => void;
  onRemove: (product_id: number) => void;
  total: number;
  cash: number;
  setCash: (value: number) => void;
  change: number;
  onPay: (e: React.FormEvent) => void;
};

export default function CartSidebar({ shop, items, onQtyChange, onPriceChange, onRemove, total, cash, setCash, change, onPay }: Props) {
  const findProduct = (id: number) => shop?.products.find(p => p.id === id);

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-md p-4 flex flex-col justify-between border dark:bg-transparent">
      <div>
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No items in cart.</p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-[minmax(5rem,_1fr)_3rem_6rem_2rem] gap-4 items-center font-semibold text-sm border-b pb-2">
              <span>Item</span>
              <span className="text-center">Qty</span>
              <span className="text-center">Price</span>
              <span className="text-center"></span>
            </div>
            {items.map(item => {
              const product = findProduct(item.product_id);
              const initial = product?.name.charAt(0).toUpperCase() || '?';
              return (
                <div key={item.product_id} className="grid grid-cols-[minmax(5rem,_1fr)_3rem_6rem_2rem] gap-4 items-center border-b pb-2 text-sm" >
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{product?.name}</span>
                  </div>

                  {/* <div className="flex items-center justify-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => onQtyChange(item.product_id, -1)}>-</Button>
                    <span className="text-sm font-medium px-1">{item.qty}</span>
                    <Button size="sm" variant="outline" onClick={() => onQtyChange(item.product_id, 1)}>+</Button>
                  </div> */}

                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => onQtyChange(item.product_id, Number(e.target.value))}
                    className="border p-1 rounded w-full text-right font-semibold"
                  />

                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => onPriceChange(item.product_id, Number(e.target.value))}
                    className="border p-1 rounded w-full text-right font-semibold"
                  />

                  <button onClick={() => onRemove(item.product_id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 border-t pt-4 space-y-2 text-sm">
          {/* <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-bold">{total}</span>
          </div> */}
          <div className="flex justify-between items-center">
            <label htmlFor="total">Total:</label>
            <input
              type="number"
              id="total"
              value={total}
              className="border p-1 rounded w-28 text-right font-bold"
              placeholder="0"
              readOnly
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="cash">Cash:</label>
            <input
              type="number"
              id="cash"
              value={cash}
              onChange={(e) => setCash(Number(e.target.value))}
              className="border p-1 rounded w-28 text-right font-bold"
              placeholder="0"
            />
          </div>          
          <div className="flex justify-between items-center">
            <label htmlFor="total">Change:</label>
            <input
              type="number"
              id="change"
              value={change >= 0 ? change : ''}
              className="border p-1 rounded w-28 text-right font-bold text-green-700"
              placeholder="0"
              readOnly
            />
          </div>
          {/* <div className="flex justify-between">
            <span>Change:</span>
            <span className="font-bold text-green-600">{change >= 0 ? change : '0'}</span>
          </div> */}
        </div>
      </div>
      <Button onClick={onPay} className="mt-4" disabled={items.length === 0 || cash < total}>
        Submit
      </Button>
      
    </div>
  );
}