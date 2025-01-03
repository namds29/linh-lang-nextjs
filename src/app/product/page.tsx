"use client";
import { Button } from "@/components/ui/button";
import { columns } from "./components/column";
import { DataTable } from "./components/data-table";
import product from "@/services/product.json"; // Adjust the path as needed
import { Product } from "./mock/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
async function getData(): Promise<Product[]> {
  // Fetch data from your API here.
  return product;
}
export function Page() {
  const [data, setData] = useState<Product[]>([]);
  const navigate = useRouter()
  const handleAddProduct = () => {
    navigate.push('/product/add')
  };
  useEffect(() => {
    const handleFetchData = async () => {
      const data = await getData();
      setData(data);
    };
    handleFetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Danh sách sản phẩm</div>
        <div className="flex gap-4">
          <Button variant={"outline"}>Xuất dữ liệu</Button>
          <Button onClick={() => handleAddProduct()}>Tạo sản phẩm</Button>
        </div>
      </div>
      <div className=" py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
export default Page;
