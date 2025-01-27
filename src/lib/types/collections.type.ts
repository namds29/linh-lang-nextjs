interface CollectionDetail {
  id: string,
  name: string,
  description?: string,
  image?: string,
  autoSelect?: boolean,
  seo?: {
    title: string,
    description: string,
    link: string,
  }
}

interface ParamsCollections {
  name: string,
  description?: string,
  image?: string,
  autoSelect?: boolean,
  seo?: {
    title: string,
    description: string,
    link: string,
  }
}