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

const deleteBlog = async (body: BlogPost): Promise<void> => {
  const res = await api.post(`${API_URL_WEBSITE}${API_ENDPOINTS.BLOGS}/update`, body);
  if (res.status > 200 && res.status < 400) redirect('/blogs')
}

const createBlog = async (params: ParamsBlog): Promise<any> => {
  try {
    const res = await api.post(`${API_URL_WEBSITE}${API_ENDPOINTS.BLOGS}`, params)
    return res
  } catch (error) {
    return { message: error, status: 400 }
  }
}

const getDetailBlog = async (id: string): Promise<BlogPost> => {
  const res = await api.get(API_URL_WEBSITE + API_ENDPOINTS.BLOGS + '/' + id)
  return res.data.payload as BlogPost
}
const updateBlog = async (body: BlogPost): Promise<any> => {
  const res = await api.post(`${API_URL_WEBSITE}${API_ENDPOINTS.BLOGS}/update`, body);
  if (res.status > 200 && res.status < 400) redirect('/blogs')
  return res
}
export default {
  fetchBlog,
  deleteBlog,
  createBlog,
  getDetailBlog,
  updateBlog
}
