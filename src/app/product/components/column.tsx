'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-header-column'
import { Badge } from '@/components/ui/badge'
import { Product } from '../mock/types'
import { labels } from '../mock/label'
import { DataTableRowActions } from './data-table-row-actions'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import Image from 'next/image'

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên sản phảm' />
    ),
    cell: ({ row }) => (
      <div className='w-[320px] cursor-pointer'>
        <HoverCard>
          <HoverCardTrigger> <span className='hover:text-blue-500'>{row.getValue('name')}</span></HoverCardTrigger>
          <HoverCardContent>
            <div className='h-[220px] w-[100px]'>
              <Image
                className='p-4'
                alt='Description of the image'
                fill={true}
                src={
                  'https://product.hstatic.net/200000886003/product/artboard_1_copy_21_2x-100_1b8a1a2660774c8c952921f47fe23f2a_large.jpg'
                }
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Loại' />
    ),
    cell: ({ row }) => {
      const label = labels.find(label => label.value === row.original.category)

      return (
        <div className='flex space-x-2'>
          {label && <Badge variant='outline'>{label.label}</Badge>}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    }
  },
  {
    accessorKey: 'inventory',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tồn kho' />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue('inventory')}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue('inventory'))
    }
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nhà cung cấp' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.getValue('provider')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      console.log(id)

      return value.includes(row.getValue('provider'))
    }
  },
  {
    id: 'actions',
    cell: ({ table, row }) => <DataTableRowActions row={row} table={table} />
  }
]
