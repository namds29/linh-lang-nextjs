import productsService from "@/services/products.service";
import Product from "@/lib/types/products.type";
import ClientPage from "./products/client-page";
import { columns } from "./products/components/column";


async function Page() {
  const res: any = await productsService.fetchProduct();
  const data: Product[] = res?.content;
  return <ClientPage data={data} columns={columns} />;
}
export default Page;
