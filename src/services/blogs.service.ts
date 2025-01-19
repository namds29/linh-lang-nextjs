import { api } from '@/lib/api.config'
import { API_ENDPOINTS, API_URL, API_URL_WEBSITE } from '@/lib/routes/api'
import { BlogPost, ParamsBlog } from '@/lib/types/blogs.type'
import { redirect } from 'next/navigation'

type ParamsFetchBlogs = {
  page?: number
  limit?: number
  title?: string
  blogCategory?: string
  tag?: string
  contain?: string
  createUser?: string
}
const fetchBlog = async (params: ParamsFetchBlogs) => {
  const res = await api.post<any>(
    `${API_URL_WEBSITE}${API_ENDPOINTS.BLOGS}/search`,
    params
  )
  const data = res.data
  return data.payload
}

const deleteBlog = async (collectionId: string): Promise<void> => {
  const res = await api.delete(`${API_URL_WEBSITE}${API_ENDPOINTS.BLOGS}/${collectionId}`)
  if (res.status === 200) redirect('/products/collections')
}

const createBlog = async (params: ParamsBlog): Promise<any> => {
  try {
    const res = await api.post(`${API_URL_WEBSITE}${API_ENDPOINTS.BLOGS}`, params)
    return res
  } catch (error) {
    return { message: error, status: 400 }
  }
}

const getDetailBlog = async (collectionId: string): Promise<BlogPost> => {
  const res = await api.get(API_ENDPOINTS.COLLECTIONS + '/' + collectionId)
  return res.data.payload as BlogPost
}
const updateBlog = async (collectionId: string, body: any): Promise<any> => {
  const res = await api.put(
    `${API_URL_WEBSITE}${API_ENDPOINTS.COLLECTIONS}/${collectionId}`,
    body
  )
  return res
}
export default {
  fetchBlog,
  deleteBlog,
  createBlog,
  getDetailBlog,
  updateBlog
}
