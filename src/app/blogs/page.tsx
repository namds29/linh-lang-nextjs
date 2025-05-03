'use client'
import { BlogPost } from "@/lib/types/blogs.type";

import ClientPage from "./client-page";
import { columns } from "./components/column";
import blogsService from "@/services/blogs.service";
import { useEffect, useState } from "react";


export default function Page() {
  const [data, setData] = useState<BlogPost[]>([]);
  // const data: BlogPost[] = res?.content;
  useEffect(() => {
    const handleFetchBlog = async () => {
      const res: any = await blogsService.fetchBlog({page: 0, limit: 10});
      setData(res.content);
    }
    handleFetchBlog()
  }, [])
  return <ClientPage data={data} columns={columns} />;
}
