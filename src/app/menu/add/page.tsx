"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MenuItem } from "@/lib/types/utils.types";
import { useState } from "react";
import { MenuTree } from "@/components/layout/menu-tree";
import { DialogClose } from "@radix-ui/react-dialog";
import { Separator } from "@/components/ui/separator";
import menusService from "@/services/menus.service";
const listDirection = [
  "Trang chủ",
  "Nhóm sản phẩm",
  "Sản phẩm",
  "Tất cả sản phẩm",
];
interface ItemProps {
  name: string;
  pathLink: string;
}
export function Page() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [title, setTitle] = useState<string>("");
  const [newParentProps, setNewParentProps] = useState<ItemProps>({
    name: "",
    pathLink: "",
  }); // State for new parent name
  const [childProps, setChildProps] = useState<ItemProps>({
    name: "",
    pathLink: "",
  }); // State for new parent name

  const addChild = (parentId: string) => {
    const newMenuItem: MenuItem = {
      id: Math.random().toString(), // Use a unique ID generator in production
      name: childProps.name,
      pathLink: childProps.pathLink,
      menuChild: [],
    };

    const addItemRecursively = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            menuChild: [...(item.menuChild || []), newMenuItem],
          };
        }
        if (item.menuChild) {
          return { ...item, menuChild: addItemRecursively(item.menuChild) };
        }
        return item;
      });
    };

    setMenuData((prevData) => addItemRecursively(prevData));
    setChildProps({ name: "", pathLink: "" });
  };
  const deleteItem = (id: string) => {
    const deleteItemRecursively = (items: MenuItem[]): MenuItem[] => {
      return items.filter((item) => {
        if (item.id === id) {
          return false; // Do not include the item to delete
        }
        if (item.menuChild) {
          item.menuChild = deleteItemRecursively(item.menuChild);
        }
        return true; // Include the item
      });
    };

    setMenuData((prevData) => deleteItemRecursively(prevData));
  };
  const addParent = () => {
    if (!newParentProps.name.trim()) return; // Prevent adding empty names
    const newParent: MenuItem = {
      id: Math.random().toString(),
      name: newParentProps.name,
      menuChild: [],
    };
    setMenuData([...menuData, newParent]);
    setNewParentProps({ ...newParentProps, name: "" }); // Clear the input field
  };

  const removeIdFields = (obj: any) => {
    return JSON.parse(
      JSON.stringify(obj, (key, value) => {
        // Exclude the id field
        return key === "id" ? undefined : value;
      })
    );
  };
  const handleSubmitForm = async () => {
    const mappedParams = {
      name: title,
      pathRoot: newParentProps.pathLink,
      pathType: "ROOT",
      pathLink: newParentProps.pathLink,
      tag: "ROOT_TAG",
      menuChild: menuData,
    };
    const params = removeIdFields(mappedParams);
    console.log("params", params);
    const res = await menusService.createMenu(params);
    console.log(res);
  };
  return (
    <div className="py-4">
      <div className="text-2xl font-bold text-red-400">Thêm menu</div>
      <div className="mt-8 flex gap-8">
        <section className="w-[70%]">
          <div className="py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md">
            <div className="w-full">
              <section className="grid w-full items-center gap-1.5">
                <label className="text-md" htmlFor="title">
                  Tên menu
                </label>
                <Input
                  required
                  className="w-full"
                  type="text"
                  id="title"
                  placeholder="Tên menu"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </section>
            </div>
          </div>

          <section className="mt-6 py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md">
            <div className="w-full">
              <section className="grid w-full items-center gap-1.5">
                <div className="text-md flex justify-between">
                  <p>Liên kết menu</p>

                  <Dialog>
                    <DialogTrigger className="bg-black text-white px-3 py-1 rounded-md text-sm">
                      Tạo liên kết menu
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm liên kết</DialogTitle>
                        <div className="text-black !mt-6">
                          <div>
                            <label className="text-md" htmlFor="name">
                              Tên liên kết
                            </label>
                            <Input
                              required
                              className="w-full"
                              type="text"
                              id="name"
                              placeholder="Tên của liên kết"
                              onChange={(e) =>
                                setNewParentProps({
                                  ...newParentProps,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="mt-4">
                            <label className="text-md" htmlFor="link-to">
                              Liên kết đến
                            </label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Trang chủ" />
                              </SelectTrigger>
                              <SelectContent>
                                {listDirection.map((item, index) => (
                                  <SelectItem key={item + index} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            className="bg-gray-300"
                            variant="secondary"
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type="submit" onClick={addParent}>
                            Lưu
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="mt-6">
                  <MenuTree
                    childProps={childProps}
                    setChildProps={setChildProps}
                    items={menuData}
                    addChild={addChild}
                    deleteItem={deleteItem}
                  />
                </div>
              </section>
            </div>
          </section>
        </section>

        <section className="w-[30%]">
          <div className="w-full py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md ">
            <p className="font-bold">Đường dẫn</p>
            <input
              className="w-full border-gray-300 border px-4 py-1 rounded-md"
              required
              type="text"
              placeholder="Đường dẫn"
              // value={blog.displayTime as string}
              onChange={(e) =>
                setNewParentProps({
                  ...newParentProps,
                  pathLink: e.target.value,
                })
              }
            />
          </div>
        </section>
      </div>
      <Separator className="mt-8" />
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmitForm}>Thêm menu</Button>
      </div>
    </div>
  );
}
export default Page;
