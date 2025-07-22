import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SaleItem } from '@/types';
import { formatNumber } from '@/lib/utils';

type Props = {
  show: boolean;
  onClose: () => void;
  cart: SaleItem[];
  total: number;
  cash: number;
};

const appTitle = import.meta.env.VITE_APP_TITLE || 'POS System';

export default function ReceiptModal({ show, onClose, cart, total, cash }: Props) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Receipt</DialogTitle>
        </DialogHeader>

        <div className="text-sm">
          <p className="text-center font-semibold mb-2">{appTitle}</p>
          <p className="text-center mb-2">Yangon, 00001</p>

          <table className="w-full text-sm mb-2 border-b border-gray-400 border-dashed">
            <thead>
              <tr className="border-t border-b border-gray-400 border-dashed">
                <th className="text-center">Qty</th>
                <th className="text-left">Item</th>
                <th className="text-right">Price</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center">{item.qty}</td>
                  <td>{item.product_name}</td>
                  <td className="text-right">{formatNumber(item.price * 1)}</td>
                  <td className="text-right">{(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1 text-right">
            <div className="font-semibold text-lg">Total: <span>{formatNumber(total)}</span></div>
            <div className="font-semibold">Cash: <span>{formatNumber(cash)}</span></div>
            <div className="font-semibold">Change: <span className="text-green-600">{formatNumber(cash - total)}</span></div>
          </div>

          <div className="mt-4 space-y-1 text-center">
            <div>THANK YOU!</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
