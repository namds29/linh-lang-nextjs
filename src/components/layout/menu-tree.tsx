import { MenuItem } from "@/lib/types/utils.types";
import { ChevronDown, ChevronRight, CirclePlus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
const listDirection = [
  "Trang chủ",
  "Nhóm sản phẩm",
  "Sản phẩm",
  "Tất cả sản phẩm",
];
export const MenuTree: React.FC<{
  items: MenuItem[];
  addChild: (parentId: string) => void;
  deleteItem: (id: string) => void;
  childProps: {
    name: string;
    pathLink: string;
  };
  setChildProps: any;
}> = ({ items, addChild, deleteItem, setChildProps, childProps }) => {
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  // Function to toggle the expanded state
  const toggleItem = (id: string) => {
    console.log(id);

    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the current item's expanded state
    }));
  };
  return (
    <ul className="menu-tree">
      {items.map((item, index) => (
        <li key={ index}>
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div>{item.name}</div>
                {item.menuChild && item.menuChild.length > 0 && (
                  <div
                    onClick={() => toggleItem(item.id)}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                  >
                    {expandedItems[item.id] ? (
                      <ChevronRight />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger className="bg-black text-white  rounded-md text-sm">
                    <span>
                      <CirclePlus size={20} />
                    </span>
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
                            onChange={(e) => setChildProps({ ...childProps, name: e.target.value })}
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
                        <Button type="submit" onClick={() => addChild(item.id)}>
                          Lưu
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => deleteItem(item.id)}
                  variant={"outline"}
                  className="bg-red-400 text-white"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            <div>
              {!expandedItems[item.id] &&
                item.menuChild &&
                item.menuChild.length > 0 && (
                  <MenuTree
                    childProps={childProps}
                    setChildProps={setChildProps}
                    items={item.menuChild}
                    addChild={addChild}
                    deleteItem={deleteItem}
                  />
                )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
