import { api } from "@/lib/api.config";
import { API_ENDPOINTS, API_URL } from "@/lib/routes/api";
import { redirect } from "next/navigation";
const fetchCollection = async () => {
  if (API_URL) {
    const res = await api.get<any[]>(API_ENDPOINTS.COLLECTIONS);
    const data = res.data;
    return data.payload;
  }
  return undefined;
};

const deleteCollection = async (collectionId: string): Promise<void> => {
  const res = await api.delete(`${API_ENDPOINTS.COLLECTIONS}/${collectionId}`);
  if (res.status === 200) redirect("/products/collections");
};

const createCollection = async <T>(collection: ParamsCollections): Promise<any> => {
  try {
    const res = await api.post(`${API_ENDPOINTS.COLLECTIONS}`, collection);
    return res;
  } catch (error) {
    return { message: error, status: 400 };
  }
};
const createImagesCollection = async (
  collectionId: string,
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
      `${API_URL}${API_ENDPOINTS.PRODUCT}/${collectionId}/images`,
      requestOptions
    );
    return res;
  } catch (error) {
    return { message: error, status: 400 };
  }
};

const getDetailCollection = async (collectionId: string): Promise<CollectionDetail> => {
  const res = await api.get(API_ENDPOINTS.COLLECTIONS + "/" + collectionId);
  return res.data.payload as CollectionDetail;
};
const updateCollection = async (collectionId: string, body: any): Promise<any> =>{
  const res = await api.put(`${API_ENDPOINTS.COLLECTIONS}/${collectionId}`, body)
  return res
}
export default {
  fetchCollection,
  deleteCollection,
  createCollection,
  createImagesCollection,
  getDetailCollection,
  updateCollection
};
