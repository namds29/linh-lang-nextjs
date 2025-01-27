import { BlogPost } from "@/lib/types/blogs.type";

import ClientPage from "./client-page";
import { columns } from "./components/column";
import blogsService from "@/services/blogs.service";


export default async function Page() {
  const res: any = await blogsService.fetchBlog({page: 0, limit: 10});
  const data: BlogPost[] = res?.content;
  return <ClientPage data={data} columns={columns} />;
}
