import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sale, SaleItem } from '@/types';
import { formatDateYmd, formatNumber } from '@/lib/utils';

type Props = {
  show: boolean;
  onClose: () => void;
  // cart: SaleItem[];
  sale: Sale;
  // total: number;
  // cash: number;
  // voucherNumber: string | null;
};

const appTitle = import.meta.env.VITE_APP_TITLE || 'POS System';

export default function ReceiptModal({ show, onClose, sale }: Props) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Receipt</DialogTitle>
        </DialogHeader>

        <div className="text-sm">
          <p className="text-center font-semibold mb-2">{appTitle}</p>
          <p className="text-center mb-2">Voucher No: {sale.voucher_number}</p>
          <p className="text-center mb-2">Date: {sale.sale_date ? formatDateYmd(sale.sale_date) : ''}</p>

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
              {sale.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center px-2 py-1">{idx + 1}</td>
                  <td className="text-left px-2 py-1">{item.product!.name}</td>
                  <td className="text-right px-2 py-1">{formatNumber(item.price * 1)}</td>
                  <td className="text-right px-2 py-1">{item.qty}</td>
                  <td className="text-right px-2 py-1">{formatNumber(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1 text-right">
            <div>Sub Total: <span>{formatNumber(sale.sub_total * 1)}</span></div>
            <div>Dicount: <span>{formatNumber(sale.discount * 1)}</span></div>
            <div>Tax: <span>{formatNumber(sale.tax * 1)}</span></div>
            <div>Grand Total: <span className="text-green-600">{formatNumber(sale.grand_total * 1)}</span></div>
            {/* <div className="font-semibold">Payment Type: <span>{sale.payment_type.name}</span></div>
            <div className="font-semibold">Pay: <span>{formatNumber(sale.pay)}</span></div>
            <div className="font-semibold">Change: <span className="text-green-600">{formatNumber(sale.change)}</span></div> */}
          </div>

          <div className="mt-4 space-y-1 text-center">
            <div>Paid with: {sale.payment_type.name}</div>
            <div>Cashier: {sale.created_by.name}</div>
            <div>THANK YOU!</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
