import React from 'react';
import { Button } from '@/components/ui/button';

import type { Product, Shop } from '@/types';
import { formatNumber } from '@/lib/utils';

type Props = {
  product: Product;
  onAdd: (product: Product) => void;
};

export default function ProductCard2({ product, onAdd }: Props) {
  const initial = product?.name.charAt(0).toUpperCase() || '?';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full border dark:bg-transparent">
      <div>
        {/* <img
          src={`https://via.placeholder.com/150x100.png?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-24 object-cover rounded"
        /> */}

        <div className="flex items-center justify-center">
          {product.image == null ? (
            <div className="w-24 h-24 rounded bg-gray-200 flex items-center justify-center font-bold text-gray-700 mb-2">
              {initial}
            </div>
          ) : (
            <img
              src={`/storage/${product.image}`}
              alt={product.name}
              className="h-24 w-24 rounded border mb-2"
            />
          )}
        </div>

        <h3 className="mt-2 font-semibold text-sm truncate">{product.name}</h3>
        <p className="text-sm text-gray-500">{formatNumber(product.pivot.price * 1)}</p>
      </div>
      <Button onClick={() => onAdd(product)} className="mt-3">+ Add</Button>
    </div>
  );
}