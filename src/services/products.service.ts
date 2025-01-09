import { API_ENDPOINTS, API_URL } from '@/lib/routes/api';
const fetchProduct = async () => {
    if(API_URL){
        const res = await fetch(API_URL + API_ENDPOINTS.PRODUCT);
        const data = await res.json()
        return data.payload 
    }
   return undefined
}
export default {fetchProduct}