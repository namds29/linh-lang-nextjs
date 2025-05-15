import { api } from "@/lib/api.config";
import { API_ENDPOINTS, API_URL_WEBCONFIG } from "@/lib/routes/api";
import { redirect } from "next/navigation";

const getToken = (): string | null => {
  console.log("token", localStorage.getItem("accessToken"));

  return localStorage.getItem("accessToken"); // Replace 'jwt_token' with your actual key
};
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
  myHeaders.append("Authorization", `Bearer ${getToken()}`);
  const res = await fetch(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: myHeaders,
    }
  );
  return res;
};
const addBanners = async (payload: { imageUrl: string }) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${getToken()}`);
  const res = await fetch(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}`,
    { method: "POST", body: JSON.stringify(payload), headers: myHeaders }
  );
  return res;
};
const deleteBanners = async (id: string): Promise<void> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${getToken()}`);
  const res = await fetch(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}/${id}`,
    { method: "DELETE", headers: myHeaders }
  );
  console.log(res);
};
export default {
  fetchBanners,
  addBanners,
  updateBanners,
  deleteBanners,
};
