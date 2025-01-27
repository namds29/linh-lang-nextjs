"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import menusService from "@/services/menus.service";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface ClientDataTableProps {
  // columns: any
  // data: BlogPost[] // Adjust the type based on your data structure
}
const ClientPage = ({}: ClientDataTableProps) => {
  const [columnTitle, setColumnTitle] = useState<{id: string, name: string}[]>([]);
  const navigate = useRouter()
  useEffect(() => {
    const handleGetMenu = async () => {
      const res = await menusService.fetchMenu();
      console.log(res);
      const listTitle = res.content.map((item: any) => ({id: item.id, name: item.name}));
      console.log(listTitle);
      setColumnTitle(listTitle);
    };
    handleGetMenu();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Menu</div>
        <div className="flex gap-4">
          <Button variant={"default"}>URL redirects</Button>
        </div>
      </div>
      <div className="p-4 rounded-lg mt-4 flex gap-6">
        <div className="w-1/2">
          <p>Menu</p>
          <p>
            Menu hoặc danh sách liên kết website , giúp khách hàng chuyển trang
            trong cửa hàng của bạn. Bạn có thể tạo các menu lồng nhau để hiện
            thị drop-down menus
          </p>
        </div>
        <div className="bg-white w-1/2 p-4 rounded-xl">
          <div className="flex justify-between mb-4 items-center">
            <p>Menus</p>
            <div>
              <Button type="button" variant={"ghost"} className="text-blue-500 font-bold" onClick={()=> navigate.push('/menu/add')}>
                Thêm menu
              </Button>
            </div>
          </div>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="">Tiêu Đề</TableHead>
                <TableHead>Tác vụ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columnTitle.map((item, index) => (
                <TableRow key={item.id + index}>
                  <TableCell className="font-medium w-1/2">{item.name}</TableCell>
                  <TableCell className="flex gap-4">
                    <Button type="button" onClick={()=> navigate.push(`/menu/${item.id}/edit`)}>Chỉnh sửa</Button>
                    <Button variant={"outline"} className="bg-red-400 text-white">
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
