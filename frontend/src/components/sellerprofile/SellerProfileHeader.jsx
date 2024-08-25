import { img_url } from '../../server'
import { User } from 'lucide-react'
import { IoFastFoodOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const SellerProfileHeader = () => {
  const navigate=useNavigate()
  const {seller}=useSelector((state)=>state.seller)
  return (
    <div>
      <div className='w-full shadow-md border-b border-color0'>
      <div className='w-full bg-white'>
        <div className='w-[80%] m-auto flex  text-color5 h-[80px] justify-between'>
        <span className='flex text-4xl gap-x-4 cursor-pointer m-4' onClick={()=>navigate('/seller/profile')}>
          <IoFastFoodOutline size={40} className='text-color5'/>
          <span>Taste</span>
        </span>
        <span className='text-center items-center flex '>
            <Link to="/seller/profile">
            <div className='border-2 border-color5 hover:bg-color0 rounded-full'>
              {seller.avatar?(<><img src={`${img_url}/${seller.avatar}`} className='md:w-[55px] w-[40px] rounded-full border border-white' /></>):
              (<><User size={30} className='text-color5 m-1'/></>)
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
