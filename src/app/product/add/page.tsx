"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import TextEditor from "@/lib/Editor";
import { labels, provider } from "@/lib/mock/label";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
export function ProductAddPage() {
  const [value, setValue] = useState('');

  useEffect(() => {}, []);

  return (
    <div>
      <div className="text-2xl font-bold text-red-400">Tạo sản phẩm</div>
      <div className="py-4 px-3 shadow-inner box-shadow-style mt-8 h-full rounded-md">
        <p className="font-bold">Thông tin chung</p>
        <Separator />
        <div className="mt-4 w-full">
          <section className="grid w-full items-center gap-1.5">
            <label className="text-sm" htmlFor="product">
              Tên sản phẩm
            </label>
            <Input
              className="w-full"
              type="text"
              id="product"
              placeholder="Email"
            />
          </section>
          <section className="grid grid-cols-2 w-full items-center mt-6 gap-6">
            <div>
              <label className="text-sm" htmlFor="provider">
                Nhà cung cấp
              </label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Chọn nhà cung cấp..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nhà cung cấp</SelectLabel>
                    {provider.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm" htmlFor="provider">
                Loại
              </label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Chọn loại..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Loại</SelectLabel>
                    {labels.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
          <section>
          <ReactQuill theme="snow" value={value} onChange={setValue} />
          </section>
        </div>
      </div>
    </div>
  );
}
export default ProductAddPage;
