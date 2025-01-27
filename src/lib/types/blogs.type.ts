export interface BlogPost {
  id: string;
  title?: string;
  content?: string;
  createUser?: string;
  blogCategory?: string;
  blogQuote?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  canonicalUrl?: string;
  metaIndex?: string;
  metaFollow?: string;
  displayTime?: string | Date;
  isDisplay?: number | boolean; // Allow both number and boolean
  image?: string;
  imageDescription?: string;
  tag?: string; // Or string[] if you want to split the tags
  status?: number; // Or a specific enum if you have status codes
  pageInterface?: string;
  createTime?: string | Date;
  updateTime?: string | Date;
}

export interface ParamsBlog {
  title?: string;
  content?: string;
  createUser?: string;
  blogCategory?: string;
  blogQuote?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoUrl?: string;
  canonicalUrl?: string;
  metaIndex?: string;
  metaFollow?: string;
  displayTime?: string | Date;
  isDisplay?: number | boolean; // Allow both number and boolean
  image?: string;
  imageDescription?: string;
  tag?: string; // Or string[] if you want to split the tags
  status?: number; // Or a specific enum if you have status codes
  pageInterface?: string;
  createTime?: string | Date;
  updateTime?: string | Date;
}
