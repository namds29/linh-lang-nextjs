"use client";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import TextEditor from "@/components/ui/text-editor";

import { useEffect, useState } from "react";
import { CircleHelp, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputLabel } from "@/components/ui/input-label";
import { useToast } from "@/hooks/use-toast";
import { redirect, useParams } from "next/navigation";
import collectionsService from "@/services/collections.service";
import uploadImageService from "@/services/upload-image.service";
import { FOLDER } from "@/lib/types/utils.types";

function CollectionForm() {
  const [value, setValue] = useState("");
  const [listImg, setListImg] = useState<{ files: File[]; urls: string[] }>({
    files: [],
    urls: [],
  });
  const [collection, setCollection] = useState<CollectionDetail>({
    id: "",
    name: "",
    description: "",
    image: "",
    autoSelect: true,
    seo: {
      title: "",
      description: "",
      link: "string",
    },
  });
  const [fieldSEO, setFieldSEO] = useState<{
    titlePage?: string;
    description?: string;
    url?: string;
  }>({
    titlePage: "",
    description: "",
    url: "",
  });
  // const [isMultiUnit, setIsMultiUnit] = useState<boolean>(false);
  const [toggleSEO, setToggleSEO] = useState<boolean>(false);
  const { toast } = useToast();
  const paramsUrl = useParams<{ id: string }>();

  const isParams = Object.keys(paramsUrl).length;

  const editContentState = (value: any) => {
    setValue(value);
    setCollection({ ...collection, description: value });
  };

  const handleFileInputChange = (e: any) => {
    if (e.target.files) {
      const listFile: File[] = Array.from(e.target.files);
      const listUrlImg = listFile.map((file: any) => URL.createObjectURL(file));

      setListImg({ files: listFile, urls: listUrlImg });
    }
  };
  const handleEachFileChange = (e: any, index: number) => {
    const file = e.target.files[0];

    if (file) {
      const newUrl = URL.createObjectURL(file);
      const newFiles = [...listImg.files];
      newFiles[index] = file;
      const newUrls = [...listImg.urls];
      newUrls[index] = newUrl;
      setListImg({
        files: newFiles,
        urls: newUrls,
      });
      setCollection({
        ...collection,
      });
    }
  };

  const handleDeleteImg = (index: number) => {
    if (isParams) {
      setCollection({
        ...collection,
      });
    }
    setListImg({
      files: listImg.files.filter((_, i) => i !== index),
      urls: listImg.urls.filter((_, i) => i !== index),
    });
  };
  const handleSaveForm = async () => {
    let imgUrl = "";

    if (!isParams) {
      if (listImg.files.length > 0) {
        const res = await uploadImageService.uploadImage(
          FOLDER.COLLECTIONS,
          listImg.files
        );
        imgUrl = res.payload[0];
      }

      const params: ParamsCollections = {
        name: collection.name,
        description: collection.description ?? "",
        image: imgUrl ?? "",
        seo: {
          title: fieldSEO.titlePage ?? "",
          description: fieldSEO.description ?? "",
          link: fieldSEO.url ?? "",
        },
        autoSelect: false,
      };
      const res = await collectionsService.createCollection(params);
      if (res.status >= 200 && res.status < 400) {
        toast({
          variant: "success",
          title: `Tạo thành công!`,
          description: `${collection.name} has been added successfully!`,
        });

        redirect("/products/collections");
      } else {
        toast({
          variant: "destructive",
          title: "Tạo thất bại!",
          description: "Vui lòng kiểm tra lại các mục bắt buộc điền.",
        });
      }
    } else {
      if (listImg.files.length > 0) {
        const res = await uploadImageService.uploadImage(
          FOLDER.COLLECTIONS,
          listImg.files
        );
        imgUrl = res.payload[0];
      }
      const params = {
        name: collection.name,
        description: collection.description ?? "",
        image: imgUrl ? imgUrl : listImg.urls[0],
        seo: {
          title: fieldSEO.titlePage ?? "",
          description: fieldSEO.description ?? "",
          link: fieldSEO.url ?? "",
        },
        autoSelect: false,
      };
      console.log("params", params);

      const res = await collectionsService.updateCollection(
        paramsUrl.id,
        params
      );
      if (res.status >= 200 && res.status < 400) {
        toast({
          variant: "success",
          title: `Sửa thành công!`,
          description: `${collection.name} has been added successfully!`,
        });
        redirect("/products/collections");
      } else {
        toast({
          variant: "destructive",
          title: "Sửa thất bại!",
          description: "Vui lòng kiểm tra lại các mục bắt buộc điền.",
        });
      }
    }
  };
  useEffect(() => {
    console.log(paramsUrl);

    if (isParams) {
      const handleGetDetailCollection = async () => {
        const res: CollectionDetail =
          await collectionsService.getDetailCollection(paramsUrl.id);
        console.log(res);
        setCollection({
          ...collection,
          name: res.name,
          description: res.description,
        });
        setFieldSEO({
          ...fieldSEO,
          titlePage: res.seo?.title,
          description: res.seo?.description,
          url: res.seo?.link,
        });
        if (res.description) setValue(res.description);
        if (res.image) {
          const url = [];
          url.push(res.image);
          console.log(url, "url");
          console.log(listImg, "url");

          setListImg({
            ...listImg,
            urls: url,
          });
        }
      };
      handleGetDetailCollection();
    }
  }, [paramsUrl.id]);
  return (
    <div className="py-4">
      <div className="text-2xl font-bold text-red-400">
        {isParams ? "Sửa nhóm sản phẩm" : "Tạo nhóm sản phẩm"}
      </div>
      <div className="mt-8 flex gap-8">
        <div className="w-[70%]">
          <section className="py-4 px-6 shadow-inner bg-white box-shadow-style min-h-[70vh] rounded-md">
            <p className="font-bold">Thông tin chung</p>
            <Separator />
            <div className="mt-4 w-full">
              <section className="grid w-full items-center gap-1.5">
                <label className="text-sm" htmlFor="product">
                  Tên nhóm sản phẩm<span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  className="w-full"
                  type="text"
                  id="product"
                  placeholder="Ví dụ: Nhóm Apple"
                  value={collection.name}
                  onChange={(e) =>
                    setCollection({ ...collection, name: e.target.value })
                  }
                />
              </section>

              <section className="mt-6">
                <label className="text-sm" htmlFor="description">
                  Mô tả
                </label>
                <TextEditor content={value} editContent={editContentState} />
              </section>
            </div>
          </section>

          <section className="py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md">
            <div className="flex w-full mb-2 items-center">
              <p className="font-bold">Hình ảnh sản phẩm</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <CircleHelp className="ml-1 text-blue-500" size={18} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Ảnh định dạng jpg, jpeg, png, gif tỉ lệ 1:1 (ảnh vuông) và
                      độ phân giải 2048px x 2048px để chất lượng hình ảnh tốt
                      nhất
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Separator />

            <div className="mt-6 flex justify-center items-center bg-gray-100">
              {!listImg.urls.length && (
                <label
                  htmlFor="file-upload"
                  role="region"
                  onDragOver={(e) => e.preventDefault()} // Essential for drop to work
                  style={{
                    border: "1px dashed #ccc",
                    padding: "20px",
                    cursor: "pointer",
                    display: "block", // To make the label take up the full width
                    borderRadius: 10,
                    width: "100%",
                  }}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    style={{ display: "none" }} // Hide the default file input
                  />
                  <div className="w-full flex flex-col items-center justify-center h-[8rem]">
                    <div>
                      <ImageUp size={48} />
                    </div>
                    <div>
                      <span className="text-blue-500">Kéo</span> và{" "}
                      <span className="text-blue-500">Thả</span> files vào đây,
                      hoặc <span className="text-blue-500">Click</span> để chọn
                      files.
                    </div>
                  </div>
                </label>
              )}
              {listImg.urls.length > 0 && (
                <div className="flex w-full gap-4">
                  {listImg.urls.map((img, index) => (
                    <label
                      key={img + index}
                      htmlFor={`file-upload-${index}`}
                      role="region"
                      style={{
                        border: "1px dashed #ccc",
                        padding: "20px",
                        cursor: "pointer",
                        display: "block", // To make the label take up the full width
                        borderRadius: 10,
                        width: "100%",
                      }}
                    >
                      <input
                        type="file"
                        id={`file-upload-${index}`}
                        accept="image/*"
                        onChange={(event) => handleEachFileChange(event, index)}
                        style={{ display: "none" }} // Hide the default file input
                      />
                      <div className="w-full relative">
                        <button
                          className="absolute z-10 right-[-12px] top-[-12px] bg-red-400 w-6 h-6 text-white rounded-full"
                          onClick={() => handleDeleteImg(index)}
                        >
                          x
                        </button>
                        <img
                          className="w-full filter-brightness"
                          key={img + index}
                          src={img}
                          alt=""
                        />
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md">
            <div className="flex w-full mb-2 items-center justify-between">
              <p>Tối ưu SEO</p>
              <Button onClick={() => setToggleSEO(!toggleSEO)}>
                Chỉnh sửa SEO
              </Button>
            </div>
            <Separator className="mb-4" />
            {!(fieldSEO.titlePage || fieldSEO.description || fieldSEO.url) && (
              <p>
                Thiết lập các thẻ mô tả giúp khách hàng dễ dàng tìm thấy danh
                mục này trên công cụ tìm kiếm như Google
              </p>
            )}
            <p className="text-xl collection-seo--preview-title">
              {fieldSEO.titlePage}
            </p>
            <p className="text-sm collection-seo--preview-mota mt-1">
              {fieldSEO.description}
            </p>
            <p className="text-xs collection-seo--preview-url mt-1">
              {fieldSEO.url}
            </p>
            {toggleSEO && (
              <div className="mt-4">
                <InputLabel
                  id="title-page"
                  placeholder="Tiêu đề trang"
                  label="Tiêu đề trang"
                  value={fieldSEO.titlePage ?? ""}
                  onChange={(e) =>
                    setFieldSEO({ ...fieldSEO, titlePage: e.target.value })
                  }
                />
                <InputLabel
                  className="mt-4"
                  id="description-page"
                  placeholder="Mô tả trang"
                  label="Mô tả trang"
                  value={fieldSEO.description ?? ""}
                  onChange={(e) =>
                    setFieldSEO({ ...fieldSEO, description: e.target.value })
                  }
                />
                <InputLabel
                  className="mt-4"
                  id="link-page"
                  placeholder="Đường dẫn"
                  label="Đường dẫn"
                  value={fieldSEO.url ?? ""}
                  onChange={(e) =>
                    setFieldSEO({ ...fieldSEO, url: e.target.value })
                  }
                />
              </div>
            )}
          </section>
        </div>
        <div className="w-[30%]">
          <div className="w-full py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md ">
            <p className="font-bold">Menu</p>
            <input
              className="w-full border-gray-300 border px-4 py-1 rounded-md"
              required
              type="text"
              placeholder="Chọn menu"
              // value={blog.displayTime as string}
              // onChange={(e) =>
              //   setBlog({ ...blog, displayTime: e.target.value })
              // }
            />
          </div>
        </div>
      </div>

      <div className=" flex justify-end">
        <Button className="my-4" onClick={handleSaveForm}>
          Lưu
        </Button>
      </div>
    </div>
  );
}
export default CollectionForm;
