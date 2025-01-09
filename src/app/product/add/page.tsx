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
import { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
import { CircleHelp, ImageUp } from 'lucide-react'
import { formatCurrency } from '@/lib/pipes/currency'
import { Checkbox } from '@/components/ui/checkbox'

type Product = {
  sellPrice: string
  comparePrice: string
  imgFile: any
  unit: number
}
interface InputWithTooltipProps {
  label: string
  tooltipText: string
  value: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  id: string
  placeholder: string
  className?: string
  type?: string // Optional, defaults to 'text'
}
const InputWithTooltip = ({
  label,
  tooltipText,
  value,
  onChange,
  onFocus,
  onBlur,
  id,
  placeholder,
  className,
  type = 'text' // Default to 'text' if not provided
}: InputWithTooltipProps) => {
  return (
    <div className={className}>
      <label className='text-sm flex' htmlFor={id}>
        {label}
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <CircleHelp className='ml-1 text-blue-500' size={18} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </label>
      <Input
        className='w-full'
        type={type}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        id={id}
        placeholder={placeholder}
      />
    </div>
  )
}

export function ProductAddPage () {
  const [value, setValue] = useState('')
  const [product, setProduct] = useState<Product>({
    sellPrice: '',
    comparePrice: '',
    imgFile: [],
    unit: 0
  })
  const [isShipped, setIsShipped] = useState<boolean>(false)
  const editContentState = (value: any) => {
    setValue(value)
  }
  useEffect(() => {}, [])
  const handleBlur = (e: any, key: string) => {
    const amount = +e.target.value // Convert input value to a number
    if (!isNaN(amount)) {
      const formattedValue = formatCurrency(amount)
      setProduct({ ...product, [key]: formattedValue }) // Update the state with the formatted value
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
      console.log(e)
      setProduct({ ...product, imgFile: Array.from(e.target.files) })
      // ... handle the selected files ...
    }
  }
  const handleCheckboxChange = (e: any) => {
    console.log(e)
    setIsShipped(!isShipped)
  }
  return (
    <div className='py-4'>
      <div className='text-2xl font-bold text-red-400'>Tạo sản phẩm</div>
      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 min-h-[83vh] rounded-md'>
        <p className='font-bold'>Thông tin chung</p>
        <Separator />
        <div className='mt-4 w-full'>
          <section className='grid w-full items-center gap-1.5'>
            <label className='text-sm' htmlFor='product'>
              Tên sản phẩm
            </label>
            <Input
              className='w-full'
              type='text'
              id='product'
              placeholder='Nhập tên sản phẩm'
            />
          </section>
          <section className='grid grid-cols-2 w-full items-center mt-6 gap-6'>
            <div>
              <label className='text-sm' htmlFor='provider'>
                Nhà cung cấp
              </label>
              <Select>
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
              <label className='text-sm' htmlFor='provider'>
                Loại
              </label>
              <Select>
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
          <section className='grid w-full items-center gap-1.5 mt-6'>
            <label className='text-sm' htmlFor='trichdan'>
              Trích dẫn
            </label>
            <Input
              className='w-full'
              type='text'
              id='trichdan'
              placeholder='Trích dẫn sản phẩm'
            />
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

        <div className='mt-6 flex justify-center items-center'>
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
            {product.imgFile.length > 0 && (
              <ul>
                {product.imgFile.map((file: any, index: any) => (
                  <li key={index + 1}>{file.name}</li>
                ))}
              </ul>
            )}
          </label>
        </div>
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>Giá sản phẩm</div>
        <Separator />
        <div className='grid grid-cols-2 gap-8 mt-4'>
          <InputWithTooltip
            label='Giá bán'
            tooltipText='Số tiền khách hàng cần thanh toán'
            value={product.comparePrice}
            onBlur={e => handleBlur(e, 'comparePrice')}
            onFocus={() => handleFocus('comparePrice')}
            onChange={e =>
              setProduct({ ...product, comparePrice: e.target.value })
            }
            id='compare-price'
            placeholder='0 đ'
          />

          <InputWithTooltip
            label='Giá so sánh'
            tooltipText='Số tiền chưa giảm giá, thể hiện giá trị giảm giá, ưu đãi cho
                    khách hàng'
            value={product.sellPrice}
            onBlur={e => handleBlur(e, 'sellPrice')}
            onFocus={() => handleFocus('sellPrice')}
            onChange={e =>
              setProduct({ ...product, sellPrice: e.target.value })
            }
            id='compare-price'
            placeholder='0 đ'
          />
        </div>
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>Vận chuyển</div>
        <Separator />
        <div className='flex items-center space-x-2 mt-4'>
          <Checkbox
            id='ship'
            checked={isShipped}
            onCheckedChange={handleCheckboxChange}
          />
          <label
            htmlFor='ship'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Chọn để cho phép giao hàng với sản phẩm này
          </label>
        </div>
        <InputWithTooltip
          className='mt-4'
          label='Khối lượng'
          placeholder='0'
          type='number'
          tooltipText={'Sử dụng để tính khối lượng khi giao hàng'}
          value={product.unit.toString()}
          id='unit'
          onChange={e => setProduct({ ...product, unit: +e.target.value })}
        />
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>Đơn vị tính</div>
        <Separator />
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>Biến thể</div>
        <Separator />
      </section>

      <section className='py-4 px-6 shadow-inner bg-white box-shadow-style mt-8 rounded-md'>
        <div className='flex w-full mb-2 items-center'>Tối ưu SEO</div>
        <Separator />
      </section>
    </div>
  )
}
export default ProductAddPage
