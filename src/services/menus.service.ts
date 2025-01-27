import { api } from "@/lib/api.config";
import { API_ENDPOINTS, API_URL_WEBSITE } from "@/lib/routes/api";
import { MenuItem, MenuTreeDetail } from "@/lib/types/utils.types";
type ParamsMenuItiem = {
  id?: string;
  name: string;
  pathLink?: string;
  menuChild?: MenuItem[];
};
const fetchMenu = async () => {
  const res = await api.get<any>(
    `${API_URL_WEBSITE}${API_ENDPOINTS.MENU}/config/parentMenu`
  );
  const data = res.data;
  return data.payload;
};
const createMenu = async (params: ParamsMenuItiem): Promise<any> => {
  try {
    const res = await api.post(
      `${API_URL_WEBSITE}${API_ENDPOINTS.MENU}/config`,
      params
    );
    return res;
  } catch (error) {
    return { message: error, status: 400 };
  }
};
const fetchDetailMenu = async (parentId: string) => {
  const res = await api.get<MenuTreeDetail>(
    `${API_URL_WEBSITE}${API_ENDPOINTS.MENU}/config/${parentId}`
  );
  const data = res.data;
  return data.payload;
};
const updateMenu = async (params: ParamsMenuItiem): Promise<any> => {
  try {
    const res = await api.post(
      `${API_URL_WEBSITE}${API_ENDPOINTS.MENU}/config/update`,
      params
    );
    return res;
  } catch (error) {
    return { message: error, status: 400 };
  }
};
export default { fetchMenu, createMenu, fetchDetailMenu, updateMenu };
