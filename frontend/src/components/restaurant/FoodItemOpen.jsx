/* eslint-disable react/prop-types */

import { img_url } from "../../server"
import Tooltip from '../customui/Tooltip'

const FoodItemOpen = ({item}) => {
  return (
    <div className='p-2 bg-white border-b border-rose-200'>
      <div className='flex transition-all'>
        <img
          src={`${img_url}/${item.imageUrl}`}
          className='h-[80px] rounded shadow shadow-rose-300'
        />
        <div className='ml-2 w-full'>
          <div className='flex justify-between w-full'>
            <div className='text-xl text-rose-500 font-semibold'>
              {item.name}
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
          <div className='flex'>
          <Tooltip position="right" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle='bg-rose-200 text-rose-600'>
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

export default FoodItemOpen
