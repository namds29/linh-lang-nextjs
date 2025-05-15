"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-header-column";
import { Badge } from "@/components/ui/badge";
import { labels } from "../../../lib/mock/label";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import Product from "@/lib/types/products.type";
import { formatCurrency } from "@/lib/pipes/currency";

export const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên sản phảm" />
    ),
    cell: ({ row }) => (
      <div className="w-[220px] cursor-pointer">
        <HoverCard>
          <HoverCardTrigger>
            <span className="hover:text-blue-500">{row.getValue("name")}</span>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="h-[220px] w-[220px]">
              <img
                className={`w-full h-full object-cover ${row.original.image.includes("null") ? "filter grayscale" : ""}`}
                alt="Description of the image"
                src={row.original.image}
                onError={(e) => {
                  e.currentTarget.src = "icon/error-img.png";
                }}
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    ),

    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Loại" />
    ),
    cell: ({ row }) => {
      const rowData = row.original.category;
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{rowData.name}</Badge>
          {/* {label && <Badge variant='outline'>{label.label}</Badge>} */}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.category.name);
    },
  },
  {
    accessorKey: "provider",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nhà cung cấp" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.original.provider.name}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue("provider"));
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giá bán" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{formatCurrency(row.original.price)}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      console.log(id);

      return value.includes(row.getValue("price"));
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => <DataTableRowActions row={row} table={table} />,
  },
];
