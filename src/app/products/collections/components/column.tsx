"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-header-column";
import { DataTableRowActions } from "./data-table-row-actions";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";

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
      <DataTableColumnHeader column={column} title="Tên nhóm" />
    ),
    cell: ({ row }) => (
      <div className="w-[220px] cursor-pointer">
        <HoverCard>
          <HoverCardTrigger>
            {" "}
            <span className="hover:text-blue-500">{row.getValue("name")}</span>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="h-[220px] w-[220px]">
              <img
                className="w-full h-full object-fill"
                alt="Description of the image"
                src={row.original.image}
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    ),

    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => {
      const htmlString = row.original.description;
      return (
        <div className="flex items-center">
          <div
            className="line-clamp-2"
            dangerouslySetInnerHTML={{ __html: htmlString }}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => <DataTableRowActions row={row} table={table} />,
  },
];
