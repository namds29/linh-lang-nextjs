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
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { InputLabel } from '@/components/ui/input-label'
import { ProductDetail } from '@/lib/types/types'
import productsService from '@/services/products.service'
import { useToast } from '@/hooks/use-toast'
import { useParams } from 'next/navigation'

type Product = {
  name: string
  sellPrice: string
  provider: string
  description: string
  comparePrice: string
  category: string
  imgFile: any
  unit: number
}

export function ProductForm () {
  const [value, setValue] = useState('')
  const [listImg, setListImg] = useState<{ files: File[]; urls: string[] }>({
    files: [],
    urls: []
  })
  const [product, setProduct] = useState<Product>({
    name: '',
    provider: '',
    category: '',
    description: '',
    sellPrice: '',
    comparePrice: '',
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
    url: ''
  })
  // const [isMultiUnit, setIsMultiUnit] = useState<boolean>(false);
  const [toggleSEO, setToggleSEO] = useState<boolean>(false)
  const { toast } = useToast()
  const params = useParams<{ id: string }>()
  const isParams = Object.keys(params)

  const editContentState = (value: any) => {
    setValue(value)
    setProduct({ ...product, description: value })
  }

  const handleBlur = (e: any, key: string) => {
    const amount = +e.target.value
    if (!isNaN(amount)) {
      const formattedValue = formatCurrency(amount)
      setProduct({ ...product, [key]: formattedValue })
    }
  }
  const handleDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      console.log(e)
      setProduct({ ...product, imgFile: Array.from(e.dataTransfer.files) })
      // setFiles(Array.from(e.dataTransfer.files));
      // ... handle the uploaded files (e.g., upload to server) ...
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
      setProduct({ ...product, imgFile: listFile })
    }
  }
  const handleCreateProduct = async () => {
    const params: ProductDetail = {
      name: product.name,
      provider: {
        name: product.provider
      },
      category: {
        name: product.category
      },
      description: product.description,
      // images: product.imgFile,
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
    } else {
      toast({
        variant: 'destructive',
        title: 'Tạo thất bại!',
        description: 'Vui lòng kiểm tra lại các mục bắt buộc điền.'
      })
    }
  }

  useEffect(() => {
    if (isParams.length) {
      const handleGetDetailProduct = async () => {
        const res: ProductDetail = await productsService.getDetailProduct(
          params.id
        )
        console.log(res)
        setProduct({
          ...product,
          name: res.name,
          provider: res.provider.name,
          category: res.category.name,
          comparePrice: res.comparePrice ? res.comparePrice.toString() : '',
          sellPrice: res.price.toString(),
          description: res.description
        })
        setFieldSEO({
          ...fieldSEO,
          titlePage: res.seo?.title,
          description: res.seo?.description,
          url: res.seo?.link
        })
        if (res.description) setValue(res.description)
        if (res.images && res.images.length > 0) {
          setListImg({ ...listImg, urls: res.images.map(item => item.url) })
        }
      }
      handleGetDetailProduct()
    }
  }, [params.id])
  return (
    <div className='py-4 w-[80%]'>
      <div className='text-2xl font-bold text-red-400'>
        {isParams.length ? 'Sửa sản phẩm' : 'Tạo sản phẩm'}
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
              onChange={e => setProduct({ ...product, name: e.target.value })}
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
          {/* <section className='grid w-full items-center gap-1.5 mt-6'>
            <label className='text-sm' htmlFor='trichdan'>
              Trích dẫn
            </label>
            <Input
              className='w-full'
              type='text'
              id='trichdan'
              placeholder='Trích dẫn sản phẩm'
            />
          </section> */}
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
          <label
            htmlFor='file-upload'
            role='region'
            onDrop={handleDrop}
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
            {!listImg.urls.length && (
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
            )}
            <div className='flex w-full gap-4'>
              {listImg.urls.length > 0 &&
                listImg.urls.map((img, index) => (
                  <div key={img + index} className='w-full'>
                    <img
                      className='w-full'
                      key={img + index}
                      src={img}
                      alt=''
                    />
                  </div>
                ))}
            </div>
          </label>
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
        {!(fieldSEO.titlePage || fieldSEO.description || fieldSEO.url) && (
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
        <Button className='my-4' onClick={handleCreateProduct}>
          Lưu
        </Button>
      </div>
    </div>
  )
}
export default ProductForm
