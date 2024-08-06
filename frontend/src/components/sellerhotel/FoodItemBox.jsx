/* eslint-disable react/prop-types */
import { MdEdit } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import { img_url } from '../../server'
import Tooltip from '../customui/Tooltip'
import { useModal } from '../../customhooks/zusthook'

const FoodItemBox = ({ item,role }) => {
  const {onOpen}=useModal()
  return (
    <div className='m-1 p-2 rounded border border-rose-500 border-dashed bg-white shadow shadow-rose-200'>
      <div className='flex transition-all'>
        <img
          src={`${img_url}/${item.imageUrl}`}
          className='h-[90px] rounded shadow shadow-rose-300'
        />
        <div className='ml-2 w-full'>
          <div className='flex justify-between w-full'>
            <div className='text-2xl text-rose-500 font-semibold'>
              {item.name}
            </div>
            {(role.adminPower || role.canManageFoodItemData)&&(
            <div className='my-auto flex gap-2'>
              <span>
                <button className='border border-rose-500 bg-rose-500 flex p-[3px] rounded shadow cursor-pointer' onClick={()=>onOpen('edit-food-item',{editFoodItem:item})}>
                  <MdEdit className='bg-rose-500 text-white inline' size={18} />
                </button>
              </span>
              <span>
                <button className='border border-rose-500 bg-rose-500 flex p-[3px] rounded shadow cursor-pointer' onClick={()=>onOpen('Delete-Food-Item',{deleteFoodItem:item})}>
                  <MdDeleteForever
                    className='bg-rose-500 text-white inline'
                    size={18}
                  />
                </button>
              </span>
            </div>)}
          </div>
          <div className='flex justify-between w-full'>
            <div className='text-rose-500'>{item.smallDescription}</div>
            <div>
              <span>
                <div className='text-rose-500 font-semibold'>
                  {item.price}/-
                </div>
              </span>
            </div>
          </div>
          <div className='flex'>
            <Tooltip position="bottom" content="veg" TooltipStyle='bg-rose-200 text-rose-600'>
            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
              <span className={`m-auto mx-auto rounded-full w-full h-full ${item.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
              </span>
            </span>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* <div className="m-1">
        {item.foodTypes.map((item,i)=>{
          return <span key={i} className="p-1 rounded border border-rose-500 text-sm text-white bg-rose-500 mr-2">
            {item}
          </span>
        })}
      </div> */}
    </div>
  )
}

export default FoodItemBox
