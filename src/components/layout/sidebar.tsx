'use client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

const Sidebar = () => {
  const router = useRouter()
  return (
    <section
      id='sidebar'
      className='w-[16rem] h-full bg-gray-200 p-2 text-black'
    >
      <div className='flex flex-col gap-4'>
        <Button
          variant={'ghost'}
          className='justify-start'
          onClick={() => router.push('/')}
        >
          <img
            className='w-[1.25rem]'
            src='icon/icon-home.svg'
            alt='Tổng quan'
          />
          Tổng quan
        </Button>
        {/* <Button
          variant={'ghost'}
          className='justify-start'
          onClick={() => router.push('/cart')}
        >
          <img className='w-[1.25rem]' src='icon/icon-cart.svg' alt='' />
          Đơn hàng
        </Button> */}
        <Button
          variant={'ghost'}
          className='justify-start'
          onClick={() => router.push('/product')}
        >
          <img className='w-[1.25rem]' src='icon/icon-tag.svg' alt='' />
          Sản phẩm
        </Button>
      </div>
    </section>
  )
}
export default Sidebar
