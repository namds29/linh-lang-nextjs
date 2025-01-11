
import { api } from "@/lib/api.config";
import Product, { Category } from "@/lib/mock/types";
import { API_ENDPOINTS, API_URL } from "@/lib/routes/api";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
const fetchProduct = async () => {
 
  if (API_URL) {
    // const res = await fetch(API_URL + API_ENDPOINTS.PRODUCT);
    const res = await api.get<Product[]>(API_ENDPOINTS.PRODUCT, ['products']);
    console.log(res);

    const data = res.data;
    return data.payload;
  }
  return undefined;
};
const fetchCategories = async (): Promise<Category[]> => {
  const listProduct = (await fetchProduct()) as any;
  const filterCategory = listProduct.content.map((item: Product) => ({
    id: item.id,
    name: item.category.name,
  }));
  const listCategory = [
    ...new Map(
      filterCategory.map((item: Category) => [item.name, item])
    ).values(),
  ] as Category[];

  return listCategory;
};
const deleteProduct = async (productId: string): Promise<void> => {
  const res = await api.delete(`${API_ENDPOINTS.PRODUCT}/${productId}`);
  redirect('/products')
};
export default { fetchProduct, fetchCategories, deleteProduct };
