"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Sale } from "@/types";
import { formatDate, formatDateYmd, formatNumber } from "@/lib/utils";

interface ReceiptDialogProps {
    //   voucherNumber: string;
    sale: Sale,
    children: React.ReactNode;
}

const appTitle = import.meta.env.VITE_APP_TITLE || 'POS System';

export function ReceiptDialog({ sale, children }: ReceiptDialogProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-lg z-50">
                <DialogHeader>
                    {/* <DialogTitle className="sr-only">Sale Voucher – {sale.voucher_number}</DialogTitle> */}
                    <DialogTitle>Sale Voucher</DialogTitle>
                </DialogHeader>
                {/* Replace below with real receipt details */}
                <div className="text-sm">
                    <p className="text-center text-lg font-semibold mb-2">{appTitle}</p>
                    <p className="text-center mb-2">Voucher No: {sale.voucher_number}</p>
                    <p className="text-center mb-2">Date: {sale.sale_date ? formatDateYmd(sale.sale_date) : ''}</p>

                    <table className="w-full text-sm mb-2 border-b border-gray-400 border-dashed">
                        {/* <table className="w-full text-sm mb-2 border-separate border-spacing-2"> */}
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

                        <div className="mt-4 space-y-1 text-center">
                            <div>Paid with: {sale.payment_type.name}</div>
                            <div>Cashier: {sale.created_by.name}</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
