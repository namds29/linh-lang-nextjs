'use client'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import TextEditor from '@/components/ui/text-editor'

import { labels, provider } from '@/lib/mock/label'
import { useEffect, useState } from 'react'
import { CircleHelp, ImageUp } from 'lucide-react'
import { formatCurrency } from '@/lib/pipes/currency'
import { Button } from '@/components/ui/button'
import { InputLabel } from '@/components/ui/input-label'
import { ProductDetail } from '@/lib/types/products.type'
import productsService from '@/services/products.service'
import { useToast } from '@/hooks/use-toast'
import { redirect, useParams } from 'next/navigation'
import { convertToSlug } from '@/lib/pipes/convertSlug'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

type Product = {
  name: string
  sellPrice: string
  size: string
  weight: string
  provider: string
  description: string
  comparePrice: string
  category: string
  imgFile: any
  unit: number
}
const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }))
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  width: '100%',
  padding: '1rem',
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#f3f4f6',

  // styles we need to apply on draggables
  ...draggableStyle
})

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex'
})
const generateUniqueId = () => {
  const uniqueId = Date.now()
  return `id-${Math.random().toString(36).substr(2, 9)}`;
};
export function ProductForm () {
  const [value, setValue] = useState('')
  const [listImg, setListImg] = useState<{ files: File[]; urls: string[] }>({
    files: [],
    urls: []
  })
  const [size, setSize] = useState<{ width: string; height: string }>({
    width: '',
    height: ''
  })
  const [product, setProduct] = useState<Product>({
    name: '',
    provider: 'Linh Lang',
    category: '',
    description: '',
    sellPrice: '',
    comparePrice: '',
    size: '',
    weight: '',
    imgFile: [],
    unit: 0
  })
  const [fieldSEO, setFieldSEO] = useState<{
    titlePage?: string
    description?: string
    url?: string
  }>({
    titlePage: '',
    description: '',
    url: 'toy.linhlang.vn/'
  })
  // const [isMultiUnit, setIsMultiUnit] = useState<boolean>(false);
  const [toggleSEO, setToggleSEO] = useState<boolean>(false)
  const [listItem, setListItem] = useState(getItems(8))
  const { toast } = useToast()
  const paramsUrl = useParams<{ id: string }>()
  const isParams = Object.keys(paramsUrl).length

  function removeHtmlTags (htmlString: string) {
    return htmlString.replace(/<[^>]*>/g, '').trim()
  }
  const editContentState = (value: any) => {
    setValue(value)
    setProduct({ ...product, description: value })
    setFieldSEO({ ...fieldSEO, description: removeHtmlTags(value) })
  }

  const handleBlur = (e: any, key: string) => {
    const amount = +e.target.value
    if (!isNaN(amount)) {
      const formattedValue = formatCurrency(amount)
      setProduct({ ...product, [key]: formattedValue })
    }
  }

  const handleFocus = (key: keyof Product) => {
    setProduct({
      ...product,
      [key]: product[key].replace(/đ/, '').replace('.', '').trim()
    })
  }
  const handleFileInputChange = (e: any) => {
    if (e.target.files) {
      const listFile: File[] = Array.from(e.target.files)
      const listUrlImg = listFile.map((file: any) => URL.createObjectURL(file))

      setListImg({ files: listFile, urls: listUrlImg })
    }
  }
  const handleEachFileChange = (e: any, index: number) => {
    const file = e.target.files[0]

    if (file) {
      const newUrl = URL.createObjectURL(file)
      const newFiles = [...listImg.files]
      newFiles[index] = file
      const newUrls = [...listImg.urls]
      newUrls[index] = newUrl
      setListImg({
        files: newFiles,
        urls: newUrls
      })
      setProduct({
        ...product,
        imgFile: product.imgFile.filter((_: any, i: number) => i !== index)
      })
    }
  }

  const handleDeleteImg = (index: number) => {
    const deletedFiles = listImg.files.filter((_, i) => i !== index)
    console.log(deletedFiles)
    if (isParams) {
      setProduct({
        ...product,
        imgFile: product.imgFile.filter((_: any, i: number) => i !== index)
      })
    }
    setListImg({
      files: listImg.files.filter((_, i) => i !== index),
      urls: listImg.urls.filter((_, i) => i !== index)
    })
  }
  const convertSize = (size: string) => {
    const value = size.split('x')
    console.log(value)
    setSize({ width: value[1], height: value[0] })
  }
  const handleSaveForm = async () => {
    const params: ProductDetail = {
      name: product.name,
      provider: {
        name: product.provider
      },
      category: {
        name: product.category
      },
      description: product.description,
      images: isParams ? product.imgFile : undefined,
      size: size.width + 'x' + size.height,
      weight: product.weight,
      price: Number(
        product['sellPrice'].replace(/đ/, '').replace('.', '').trim()
      ),
      comparePrice: Number(
        product['comparePrice'].replace(/đ/, '').replace('.', '').trim()
      ),
      seo: {
        title: fieldSEO.titlePage ?? '',
        description: fieldSEO.description ?? '',
        link: fieldSEO.url ?? ''
      }
    }

    if (!isParams) {
      const res = await productsService.createProduct(params)
      if (res.status >= 200 && res.status < 400) {
        toast({
          variant: 'success',
          title: `Tạo thành công!`,
          description: `${product.name} has been added successfully!`
        })
        if (listImg.files.length > 0) {
          const resCreateImg = await productsService.createImagesProduct(
            res.data.payload,
            listImg.files
          )
          console.log(resCreateImg)
        }
        redirect('/products')
      } else {
        toast({
          variant: 'destructive',
          title: 'Tạo thất bại!',
          description: 'Vui lòng kiểm tra lại các mục bắt buộc điền.'
        })
      }
    } else {
      // if (listImg.files.length > 0) params.images = listImg.files;
      console.log(params)

      const res = await productsService.updateProduct(paramsUrl.id, params)
      console.log(res)

      if (res.status >= 200 && res.status < 400) {
        toast({
          variant: 'success',
          title: `Sửa thành công!`,
          description: `${product.name} has been added successfully!`
        })
        if (listImg.files.length > 0) {
          const data = await productsService.createImagesProduct(
            res.data.payload,
            listImg.files
          )
          console.log(data)
        }
        redirect('/products')
      } else {
        toast({
          variant: 'destructive',
          title: 'Sửa thất bại!',
          description: 'Vui lòng kiểm tra lại các mục bắt buộc điền.'
        })
      }
    }
  }
  function onDragEnd (result: any) {
    // dropped outside the list
    console.log(result)
    if (!result.destination) {
      return
    }
    const items = reorder(
      listImg.urls,
      result.source.index,
      result.destination.index
    )
    setListImg({ ...listImg, urls: items })
    console.log(items, 'items')
  }

  useEffect(() => {
    if (isParams) {
      const handleGetDetailProduct = async () => {
        const res: ProductDetail = await productsService.getDetailProduct(
          paramsUrl.id
        )
        console.log(res)
        if (res && res.size) {
          convertSize(res.size)
        }
        setProduct({
          ...product,
          name: res.name,
          provider: res.provider.name,
          category: res.category.name,
          comparePrice: res.comparePrice ? res.comparePrice.toString() : '',
          sellPrice: res.price.toString(),
          description: res.description,
          weight: res.weight,
          size: res.size,
          imgFile: res.images
        })
        setFieldSEO({
          ...fieldSEO,
          titlePage: res.seo?.title,
          description: res.seo?.description,
          url: res.seo?.link
        })
        if (res.description) setValue(res.description)
        if (res.images && res.images.length > 0) {
          setListImg({
            ...listImg,
            urls: res.images.map(item => item.url)
          })
        }
      }

      handleGetDetailProduct()
    }
  }, [paramsUrl.id])
  return (
    <div className='py-4 w-full'>
      <div className='text-2xl font-bold text-red-400'>
        {isParams ? 'Sửa sản phẩm' : 'Tạo sản phẩm'}
      </div>
      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 min-h-[70vh] rounded-md'>
        <p className='font-bold'>Thông tin chung</p>
        <Separator />
        <div className='mt-4 w-full'>
          <section className='grid w-full items-center gap-1.5'>
            <label className='text-sm' htmlFor='product'>
              Tên sản phẩm<span className='text-red-500'>*</span>
            </label>
            <Input
              required
              className='w-full'
              type='text'
              id='product'
              placeholder='Nhập tên sản phẩm'
              value={product.name}
              onChange={e => {
                setProduct({ ...product, name: e.target.value })
                setFieldSEO({
                  ...fieldSEO,
                  titlePage: e.target.value,
                  url: 'toy.linhlang.vn/' + convertToSlug(e.target.value)
                })
              }}
            />
          </section>
          <section className='grid grid-cols-2 w-full items-center mt-6 gap-6'>
            <div>
              <label className='text-sm' htmlFor='provider'>
                Nhà cung cấp<span className='text-red-500'>*</span>
              </label>
              <Select
                value={product.provider}
                onValueChange={value =>
                  setProduct({ ...product, provider: value })
                }
                required
              >
                <SelectTrigger className=''>
                  <SelectValue placeholder='Chọn nhà cung cấp...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nhà cung cấp</SelectLabel>
                    {provider.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className='text-sm' htmlFor='categories'>
                Loại<span className='text-red-500'>*</span>
              </label>
              <Select
                value={product.category ?? 'test'}
                required
                onValueChange={value =>
                  setProduct({ ...product, category: value })
                }
              >
                <SelectTrigger className=''>
                  <SelectValue placeholder='Chọn loại...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Loại</SelectLabel>
                    {labels.map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
          <section className='mt-6'>
            <label className='text-sm' htmlFor='description'>
              Mô tả sản phẩm
            </label>
            <TextEditor content={value} editContent={editContentState} />
          </section>
        </div>
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>
          <p className='font-bold'>Hình ảnh sản phẩm</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <CircleHelp className='ml-1 text-blue-500' size={18} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Ảnh định dạng jpg, jpeg, png, gif tỉ lệ 1:1 (ảnh vuông) và độ
                  phân giải 2048px x 2048px để chất lượng hình ảnh tốt nhất
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Separator />

        <div className='mt-6 flex justify-center items-center bg-gray-100'>
          {!listImg.urls.length && (
            <label
              htmlFor='file-upload'
              role='region'
              onDragOver={e => e.preventDefault()} // Essential for drop to work
              style={{
                border: '1px dashed #ccc',
                padding: '20px',
                cursor: 'pointer',
                display: 'block', // To make the label take up the full width
                borderRadius: 10,
                width: '100%'
              }}
            >
              <input
                type='file'
                id='file-upload'
                accept='image/*'
                multiple // Allow multiple file selection if needed
                onChange={handleFileInputChange}
                style={{ display: 'none' }} // Hide the default file input
              />
              <div className='w-full flex flex-col items-center justify-center h-[8rem]'>
                <div>
                  <ImageUp size={48} />
                </div>
                <div>
                  <span className='text-blue-500'>Kéo</span> và{' '}
                  <span className='text-blue-500'>Thả</span> files vào đây, hoặc{' '}
                  <span className='text-blue-500'>Click</span> để chọn files.
                </div>
              </div>
            </label>
          )}

          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                isDropDisabled={false}
                isCombineEnabled={false}
                ignoreContainerClipping={false}
                droppableId={generateUniqueId()}
                direction='horizontal'
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {listImg.urls.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
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
                            <label
                              key={item + index}
                              htmlFor={`file-upload-${index}`}
                              role='region'
                              style={{
                                border: '1px dashed #ccc',
                                padding: '20px',
                                cursor: 'pointer',
                                display: 'block', // To make the label take up the full width
                                borderRadius: 10,
                                width: '100%'
                              }}
                            >
                              <input
                                type='file'
                                id={`file-upload-${index}`}
                                accept='image/*'
                                onChange={event =>
                                  handleEachFileChange(event, index)
                                }
                                style={{ display: 'none' }} // Hide the default file input
                              />
                              <div className='w-full relative'>
                                <button
                                  className='absolute z-10 right-[-12px] top-[-12px] bg-red-400 w-6 h-6 text-white rounded-full'
                                  onClick={() => handleDeleteImg(index)}
                                >
                                  x
                                </button>
                                <img
                                  className='w-full filter-brightness'
                                  key={item + index}
                                  src={item}
                                  alt=''
                                />
                              </div>
                            </label>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>Giá sản phẩm</div>
        <Separator />
        <div className='grid grid-cols-2 gap-8 mt-4'>
          <InputLabel
            require={true}
            label='Giá bán'
            tooltipText='Số tiền khách hàng cần thanh toán'
            value={product.sellPrice}
            onBlur={e => handleBlur(e, 'sellPrice')}
            onFocus={() => handleFocus('sellPrice')}
            onChange={e =>
              setProduct({ ...product, sellPrice: e.target.value })
            }
            id='compare-price'
            placeholder='0 đ'
          />

          <InputLabel
            label='Giá so sánh'
            tooltipText='Số tiền chưa giảm giá, thể hiện giá trị giảm giá, ưu đãi cho
                    khách hàng'
            value={product.comparePrice}
            onBlur={e => handleBlur(e, 'comparePrice')}
            onFocus={() => handleFocus('comparePrice')}
            onChange={e =>
              setProduct({ ...product, comparePrice: e.target.value })
            }
            id='compare-price'
            placeholder='0 đ'
          />
        </div>
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>Chỉ số</div>
        <Separator />
        <div className='grid grid-cols-3 gap-8 mt-4'>
          <InputLabel
            label='Chiều dài'
            type='number'
            value={size.height}
            onChange={e => setSize({ ...size, height: e.target.value })}
            id='height'
            placeholder='Nhập kích thước'
          />
          <InputLabel
            label='Chiều rộng'
            value={size.width}
            onChange={e => setSize({ ...size, width: e.target.value })}
            id='width'
            placeholder='Nhập kích thước'
          />

          <InputLabel
            label='Cân nặng'
            value={product.weight}
            onChange={e => setProduct({ ...product, weight: e.target.value })}
            id='weight'
            placeholder='Nhập cân nặng'
          />
        </div>
      </section>

      {/* <section className="py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md">
        <div className="flex w-full mb-2 items-center">Đơn vị tính</div>
        <Separator />
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="unit"
            checked={isMultiUnit}
            onCheckedChange={() => setIsMultiUnit(!isMultiUnit)}
          />
          <label
            htmlFor="unit"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Biến thể có nhiều đơn vị tính (ví dụ: lon, lốc, thùng...)
          </label>
        </div>
        {isMultiUnit && (
          <InputLabel
            className="mt-4"
            label="Đơn vị cơ bản"
            placeholder="0"
            type="number"
            tooltipText={"Đơn vị nhỏ nhất của sản phẩm như lon, hộp..."}
            value={product.unit.toString()}
            id="unit"
            onChange={(e) => setProduct({ ...product, unit: +e.target.value })}
          />
        )}
      </section> */}

      {/* <section className="py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md">
        <div className="flex w-full mb-2 items-center">Biến thể</div>
        <Separator />
      </section> */}

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center justify-between'>
          <p>Tối ưu SEO</p>
          <Button onClick={() => setToggleSEO(!toggleSEO)}>
            Chỉnh sửa SEO
          </Button>
        </div>
        <Separator className='mb-4' />
        {!(fieldSEO.titlePage || fieldSEO.description) && (
          <p>
            Thiết lập các thẻ mô tả giúp khách hàng dễ dàng tìm thấy danh mục
            này trên công cụ tìm kiếm như Google
          </p>
        )}
        <p className='text-xl collection-seo--preview-title'>
          {fieldSEO.titlePage}
        </p>
        <p className='text-sm collection-seo--preview-mota mt-1'>
          {fieldSEO.description}
        </p>
        <p className='text-xs collection-seo--preview-url mt-1'>
          {fieldSEO.url}
        </p>
        {toggleSEO && (
          <div className='mt-4'>
            <InputLabel
              id='title-page'
              placeholder='Tiêu đề trang'
              label='Tiêu đề trang'
              value={fieldSEO.titlePage ?? ''}
              onChange={e =>
                setFieldSEO({ ...fieldSEO, titlePage: e.target.value })
              }
            />
            <InputLabel
              className='mt-4'
              id='description-page'
              placeholder='Mô tả trang'
              label='Mô tả trang'
              value={fieldSEO.description ?? ''}
              onChange={e =>
                setFieldSEO({ ...fieldSEO, description: e.target.value })
              }
            />
            <InputLabel
              className='mt-4'
              id='link-page'
              placeholder='Đường dẫn'
              label='Đường dẫn'
              value={fieldSEO.url ?? ''}
              onChange={e => setFieldSEO({ ...fieldSEO, url: e.target.value })}
            />
          </div>
        )}
      </section>
      <div className=' flex justify-end'>
        <Button className='my-4' onClick={handleSaveForm}>
          Lưu
        </Button>
      </div>
    </div>
  )
}
export default ProductForm
