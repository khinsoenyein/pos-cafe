import React from 'react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { formatNumber } from '@/lib/utils';

type Props = {
  product: Product;
  qty?: number; // current quantity in cart (0 when not present)
  onAdd: (product: Product) => void;
};

export default function ProductCard({ product, qty = 0, onAdd }: Props) {
  return (
    <div
      className="w-full bg-white rounded-lg shadow-[0_0_3px_#7f7f7f8a] p-3 flex items-center justify-between gap-3"
      // make row height consistent on mobile
      role="button"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-medium leading-5 truncate">{product.name}</div>
            <div className="text-xs text-gray-500 mt-1">{formatNumber(product.pivot.price*1)}</div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <Button
          onClick={() => onAdd(product)}
          className="px-3 py-1"
          // small visual difference when qty > 0
        >
          {qty > 0 ? String(qty) : '+'}
        </Button>
      </div>
    </div>
  );
}
