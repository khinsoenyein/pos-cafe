"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Purchase, Sale } from "@/types";
import { formatDateYmd, formatNumber } from "@/lib/utils";

interface VoucherDialogProps {
    //   voucherNumber: string;
    voucher: Purchase,
    children: React.ReactNode;
}

const appTitle = import.meta.env.VITE_APP_TITLE || 'POS System';

export function VoucherDialog({ voucher, children }: VoucherDialogProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-lg z-50">
                <DialogHeader>
                    {/* <DialogTitle className="sr-only">Purchase Voucher – {voucher.voucher_number}</DialogTitle> */}
                    <DialogTitle>Purchase Voucher</DialogTitle>
                </DialogHeader>
                {/* Replace below with real receipt details */}
                <div className="text-sm">
                    <p className="text-center text-lg font-semibold mb-2">{appTitle}</p>
                    <p className="text-center mb-2">Voucher No: {voucher.voucher_number}</p>
                    <p className="text-center mb-2">Date: {voucher.purchase_date ? formatDateYmd(voucher.purchase_date) : ''}</p>

                    <table className="w-full text-sm mb-2 border-b border-gray-400 border-dashed">
                        {/* <table className="w-full text-sm mb-2 border-separate border-spacing-2"> */}
                        <thead>
                            <tr className="border-t border-b border-gray-400 border-dashed">
                                <th className="text-left px-2 py-1">#</th>
                                <th className="text-left px-2 py-1">Item</th>
                                <th className="text-left px-2 py-1">Unit</th>
                                <th className="text-right px-2 py-1">Price</th>
                                <th className="text-right px-2 py-1">Qty</th>
                                <th className="text-right px-2 py-1">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voucher.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="text-center px-2 py-1">{idx + 1}</td>
                                    <td className="text-left px-2 py-1">{item.ingredient.name}</td>
                                    <td className="text-left px-2 py-1">{item.unit.symbol}</td>
                                    <td className="text-right px-2 py-1">{formatNumber(parseFloat(item.price) * 1)}</td>
                                    <td className="text-right px-2 py-1">{item.qty * 1}</td>
                                    <td className="text-right px-2 py-1">{formatNumber(item.qty * parseFloat(item.price))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 space-y-1 text-right">
                        <div>Sub Total: <span>{formatNumber(voucher.total * 1)}</span></div>
                        <div>Other Cost: <span>{formatNumber(voucher.other_cost * 1)}</span></div>
                        <div>Grand Total: <span className="text-green-600">{formatNumber(voucher.grand_total * 1)}</span></div>

                        <div className="mt-4 space-y-1 text-center">
                            {/* <div>Paid by: {voucher.payment_type.name}</div> */}
                            <div>Cashier: {voucher.created_by.name}</div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
