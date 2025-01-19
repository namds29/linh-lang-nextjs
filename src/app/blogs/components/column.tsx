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
import { BlogPost } from '@/lib/types/blogs.type'

export const columns: ColumnDef<BlogPost>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tiêu đề' />
    ),
    cell: ({ row }) => (
      <div className='w-[220px] cursor-pointer'>
        <HoverCard>
          <HoverCardTrigger>
            <span className='hover:text-blue-500'>{row.getValue('title')}</span>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className='h-[220px] w-[220px]'>
              <img
                className='w-full h-full object-fill'
                alt='Description of the image'
                src={row.original.image}
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    ),

    enableHiding: false
  },
  {
    accessorKey: 'tag',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tag' />
    ),
    cell: ({ row }) => {
      const rowData = row.original.tag
      const listTags = rowData.split(',')

      return (
        <div>
          {listTags.length > 0 &&
            listTags.map((item: string, index: number) => (
              <div key={item + index} className='mt-2'>
                <Badge variant='outline'>{item}</Badge>
              </div>
            ))}

          {/* {label && <Badge variant='outline'>{label.label}</Badge>} */}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.blogCategory)
    }
  },
  {
    accessorKey: 'blogCategory',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Danh mục' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.original.blogCategory}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue('tag'))
    }
  },
  {
    accessorKey: 'createUser',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nguời tạo' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.original.createUser}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue('createUser'))
    }
  },
  {
    accessorKey: 'createTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày hiển thị' />
    ),
    cell: ({ row }) => {
      const date = new Intl.DateTimeFormat('vi-VN').format(new Date(row.original.createTime))

      return (
        <div className='flex items-center'>
          <span>{date}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue('createUser'))
    }
  },
  {
    id: 'actions',
    cell: ({ table, row }) => <DataTableRowActions row={row} table={table} />
  }
]
