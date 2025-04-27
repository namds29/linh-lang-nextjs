import productsService from "@/services/products.service";
import Product from "@/lib/types/products.type";
import { columns } from "./products/components/column";
import ClientPage from "./products/client-page";

async function Page() {
  const res: any = await productsService.fetchProduct();
  const data: Product[] = res?.content;
  return <ClientPage data={data} columns={columns} />;
}
export default Page;
