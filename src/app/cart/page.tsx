"use client";
import { Button } from "@/components/ui/button";
import { columns } from "./components/column";
import { DataTable } from "./components/data-table";
import tasks from "./mock/data.json"; // Adjust the path as needed
import { Task } from "./mock/types";
import { useEffect, useState } from "react";
async function getData(): Promise<Task[]> {
  // Fetch data from your API here.
  return tasks;
}
export function Page() {
  const [data, setData] = useState<Task[]>([]);
  const handleAddProduct = () => {
    console.log(data);
    setData([
      ...data,
      {
        id: "TASK-8782",
        title:
          "You can't compress the program without quantifying the open-source SSD pixel!",
        status: "in progress",
        label: "documentation",
        priority: "medium",
      },
    ]);
  };
  useEffect(() => {
    const handleFetchData = async () => {
      const data = await getData();
      console.log(data);
      setData(data);
    };
    handleFetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Danh sách đơn hàng</div>
        <div className="flex gap-4">
          <Button variant={"outline"}>Xuất dữ liệu</Button>
          <Button onClick={() => handleAddProduct()}>Tạo đơn hàng</Button>
        </div>
      </div>
      <div className=" py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
export default Page;
