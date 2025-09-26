"use client"

import { Button } from "@/components/ui/button"
import { formatDate, formatNumber } from "@/lib/utils"
import { Sale } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Sale>[] = [
    {
        accessorKey: "shop.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Shop
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        filterFn: 'includesString',
    },
    {
        accessorKey: "voucher_number",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Voucher Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        filterFn: 'includesString',
    },
    {
        accessorKey: "total",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-right">Total</div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const formatted = formatNumber(row.getValue("total"))
            return <div className="text-center">{formatted}</div>
        },
        filterFn: 'inNumberRange',
    },
    {
        accessorKey: "remark",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Remark
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        // header: "Reason",
        filterFn: 'includesString',
    },
    {
        accessorKey: "created_by.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Issued By
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        // header: "Done By",
        filterFn: 'includesString',
    },
    {
        accessorKey: "created_at",
        // header: () => <div className="text-center">Done On</div>,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Issued On
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const formatted = formatDate(row.getValue("created_at"))

            return <div className="text-center">{formatted}</div>
        },
        filterFn: 'includesString',
    },
]
