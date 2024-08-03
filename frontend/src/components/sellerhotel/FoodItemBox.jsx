/* eslint-disable react/prop-types */
import { MdEdit } from 'react-icons/md'
import { MdDeleteForever } from 'react-icons/md'
import { img_url } from '../../server'

const FoodItemBox = ({ item }) => {
  return (
    <div className='m-1 p-2 rounded border border-rose-500 border-dashed bg-white shadow shadow-rose-200'>
      <div className='flex'>
        <img
          src={`${img_url}/${item.imageUrl}`}
          className='h-20 rounded shadow shadow-rose-300'
        />
        <div className='ml-2 w-full'>
          <div className='flex justify-between w-full'>
            <div className='text-2xl text-rose-500 font-semibold'>
              {item.name}
            </div>
            <div className='my-auto flex gap-2'>
              <span>
                <span className='border border-rose-500 bg-rose-500 flex p-[3px] rounded shadow cursor-pointer'>
                  <MdEdit className='bg-rose-500 text-white inline' size={18} />
                </span>
              </span>
              <span>
                <span className='border border-rose-500 bg-rose-500 flex p-[3px] rounded shadow cursor-pointer'>
                  <MdDeleteForever
                    className='bg-rose-500 text-white inline'
                    size={18}
                  />
                </span>
              </span>
            </div>
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
