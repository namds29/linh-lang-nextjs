export enum FOLDER {
  PRODUCT = "PRODUCT",
  COLLECTIONS = "COLLECTIONS",
  CATEGORIES = "CATEGORIES",
  BLOGS = "BLOGS",
  BANNERS = "BANNERS",
}
export interface MenuItem {
  id: string;
  name: string;
  pathLink?: string;
  menuChild?: MenuItem[]; // Optional children for nested menus
}
export interface MenuItemEdit {
  id: string;
  isEdit: boolean;
  name: string;
  parentId?: string;
  pathLink?: string;
  pathType?: string;
  tag?: string;
  status: number;
  menuChild?: MenuItem[]; // Optional children for nested menus
}
export interface MenuTreeDetail {
  id: string;
  name: string;
  parentId: string;
  pathLink: string;
  pathRoot: string;
  pathType: string;
  status: number;
  tag: string;
  menuChild: MenuTreeDetail[]
}

export type ListBanners = {
  id: string;
  imageUrl: string;
  imageFile: File;
  orderIndex: number | null;
  isAdded?: boolean;
};
