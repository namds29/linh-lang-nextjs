"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import bannersService from "@/services/banners.service";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";

type ListBanners = {
  id: string;
  imgUrl: string;
  orderIndex: number;
};
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
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));
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
  const [listImg, setListImg] = useState<ListBanners[]>(mockData);
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    userSelect: "none",
    width: "100%",
    padding: "1rem",
    background: isDragging ? "lightgreen" : "#f3f4f6",
    ...draggableStyle,
  });
  function onDragEnd(result: any) {
    // dropped outside the list
    console.log(result);
    if (!result.destination) {
      return;
    }
    const items = reorder(
      listImg,
      result.source.index,
      result.destination.index
    );
    setListImg(items)
    console.log(items, "items");
  }
  useEffect(() => {
    const fetchListBanner = async () => {
      const res = await bannersService.fetchBanners();

      console.log(res);
    };
    fetchListBanner();
  }, []);
  return (
    <div>
      <Card className="p-6 mb-6">
        <CardTitle>Banners</CardTitle>
        <CardContent className="mt-6 gap-6 overflow-x-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={false}
              droppableId={generateUniqueId()}
              direction="vertical"
            >
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
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
                            <div
                              className="mt-4 bg-gray-300 h-[400px] w-full"
                            >
                              <img
                                className="w-full h-full"
                                src={item.imgUrl}
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
        </CardContent>
      </Card>
    </div>
  );
}
export default Page;
