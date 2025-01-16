'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-header-column'
import { Badge } from '@/components/ui/badge'
import { DataTableRowActions } from './data-table-row-actions'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import Image from 'next/image'
import Product from '@/lib/types/products.type'
import { formatCurrency } from '@/lib/pipes/currency'

export const columns: ColumnDef<any>[] = [
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
      <DataTableColumnHeader column={column} title='Tên nhóm' />
    ),
    cell: ({ row }) => (
      <div className='w-[220px] cursor-pointer'>
        <HoverCard>
          <HoverCardTrigger>
            {' '}
            <span className='hover:text-blue-500'>{row.getValue('name')}</span>
          </HoverCardTrigger>
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

    enableHiding: false
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mô tả' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.original.description}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ table, row }) => <DataTableRowActions row={row} table={table} />
  }
]
