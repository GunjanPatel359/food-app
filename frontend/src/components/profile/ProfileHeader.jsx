import { User } from 'lucide-react'
import { IoFastFoodOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

const ProfileHeader = () => {
  return (
    <div>
      <div className='w-full shadow-md shadow-rose-200'>
      <div className='bg-gradient-to-tr from-rose-400 to-red-400  w-full'>
        <div className='w-[80%] m-auto flex py-5 px-2 text-white h-[80px] justify-between'>
        <span className='flex text-4xl gap-x-4 cursor-pointer'>
          <IoFastFoodOutline size={40} color='white' />
          <span>Taste</span>
        </span>
        <span className='text-center items-center flex'>
            <Link to="/profile">
              <div className='border-2 border-white rounded-full p-1'>
              <User size={30} color="white" className='text-rose-500'/>
              </div>
            </Link>
        </span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default ProfileHeader
