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
import { formatCurrency } from "@/lib/pipes/currency";
import { Button } from "@/components/ui/button";
import { InputLabel } from "@/components/ui/input-label";
import { ProductDetail } from "@/lib/types/products.type";
import productsService from "@/services/products.service";
import { useToast } from "@/hooks/use-toast";
import { redirect, useParams } from "next/navigation";
import { BlogPost, ParamsBlog } from "@/lib/types/blogs.type";
import blogsService from "@/services/blogs.service";
import { FOLDER } from "@/lib/types/utils.types";
import uploadImageService from "@/services/upload-image.service";
import { convertToSlug } from "@/lib/pipes/convertSlug";

type SEO = {
  titlePage?: string;
  description?: string;
  url?: string;
};
const defaultBlog: ParamsBlog = {
  title: "",
  content: "",
  createUser: "",
  blogCategory: "",
  blogQuote: "",
  seoTitle: "",
  seoDescription: "",
  seoUrl: "",
  canonicalUrl: "",
  metaIndex: "",
  metaFollow: "",
  displayTime: "",
  isDisplay: false,
  image: "",
  imageDescription: "",
  tag: "",
  status: 0,
  pageInterface: "",
  createTime: "",
  updateTime: "",
};
export function BlogForm() {
  const [content, setContent] = useState("");
  const [quote, setQuote] = useState("");
  const [listImg, setListImg] = useState<{ files: File[]; urls: string[] }>({
    files: [],
    urls: [],
  });
  const [blog, setBlog] = useState<ParamsBlog>(defaultBlog);
  const [fieldSEO, setFieldSEO] = useState<SEO>({
    titlePage: "",
    description: "",
    url: "toy.linhlang.vn/",
  });
  // const [isMultiUnit, setIsMultiUnit] = useState<boolean>(false);
  const [toggleSEO, setToggleSEO] = useState<boolean>(false);
  const { toast } = useToast();
  const paramsUrl = useParams<{ id: string }>();
  const isParams = Object.keys(paramsUrl).length;

  function removeHtmlTags(htmlString: string) {
    return htmlString.replace(/<[^>]*>/g, "").trim();
  }
  const editContentState = (value: any) => {
    setContent(value);
    setFieldSEO({ ...fieldSEO, description: removeHtmlTags(value) });
    // setBlog({ ...product, description: value });
  };
  const editQuoteState = (value: any) => {
    setQuote(value);
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
      // setBlog({
      //   ...product,
      //   imgFile: product.imgFile.filter((_: any, i: number) => i !== index),
      // });
    }
  };

  const handleDeleteImg = (index: number) => {
    const deletedFiles = listImg.files.filter((_, i) => i !== index);
    console.log(deletedFiles);
    // if (isParams) {
    //   setBlog({
    //     ...product,
    //     imgFile: product.imgFile.filter((_: any, i: number) => i !== index),
    //   });
    // }
    setListImg({
      files: listImg.files.filter((_, i) => i !== index),
      urls: listImg.urls.filter((_, i) => i !== index),
    });
  };
  const handleSaveForm = async () => {
    console.log(blog?.displayTime);

    const params: ParamsBlog = {
      title: blog?.title,
      blogCategory: blog?.blogCategory,
      blogQuote: quote,
      content: content,
      displayTime: blog?.displayTime,
      image: blog.image,
      seoTitle: fieldSEO.titlePage ?? "",
      seoDescription: fieldSEO.description ?? "",
      seoUrl: fieldSEO.url ?? "",
    };

    if (listImg.files.length > 0) {
      const res = await uploadImageService.uploadImage(
        FOLDER.BLOGS,
        listImg.files
      );
      params.image = res.payload[0];
    }
    if (!isParams) {
      console.log(params);

      const res = await blogsService.createBlog(params);
      if (res.status >= 200 && res.status < 400) {
        toast({
          variant: "success",
          title: `Tạo thành công!`,
          description: `${blog?.title} has been added successfully!`,
        });

        redirect("/blogs");
      } else {
        toast({
          variant: "destructive",
          title: "Tạo thất bại!",
          description: "Vui lòng kiểm tra lại các mục bắt buộc điền.",
        });
      }
    } else {
      console.log(params);
      params.status = 1;
      const res = await blogsService.updateBlog({
        ...params,
        id: paramsUrl.id,
      });
      if (res.status >= 200 && res.status < 400) {
        toast({
          variant: "success",
          title: `Sửa thành công!`,
          description: `${blog?.title} has been added successfully!`,
        });
        if (listImg.files.length > 0) {
          await productsService.createImagesProduct(
            res.data.payload,
            listImg.files
          );
        }
        // redirect("/blogs");
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
    if (isParams) {
      const handleGetDetailBlog = async () => {
        const res: BlogPost = await blogsService.getDetailBlog(paramsUrl.id);
        console.log(res);

        setBlog({
          ...blog,
          title: res?.title,
          blogCategory: res?.blogCategory,
          blogQuote: res?.blogQuote,
          content: res?.content,
          displayTime: res?.displayTime,
          image: res.image,
          seoTitle: res.seoTitle ?? "",
          seoDescription: res.seoDescription ?? "",
          seoUrl: res.seoUrl ?? "",
        });
        if (res && res.content) setContent(res.content);
        if (res && res.blogQuote) setQuote(res.blogQuote);
        setFieldSEO({
          ...fieldSEO,
          titlePage: res.seoTitle,
          description: res.seoDescription,
          url: res.seoUrl,
        });

        // if (res.description) setValue(res.description);
        if (res.image) {
          setListImg({
            ...listImg,
            urls: [res.image],
          });
        }
      };
      handleGetDetailBlog();
    }
  }, [paramsUrl.id]);
  return (
    <>
      <div className="py-4">
        <div className="text-2xl font-bold text-red-400">
          {isParams ? "Sửa bài đăng" : "Thêm bài đăng trên blog"}
        </div>
        <div className="mt-8 flex gap-8">
          <div className="w-[70%]">
            <section className="py-4 px-6 shadow-inner bg-white box-shadow-style  min-h-[70vh] rounded-md">
              <p className="font-bold">Thông tin chung</p>
              <Separator />
              <div className="mt-4 w-full">
                <section className="grid w-full items-center gap-1.5">
                  <label className="text-sm" htmlFor="title">
                    Tiêu đề<span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    className="w-full"
                    type="text"
                    id="title"
                    placeholder="Tiêu đề"
                    value={blog?.title}
                    onChange={(e) => {
                      setBlog({ ...blog, title: e.target.value });
                      setFieldSEO({
                        ...fieldSEO,
                        titlePage: e.target.value,
                        url: "toy.linhlang.vn/" + convertToSlug(e.target.value)
                      });
                    }}
                  />
                </section>

                <section className="mt-6">
                  <label className="text-sm" htmlFor="description">
                    Nội dung
                  </label>
                  <TextEditor
                    content={content}
                    editContent={editContentState}
                  />
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
                        Ảnh định dạng jpg, jpeg, png, gif tỉ lệ 1:1 (ảnh vuông)
                        và độ phân giải 2048px x 2048px để chất lượng hình ảnh
                        tốt nhất
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
                      multiple // Allow multiple file selection if needed
                      onChange={handleFileInputChange}
                      style={{ display: "none" }} // Hide the default file input
                    />
                    <div className="w-full flex flex-col items-center justify-center h-[8rem]">
                      <div>
                        <ImageUp size={48} />
                      </div>
                      <div>
                        <span className="text-blue-500">Kéo</span> và{" "}
                        <span className="text-blue-500">Thả</span> files vào
                        đây, hoặc <span className="text-blue-500">Click</span>{" "}
                        để chọn files.
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
                          onChange={(event) =>
                            handleEachFileChange(event, index)
                          }
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

            <section className="py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md mt-6">
              <label className="text-sm font-bold" htmlFor="description">
                Trích dẫn
              </label>
              <TextEditor content={quote} editContent={editQuoteState} />
            </section>

            <section className="py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md">
              <div className="flex w-full mb-2 items-center justify-between">
                <p>Tối ưu SEO</p>
                <Button onClick={() => setToggleSEO(!toggleSEO)}>
                  Chỉnh sửa SEO
                </Button>
              </div>
              <Separator className="mb-4" />
              {!(fieldSEO.titlePage || fieldSEO.description) && (
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
                    value={fieldSEO.url as string}
                    onChange={(e) =>
                      setFieldSEO({ ...fieldSEO, url: e.target.value })
                    }
                  />
                </div>
              )}
            </section>
            <div className=" flex justify-end">
              <Button className="my-4" onClick={handleSaveForm}>
                Lưu
              </Button>
            </div>
          </div>
          <div className="w-[30%]">
            <div className="w-full py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md ">
              <p className="font-bold">Hiển thị</p>
              <input
                className="w-full border-gray-300 border px-4 py-1 rounded-md"
                required
                type="datetime-local"
                value={blog.displayTime as string}
                onChange={(e) =>
                  setBlog({ ...blog, displayTime: e.target.value })
                }
              />
            </div>
            <div className="w-full py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md mt-6">
              <label className="text-sm" htmlFor="category">
                Danh mục blog
              </label>
              <Input
                required
                className="w-full"
                type="text"
                id="category"
                placeholder="Người tạo"
                value={blog?.blogCategory}
                onChange={(e) =>
                  setBlog({ ...blog, blogCategory: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
