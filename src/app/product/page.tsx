import { columns } from './components/column'

import ClientDataTable from './components/client-data-table'
import productsService from '@/services/products.service'
import Product from '@/lib/mock/types'

async function Page () {
  const res: any = await productsService.fetchProduct()
  const data: Product[] = res.content
  console.log(data)


  return <ClientDataTable data={data} columns={columns} />
}
export default Page
