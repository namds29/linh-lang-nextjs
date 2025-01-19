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
    `${API_URL_WEBSITE}${API_ENDPOINTS.BLOGS}`,
    params
  )
  const data = res.data
  return data.payload
}

const deleteBlog = async (collectionId: string): Promise<void> => {
  const res = await api.delete(`${API_ENDPOINTS.COLLECTIONS}/${collectionId}`)
  if (res.status === 200) redirect('/products/collections')
}

const createBlog = async <T>(collection: ParamsBlog): Promise<any> => {
  try {
    const res = await api.post(`${API_ENDPOINTS.COLLECTIONS}`, collection)
    return res
  } catch (error) {
    return { message: error, status: 400 }
  }
}
const createImagesBlog = async (
  collectionId: string,
  body: File[]
): Promise<any> => {
  try {
    const formData = new FormData()
    body.forEach((file, index) => {
      formData.append('files', file) // 'file0', 'file1', etc.
    })
    const requestOptions: any = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    }
    const res = await fetch(
      `${API_URL}${API_ENDPOINTS.PRODUCT}/${collectionId}/images`,
      requestOptions
    )
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
    `${API_ENDPOINTS.COLLECTIONS}/${collectionId}`,
    body
  )
  return res
}
export default {
  fetchBlog,
  deleteBlog,
  createBlog,
  createImagesBlog,
  getDetailBlog,
  updateBlog
}
