import { api } from "@/lib/api.config"
import { API_ENDPOINTS, API_URL_WEBCONFIG } from "@/lib/routes/api"

const fetchBanners = async () => {
  const res = await api.get<any>(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}`
  )
  return res
}
export default {
  fetchBanners
}