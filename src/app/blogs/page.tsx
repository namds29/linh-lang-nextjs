import { BlogPost } from "@/lib/types/blogs.type";

import ClientPage from "./client-page";
import { columns } from "./components/column";
import blogsService from "@/services/blogs.service";


async function Page() {
  const res: any = await blogsService.fetchBlog({page: 0, limit: 10});
  
  console.log(res);
  const data: BlogPost[] = res?.content;
  return <ClientPage data={data} columns={columns} />;
}
export default Page;
