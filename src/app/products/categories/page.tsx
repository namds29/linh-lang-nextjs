import Product from "@/lib/types/types";
import productsService from "@/services/products.service";
import { columns } from "../components/column";
import ClientPage from "../client-page";

const ProductCategories = async () => {
  const res: any = await productsService.fetchProduct();
  const data: Product[] = res?.content;
  return <ClientPage data={data} columns={columns} />;
};

export default ProductCategories;
