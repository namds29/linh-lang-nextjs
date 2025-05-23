"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FOLDER, ListBanners } from "@/lib/types/utils.types";
import bannersService from "@/services/banners.service";
import uploadImageService from "@/services/upload-image.service";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { log } from "util";

const mockData = [
  {
    id: "12a",
    imgUrl:
      "https://i0.wp.com/plopdo.com/wp-content/uploads/2021/11/feature-pic.jpg?fit=537%2C322&ssl=1",
    orderIndex: 1,
  },
  {
    id: "21c",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
    orderIndex: 2,
  },
  {
    id: "31b",
    imgUrl:
      "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
    orderIndex: 3,
  },
];

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  // display: "flex",
});
const generateUniqueId = () => {
  const uniqueId = Date.now();
  return `id-${Math.random().toString(36).substr(2, 9)}`;
};
function Page() {
  const [listImg, setListImg] = useState<ListBanners[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: "none",
    width: "100%",
    padding: "1rem",
    background: isDragging ? "lightgreen" : "#f3f4f6",
    ...draggableStyle,
  });
  function onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      listImg,
      result.source.index,
      result.destination.index
    );
    setListImg(items);
  }
  const handleAddImage = (e: any) => {
    const listFile: File[] = Array.from(e.target.files);
    const listUrlImg = listFile.map((file: any) => {
      return {
        id: generateUniqueId(),
        imageFile: file,
        imageUrl: URL.createObjectURL(file),
        orderIndex: null,
        isAdded: true,
      };
    });
    setListImg([...listImg, ...listUrlImg]);
    setIsEdit(true);
  };
  const handleSave = async () => {
    if (isEdit) {
      const payload = listImg.map((item, index) => {
        return {
          id: item.id,
          imgFile: item.imageFile,
          imgUrl: item.imageUrl,
          orderIndex: index + 1,
          isAdded: item.isAdded,
        };
      });
      const listImageAdded = payload.filter((item) => item.isAdded);
      const listFileAdded = listImageAdded.map((item) => item.imgFile);
      let listBannerUrl = [];
      if (listFileAdded.length > 0) {
        const res = await uploadImageService.uploadImage(
          FOLDER.BANNERS,
          listFileAdded
        );
        listBannerUrl = res.payload;
        // params.image = res.payload[0];
      }
      for (const img of listBannerUrl) {
        try {
          const res = await bannersService.addBanners({ imageUrl: img });
        } catch (error) {
        }
      }

      for (const item of payload) {
        try {
          const res = await bannersService.updateBanners(item.id, {
            imageUrl: item.imgUrl,
            orderIndex: item.orderIndex,
          });
        } catch (error) {
        }
      }
    }
    setIsEdit(!isEdit);
  };
  const handleDelete = async (id: string) => {
    try {
      await bannersService.deleteBanners(id);
      fetchListBanner();
    } catch (error) {
    }
  };
  const fetchListBanner = async () => {
    const res = await bannersService.fetchBanners();
    const sortRes = res.content.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    setListImg(sortRes);
  };
  useEffect(() => {
    fetchListBanner();
  }, []);
  return (
    <div>
      <Card className="p-6 mb-6">
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">Banners</div>
            <div className="flex gap-4">
              <Button onClick={() => handleSave()} className="btn btn-primary">
                {isEdit ? "Save" : "Edit"}
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImage}
                style={{ display: "none" }}
              />
              <Button
                variant={"outline"}
                onClick={() => {
                  const inputFile = document.getElementById("file-input");
                  if (inputFile) {
                    inputFile.click();
                  }
                }}
              >
                Add Image
              </Button>
            </div>
          </div>
        </CardTitle>
        <CardContent className="mt-6 gap-6 overflow-x-auto flex">
          {!isEdit &&
            listImg.map((item, index) => (
              <div key={item.id + index}>
                <div className="mt-4 bg-gray-300 h-[500px] w-full">
                  <img
                    className="w-full h-full object-contain"
                    src={item.imageUrl}
                    alt={item.id}
                  />
                </div>
              </div>
            ))}

          {/* Not edited */}
          {isEdit && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                isDropDisabled={false}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
                droppableId={generateUniqueId()}
                direction="horizontal"
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex overflow-auto"
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {listImg.map((item, index) => (
                      <div key={item.id + index}>
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div className="mt-4 bg-gray-300 h-[300px] w-full relative">
                                <button
                                  className=" rounded p-1 absolute top-2 right-2 bg-red-500"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 color="white" />
                                </button>
                                <img
                                  className="w-full h-full object-contain"
                                  src={item.imageUrl}
                                  alt={item.id}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default Page;
