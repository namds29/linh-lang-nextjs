import collectionsService from "@/services/collections.service";
import ClientPage from "./client-page";
import { columns } from "./components/column";


async function ProductCategories  () {
  const res: any = await collectionsService.fetchCollection();
  console.log(res);
  
  const data: any[] = res?.content;
  return <ClientPage data={data} columns={columns} />;
};

export default ProductCategories;
