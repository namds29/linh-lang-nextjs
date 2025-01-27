export interface Menu {
    id: string ;
    name: string;
    parentId: string | null; // parentId can be a string or null
    pathRoot: string;
    pathType: string;
    pathLink: string;
    tag: string;
    createTime: string; // You could also use Date if you're parsing this into a Date object
    updateTime: string; // Same as above
    status: number;
}