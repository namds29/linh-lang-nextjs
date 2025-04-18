import { api } from "@/lib/api.config";
import { API_ENDPOINTS, API_URL_WEBCONFIG } from "@/lib/routes/api";
import { redirect } from "next/navigation";

const fetchBanners = async () => {
  const res = await api.get<any>(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}`
  );
  return res.data;
};
const updateBanners = async (
  id: string,
  payload: { imageUrl: string; orderIndex?: number }
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const res = await fetch(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}/${id}`,
    {
      method: "PUT", body: JSON.stringify(payload), headers: myHeaders
    }
  );
  return res;
};
const addBanners = async (payload: { imageUrl: string }) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const res = await fetch(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}`,
    { method: "POST", body: JSON.stringify(payload), headers: myHeaders }
  );
  return res;
};
const deleteBanners = async (id: string): Promise<void> => {
  const res = await fetch(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}/${id}`,
    { method: "DELETE" }
  );
  console.log(res);
};
export default {
  fetchBanners,
  addBanners,
  updateBanners,
  deleteBanners,
};
