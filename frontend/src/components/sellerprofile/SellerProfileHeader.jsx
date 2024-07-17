import { User } from 'lucide-react'
import { IoFastFoodOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const SellerProfileHeader = () => {
  return (
    <div>
      <div className='w-full shadow-md border-b border-rose-50'>
      <div className='w-full bg-white'>
        <div className='w-[80%] m-auto flex py-5 px-2 text-rose-500 h-[80px] justify-between'>
        <span className='flex text-4xl gap-x-4 cursor-pointer'>
          <IoFastFoodOutline size={40} className='text-rose-500'/>
          <span>Taste</span>
        </span>
        <span className='text-center items-center'>
            <Link to="/profile">
            <div className='border-2 border-rose-500 hover:bg-rose-50 rounded-full p-1'>
             <User size={30} className='text-rose-500'/>
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
