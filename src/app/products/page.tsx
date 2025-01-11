import { columns } from "./components/column";

import ClientDataTable from "./client-page";
import productsService from "@/services/products.service";
import Product from "@/lib/types/types";

async function Page() {
  const res: any = await productsService.fetchProduct();
  const data: Product[] = res?.content;
  return <ClientDataTable data={data} columns={columns} />;
}
export default Page;
