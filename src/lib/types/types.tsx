// types/Product.ts

interface Provider {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  image: string // Assuming this is a string URL/path
  description: string | null // Can be string or null
  price: number
  comparePrice: number | null // Can be number or null
  provider: Provider
  category: Category
  createTime: string // ISO 8601 string
  updateTime: string | null // Can be string or null
  images: string[] // Array of image URLs/paths
  collections: any[] // Adjust type based on your collections structure
  variants: any[] // Adjust type based on your variants structure
}

interface ProductImage {
  id: string
  url: string
  orderIndex: number
}

interface Collection {
  id: string
  name: string
  description: string
  image: string
  autoSelect: boolean
  seo: {
    title: string
    description: string
    link: string
  }
}

export interface VariantProperty {
  attribute: string
  attributeName: string
  value: string
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string
  barCode: string
  active: boolean
  properties: VariantProperty[]
}

export interface ProductDetail {
  name: string
  provider: {
    name: string
  }
  category: {
    name: string
  }
  description: string
  quote?: string
  images?: ProductImage[]
  price: number
  comparePrice: number
  collections?: Collection[]
  variants?: ProductVariant[]
}
export default Product
