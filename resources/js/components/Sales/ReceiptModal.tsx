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
  voucherNumber: string | null;
};

const appTitle = import.meta.env.VITE_APP_TITLE || 'POS System';

export default function ReceiptModal({ show, onClose, cart, total, cash, voucherNumber }: Props) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Receipt</DialogTitle>
        </DialogHeader>

        <div className="text-sm">
          <p className="text-center font-semibold mb-2">{appTitle}</p>
          <p className="text-center mb-2">Voucher No: {voucherNumber}</p>

          <table className="w-full text-sm mb-2 border-b border-gray-400 border-dashed">
            <thead>
              <tr className="border-t border-b border-gray-400 border-dashed">
                <th className="text-left px-2 py-1">#</th>
                <th className="text-left px-2 py-1">Item</th>
                <th className="text-right px-2 py-1">Price</th>
                <th className="text-right px-2 py-1">Qty</th>
                <th className="text-right px-2 py-1">Amount</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.product_name}</td>
                  <td className="text-right px-2 py-1">{item.qty}</td>
                  <td className="text-right px-2 py-1">{formatNumber(item.price * 1)}</td>
                  <td className="text-right px-2 py-1">{(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1 text-right">
            <div className="font-semibold">Total: <span>{formatNumber(total)}</span></div>
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
