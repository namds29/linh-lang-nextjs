import { api } from '@/lib/api.config'
import { API_ENDPOINTS, API_URL_WEBCONFIG } from '@/lib/routes/api'

const fetchBanners = async () => {
  const res = await api.get<any>(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}`
  )
  return res.data
}
const updateBanners = async (payload: { imageUrl: string }) => {
  const res = await api.put<any>(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}`,
    payload
  )
  return res
}
const addBanners = async (payload: { imageUrl: string }) => {
  const res = await api.put<any>(
    `${API_URL_WEBCONFIG}${API_ENDPOINTS.WEBCONFIG.BANNER}`,
    payload
  )
  return res
}
export default {
  fetchBanners,
  addBanners,
  updateBanners
}
