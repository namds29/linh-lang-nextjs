export enum FOLDER {
  PRODUCT = "PRODUCT",
  COLLECTIONS = "COLLECTIONS",
  CATEGORIES = "CATEGORIES",
  BLOGS = "BLOGS",
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
  pathLink?: string;
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
