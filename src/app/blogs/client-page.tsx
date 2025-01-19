'use client'
import { Button } from '@/components/ui/button'
import { DataTable } from './components/data-table-config'
import { useRouter } from 'next/navigation'
import Product from '@/lib/types/products.type'
import { BlogPost } from '@/lib/types/blogs.type'

interface ClientDataTableProps {
  columns: any
  data: BlogPost[] // Adjust the type based on your data structure
}
const ClientPage = ({columns, data}: ClientDataTableProps) => {
  console.log(data);
  
  const navigate = useRouter()
  const handleAddBlog = () => {
    navigate.push('/blogs/add')
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='text-2xl font-bold'>Danh sách bài viết</div>
        <div className='flex gap-4'>
          <Button variant={'outline'}>Xuất dữ liệu</Button>
          <Button onClick={() => handleAddBlog()}>Tạo bài viết</Button>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg mt-4'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default ClientPage
