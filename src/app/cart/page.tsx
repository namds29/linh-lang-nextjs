import { Button } from '@/components/ui/button'
import { columns } from './components/column'
import { DataTable } from './components/data-table'
import data from './mock/data.json'; // Adjust the path as needed
import { Task } from './mock/types';
async function getData (): Promise<Task[]> {
  // Fetch data from your API here.
  return data
}
export async function Page () {
  const data = await getData()
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='text-2xl font-bold'>Danh sách đơn hàng</div>
        <div className='flex gap-4'>
          <Button variant={'outline'}>Xuất dữ liệu</Button>
          <Button>Tạo đơn hàng</Button>
        </div>
      </div>
      <div className=' py-10'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
export default Page
