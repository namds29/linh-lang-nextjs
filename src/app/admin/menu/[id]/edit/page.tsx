'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { redirect, useParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { MenuItem, MenuItemEdit } from '@/lib/types/utils.types'
import { useEffect, useState } from 'react'
import { MenuTree } from '@/components/layout/menu-tree'
import { DialogClose } from '@radix-ui/react-dialog'
import { Separator } from '@/components/ui/separator'
import menusService from '@/services/menus.service'
import { toast } from '@/hooks/use-toast'
const listDirection = [
  'Trang chủ',
  'Nhóm sản phẩm',
  'Sản phẩm',
  'Tất cả sản phẩm'
]
interface ItemProps {
  id?: string
  name: string
  pathLink: string
}
function MenuEditPage () {
  const [menuData, setMenuData] = useState<MenuItem[] | MenuItemEdit[]>([])
  const [newParentProps, setNewParentProps] = useState<ItemProps>({
    id: '',
    name: '',
    pathLink: ''
  }) // State for new parent name
  const [childProps, setChildProps] = useState<ItemProps>({
    id: '',
    name: '',
    pathLink: 'Trang chủ'
  }) // State for new parent name
  const paramsUrl = useParams<{ id: string }>()

  useEffect(() => {
    console.log(paramsUrl)

    const handleGetDetailMenu = async () => {
      const res = await menusService.fetchDetailMenu(paramsUrl.id)
      console.log(res)
      if (res) {
        setNewParentProps({
          id: res.id,
          name: res.name,
          pathLink: res.pathLink
        })
        setMenuData(res.menuChild)
      }
    }
    handleGetDetailMenu()
  }, [paramsUrl.id])

  const addChild = (parentId: string) => {
    const newMenuItem: MenuItem | MenuItemEdit = {
      id: Math.random().toString(), // Use a unique ID generator in production
      name: childProps.name,
      pathLink: childProps.pathLink,
      pathType: 'CHILD',
      tag: 'CHILD_TAG',
      isEdit: true,
      // parentId: newParentProps.id,
      status: 1,
      menuChild: []
    }

    const addItemRecursively = (items: MenuItem[]): MenuItem[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            menuChild: [...(item.menuChild || []), newMenuItem]
          }
        }
        if (item.menuChild) {
          return { ...item, menuChild: addItemRecursively(item.menuChild) }
        }
        return item
      })
    }

    setMenuData(prevData => addItemRecursively(prevData))
    setChildProps({ name: '', pathLink: '' })
  }
  const deleteItem = (id: string) => {
    const deleteItemRecursively = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        if (item.id === id) {
          return false // Do not include the item to delete
        }
        if (item.menuChild) {
          item.menuChild = deleteItemRecursively(item.menuChild)
        }
        return true // Include the item
      })
    }

    setMenuData(prevData => deleteItemRecursively(prevData))
  }
  const addParent = () => {
    if (!newParentProps.name.trim()) return // Prevent adding empty names
    const newParent: MenuItemEdit = {
      id: Math.random().toString(),
      parentId: newParentProps.id,
      name: childProps.name,
      pathLink: childProps.pathLink,
      isEdit: true,
      pathType: 'CHILD',
      tag: 'CHILD_TAG',
      status: 0,
      menuChild: []
    }
    console.log(newParent)

    setMenuData([...menuData, newParent])
    setChildProps({ ...childProps, name: '' }) // Clear the input field
  }

  const removeIdIfIsEdit = (obj: any): any => {
    if (obj.isEdit === true) {
      delete obj.id
      delete obj.isEdit
      if (!obj.menuChild.length) {
        delete obj.menuChild
      }
      // Remove the id field
    }

    if (Array.isArray(obj.menuChild)) {
      obj.menuChild.forEach((child: any) => removeIdIfIsEdit(child))
    }
    return obj
  }
  const handleSubmitForm = async () => {
    const mappedParams = {
      id: newParentProps.id,
      name: newParentProps.name,
      pathRoot: newParentProps.pathLink,
      pathType: 'ROOT',
      pathLink: newParentProps.pathLink,
      tag: 'ROOT_TAG',
      status: 1,
      menuChild: menuData
    }
    console.log(mappedParams)

    const params = removeIdIfIsEdit(mappedParams)
    console.log('params', params)
    const res = await menusService.updateMenu(params)
    if (res.status >= 200 && res.status < 400) {
      toast({
        variant: 'success',
        title: `Sửa thành công!`,
        description: `Menu has been updated successfully!`
      })
      redirect('/menu')
    } else {
      toast({
        variant: 'destructive',
        title: 'Tạo thất bại!',
        description: 'Vui lòng liên hệ admin để kiểm tra.'
      })
    }
  }
  return (
    <div className='py-4'>
      <div className='text-2xl font-bold text-red-400'>Chỉnh sửa menu</div>
      <div className='mt-8 flex gap-8'>
        <section className='w-[70%]'>
          <div className='py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md'>
            <div className='w-full'>
              <section className='grid w-full items-center gap-1.5'>
                <label className='text-md' htmlFor='title'>
                  Tên menu
                </label>
                <Input
                  required
                  className='w-full'
                  type='text'
                  id='title'
                  placeholder='Tên menu'
                  value={newParentProps.name ?? ''}
                  onChange={e =>
                    setNewParentProps({
                      ...newParentProps,
                      name: e.target.value
                    })
                  }
                />
              </section>
            </div>
          </div>

          <section className='mt-6 py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md'>
            <div className='w-full'>
              <section className='grid w-full items-center gap-1.5'>
                <div className='text-md flex justify-between'>
                  <p>Liên kết menu</p>

                  <Dialog>
                    <DialogTrigger className='bg-black text-white px-3 py-1 rounded-md text-sm'>
                      Tạo liên kết menu
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm liên kết</DialogTitle>
                        <div className='text-black !mt-6'>
                          <div>
                            <label className='text-md' htmlFor='name'>
                              Tên liên kết
                            </label>
                            <Input
                              required
                              className='w-full'
                              type='text'
                              id='name'
                              placeholder='Tên của liên kết'
                              onChange={e =>
                                setChildProps({
                                  ...childProps,
                                  name: e.target.value
                                })
                              }
                            />
                          </div>
                          <div className='mt-4'>
                            <label className='text-md' htmlFor='link-to'>
                              Liên kết đến
                            </label>
                            <Select
                              onValueChange={value =>
                                setChildProps({
                                  ...childProps,
                                  pathLink: value
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Trang chủ' />
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
                            type='button'
                            className='bg-gray-300'
                            variant='secondary'
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type='submit' onClick={addParent}>
                            Lưu
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className='mt-6'>
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

        <section className='w-[30%]'>
          <div className='w-full py-4 px-6 shadow-inner bg-white box-shadow-style rounded-md '>
            <p className='font-bold'>Đường dẫn</p>
            <input
              className='w-full border-gray-300 border px-4 py-1 rounded-md'
              required
              type='text'
              placeholder='Đường dẫn'
              value={newParentProps.pathLink ?? ''}
              onChange={e =>
                setNewParentProps({
                  ...newParentProps,
                  pathLink: e.target.value
                })
              }
            />
          </div>
        </section>
      </div>
      <Separator className='mt-8' />
      <div className='flex justify-end mt-4'>
        <Button onClick={handleSubmitForm}>Sửa menu</Button>
      </div>
    </div>
  )
}
export default MenuEditPage
