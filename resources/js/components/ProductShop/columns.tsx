"use client"

import { Button } from "@/components/ui/button"
import { formatDate, formatNumber } from "@/lib/utils"
import { ProductShop } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<ProductShop>[] = [
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
        accessorKey: "product.name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        filterFn: 'includesString',
    },
    {
        accessorKey: "stock",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-right">Stock</div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const formatted = formatNumber(row.getValue("stock"))
            return <div className="text-center">{formatted}</div>
        },
        filterFn: 'inNumberRange',
    },
    // {
    //     accessorKey: "price",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 <div className="text-right">Price</div>
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const formatted = formatNumber(parseFloat(row.getValue("price"))*1)
    //         return <div className="text-center">{formatted}</div>
    //     },
    //     filterFn: 'inNumberRange',
    // },
    // {
    //     accessorKey: "remark",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Remark
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     // header: "Reason",
    //     filterFn: 'includesString',
    // },
    // {
    //     accessorKey: "created_by.name",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Done By
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     // header: "Done By",
    //     filterFn: 'includesString',
    // },
    // {
    //     accessorKey: "created_at",
    //     // header: () => <div className="text-center">Done On</div>,
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Done On
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const formatted = formatDate(row.getValue("created_at"))

    //         return <div className="text-center">{formatted}</div>
    //     },
    //     filterFn: 'includesString',
    // },
]