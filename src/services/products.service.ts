import Product, { Category } from '@/lib/mock/types';
import { API_ENDPOINTS, API_URL } from '@/lib/routes/api';
const fetchProduct = async () => {
    if(API_URL){
        const res = await fetch(API_URL + API_ENDPOINTS.PRODUCT);
        const data = await res.json()
        return data.payload 
    }
   return undefined
}
const fetchCategories = async (): Promise<Category[]> => {
    const listProduct = await fetchProduct();
    const filterCategory = listProduct.content.map((item: Product) => ({id: item.id, name: item.category.name}));
    const listCategory = 
      [...new Map(filterCategory.map((item: Category) => [item.name, item])).values()] as Category[]

    return listCategory
}
export default {fetchProduct, fetchCategories}