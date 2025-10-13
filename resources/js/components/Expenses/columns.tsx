"use client"

import { Button } from "@/components/ui/button"
import { formatDate, formatNumber } from "@/lib/utils"
import { Expense, Sale } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Expense>[] = [
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
        accessorKey: "expense_category.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        filterFn: 'includesString',
    },
    {
        accessorKey: "payment_type.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Payment Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        filterFn: 'includesString',
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-right">Amount</div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const formatted = formatNumber(parseFloat(row.getValue("amount"))*1)
            return <div className="text-center">{formatted}</div>
        },
        filterFn: 'inNumberRange',
    },
    {
        accessorKey: "description",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Description
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
