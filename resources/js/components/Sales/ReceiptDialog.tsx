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
import { formatNumber } from "@/lib/utils";

interface ReceiptDialogProps {
    //   voucherNumber: string;
    voucher: Sale,
    children: React.ReactNode;
}

const appTitle = import.meta.env.VITE_APP_TITLE || 'POS System';

export function ReceiptDialog({ voucher, children }: ReceiptDialogProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-lg z-50">
                <DialogHeader>
                    <DialogTitle className="sr-only">Sale Voucher – {voucher.voucher_number}</DialogTitle>
                </DialogHeader>
                {/* Replace below with real receipt details */}
                <div className="text-sm">
                    <p className="text-center text-lg font-semibold mb-2">{appTitle}</p>
                    <p className="text-center mb-2">Voucher No: {voucher.voucher_number}</p>

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
                            {voucher.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{item.product.name}</td>
                                    <td className="text-right px-2 py-1">{formatNumber(item.price * 1)}</td>
                                    <td className="text-right px-2 py-1">{item.qty}</td>
                                    <td className="text-right px-2 py-1">{(item.qty * item.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 space-y-1 text-right">
                        <div className="font-semibold">Total: <span>{formatNumber(voucher.total * 1)}</span></div></div>

                    <div className="mt-4 space-y-1 text-center">
                        <span>
                            Date: {voucher.sale_date ? new Date(voucher.sale_date).toISOString().split('T')[0] : ''}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
