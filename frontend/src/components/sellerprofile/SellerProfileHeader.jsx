import { img_url } from '../../server'
import { User } from 'lucide-react'
import { IoFastFoodOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const SellerProfileHeader = () => {
  const {seller}=useSelector((state)=>state.seller)
  return (
    <div>
      <div className='w-full shadow-md border-b border-rose-50'>
      <div className='w-full bg-white'>
        <div className='w-[80%] m-auto flex  text-rose-500 h-[80px] justify-between'>
        <span className='flex text-4xl gap-x-4 cursor-pointer m-4'>
          <IoFastFoodOutline size={40} className='text-rose-500'/>
          <span>Taste</span>
        </span>
        <span className='text-center items-center flex '>
            <Link to="/seller/profile">
            <div className='border-2 border-rose-500 hover:bg-rose-50 rounded-full'>
              {seller.avatar?(<><img src={`${img_url}/${seller.avatar}`} className='md:w-[55px] w-[40px] rounded-full border border-white' /></>):
              (<><User size={30} className='text-rose-500 m-1'/></>)
              }
            </div>
            </Link>
        </span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SellerProfileHeader
