"use client"

import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { DataTableViewOptions } from "./data-table-view-option"
import { labels, provider } from "../../../../lib/mock/label"
import { useEffect, useState } from "react"
import productsService from "@/services/products.service"
import { Category } from "@/lib/types/products.type"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [listCategories, setListCategories] = useState<Category[]>([])
  const isFiltered = table.getState().columnFilters.length > 0
  useEffect(()=>{
    const handleGetListCategory = async ()=>{
      const res = await productsService.fetchCategories()
      console.log(res);
      setListCategories(res)
    }
    handleGetListCategory()
  },[])
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter product..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Loại sản phẩm"
            options={listCategories}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}