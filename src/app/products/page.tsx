import { columns } from "./components/column";

import productsService from "@/services/products.service";
import Product from "@/lib/types/products.type";
import ClientPage from "./client-page";

async function Page() {
  const res: any = await productsService.fetchProduct();
  const data: Product[] = res?.content;
  console.log(data);
  
  return <ClientPage data={data} columns={columns} />;
}
export default Page;
