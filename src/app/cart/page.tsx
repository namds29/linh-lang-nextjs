import { Button } from '@/components/ui/button'
import { columns, Payment } from './column'
import { DataTable } from './data-table'
async function getData (): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com'
    }
    // ...
  ]
}
export async function Page () {
  const data = await getData()
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>Danh sách đơn hàng</div>
        <div className='flex gap-4'>
          <Button variant={'outline'}>Xuất dữ liệu</Button>
          <Button>Tạo đơn hàng</Button>
        </div>
      </div>
      <div className='container mx-auto py-10'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}
export default Page
