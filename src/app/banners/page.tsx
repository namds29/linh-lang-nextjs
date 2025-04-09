'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import bannersService from '@/services/banners.service'
import { useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'

const listImg = [
  {
    id: '1',
    imgUrl:
      'https://i0.wp.com/plopdo.com/wp-content/uploads/2021/11/feature-pic.jpg?fit=537%2C322&ssl=1',
    orderIndex: 1
  },
  {
    id: '2',
    imgUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s',
    orderIndex: 2
  },
  {
    id: '3',
    imgUrl:
      'https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg',
    orderIndex: 3
  }
]
function Page () {
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
  useEffect(() => {
    const fetchListBanner = async () => {
      const res = await bannersService.fetchBanners()

      console.log(res)
    }
    fetchListBanner()
  }, [])
  return (
    <div>
      <Card className='p-6 mb-6'>
        <CardTitle>Banners</CardTitle>
        <CardContent className='mt-6 gap-6 overflow-x-auto'>
          {listImg.map((item, index) => (
            <>
              <Draggable key={item.id} draggableId={item.id} index={index}>
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
                      className='mt-4 bg-gray-300 h-[400px] w-full'
                      key={item.id}
                    >
                      <img
                        className='w-full h-full'
                        src={item.imgUrl}
                        alt={item.id}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            </>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
export default Page
