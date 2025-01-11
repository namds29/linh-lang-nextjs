'use client'
import { Button } from '@/components/ui/button'
import { DataTable } from './components/data-table-config'
import { useRouter } from 'next/navigation'
import Product from '@/lib/mock/types'

interface ClientDataTableProps {
  columns: any
  data: Product[] // Adjust the type based on your data structure
}
const ClientPage = ({columns, data}: ClientDataTableProps) => {
  const navigate = useRouter()
  const handleAddProduct = () => {
    navigate.push('/products/add')
  }
  // console.log(data);
  
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='text-2xl font-bold'>Danh sách sản phẩm</div>
        <div className='flex gap-4'>
          <Button variant={'outline'}>Xuất dữ liệu</Button>
          <Button onClick={() => handleAddProduct()}>Tạo sản phẩm</Button>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg mt-4'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default ClientPage
