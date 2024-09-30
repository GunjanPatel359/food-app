/* eslint-disable react/prop-types */
import { img_url } from '../../server'
import { User } from 'lucide-react'
import { IoFastFoodOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const ProfileHeader = () => {
  const navigate=useNavigate()
  const user=useSelector((state)=>state.user).user
  return (
    <div>
      <div className='w-full shadow-md shadow-color1'>
        <div className='bg-gradient-to-tr from-color5 to-color4  w-full'>
          <div className='w-[80%] m-auto flex py-5 px-2 text-white h-[80px] justify-between'>
            <span className='flex text-4xl gap-x-4 cursor-pointer'>
              <IoFastFoodOutline size={40} color='white' />
              <span onClick={()=>navigate('/')}>Taste</span>
            </span>
            <span className='text-center items-center flex'>
              <Link to="/profile">
                {
                  user && user?.avatar ? (
                    <div className='border-2 border-white rounded-full' onClick={()=>navigate('/profile')}>
                      <img className='rounded-full w-[50px]' src={`${img_url}/${user.avatar}`} />
                    </div>) : (
                    <div className='border-2 border-white rounded-full p-1'>
                      <User size={30} color="white" className='text-color5' />
                    </div>
                  )
                }
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
