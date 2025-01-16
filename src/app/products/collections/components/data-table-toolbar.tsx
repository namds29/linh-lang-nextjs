"use client"

import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"

import { DataTableViewOptions } from "./data-table-view-option"


interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter collections..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}