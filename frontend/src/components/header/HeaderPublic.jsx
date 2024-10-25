/* eslint-disable react/prop-types */
import { IoFastFoodOutline } from 'react-icons/io5'
import { Command, CommandInput } from '../ui/command'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { User } from 'lucide-react'
import { img_url } from '../../server'

const HeaderPublic = () => {
  const user=useSelector((state)=>state.user)
  const navigate=useNavigate()
  return (
    <div className='w-full shadow-md border-b border-color0'>
      <div className='bg-gradient-to-tr from-color4 to-color5 w-full'>
        <div className='md:w-[80%] sm:w-[90%] m-auto flex px-2 text-white h-[80px] justify-between'>
        <span className='flex text-4xl gap-x-4 cursor-pointer my-auto' onClick={()=>navigate('/')}>
          <IoFastFoodOutline size={40} color='white' />
          <span>Taste</span>
        </span>
        {/* <span className='text-center items-center my-auto'>
          <Command className='bg-white text-color5 rounded w-[300px]'>
            <CommandInput placeholder='Enter the shop or dish name' />
          </Command>
        </span> */}
        {
          user.user?(<>
          {user.user?.avatar ? (
                    <span className='border-2 border-color4 rounded-full min-h-fit p-[2px] my-auto cursor-pointer bg-white' onClick={()=>navigate('/profile')}>
                      <img className='rounded-full w-[50px] h-[50px]' src={`${img_url}/${user.user.avatar}`} />
                    </span>) : (
                    <span className='border-2 border-white rounded-full my-auto p-1 cursor-pointer' onClick={()=>navigate('/profile')}>
                      <User size={30} color="white" className='text-color5' />
                    </span>
                  )}
          </>):(
            <>
            <span className='text-center items-center'>
          <Link to='/login'>
            <Button className="text-lg hover:text-color1">
              SignIn
            </Button>
          </Link>/
          <Link to='/sign-up'>
            <Button className="text-lg">
              Signup
            </Button>
          </Link>
        </span>
            </>
          )
        }
        </div>
      </div>
    </div>
  )
}

export default HeaderPublic
