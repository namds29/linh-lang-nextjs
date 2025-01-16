import { api } from "@/lib/api.config";
import Product, { Category, ProductDetail } from "@/lib/types/products.type";
import { API_ENDPOINTS, API_URL } from "@/lib/routes/api";
import { redirect } from "next/navigation";
const fetchProduct = async () => {
  if (API_URL) {
    // const res = await fetch(API_URL + API_ENDPOINTS.PRODUCT);
    const res = await api.get<Product[]>(API_ENDPOINTS.PRODUCT, ["products"]);
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
  if (res.status === 200) redirect("/products");
};

const createProduct = async <T>(product: ProductDetail): Promise<any> => {
  try {
    const res = await api.post(`${API_ENDPOINTS.PRODUCT}`, product);
    return res;
  } catch (error) {
    return { message: error, status: 400 };
  }
};
const createImagesProduct = async (
  productId: string,
  body: File[]
): Promise<any> => {
  try {
    const formData = new FormData();
    body.forEach((file, index) => {
      formData.append("files", file); // 'file0', 'file1', etc.
    });
    const requestOptions: any = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };
    const res = await fetch(
      `${API_URL}${API_ENDPOINTS.PRODUCT}/${productId}/images`,
      requestOptions
    );
    return res;
  } catch (error) {
    return { message: error, status: 400 };
  }
};

const getDetailProduct = async (productId: string): Promise<ProductDetail> => {
  const res = await api.get(API_ENDPOINTS.PRODUCT + "/" + productId);
  return res.data.payload as ProductDetail;
};
const updateProduct = async (productId: string, body: any): Promise<any> =>{
  const res = await api.put(`${API_ENDPOINTS.PRODUCT}/${productId}`, body)
  return res
}
export default {
  fetchProduct,
  fetchCategories,
  deleteProduct,
  createProduct,
  createImagesProduct,
  getDetailProduct,
  updateProduct
};
