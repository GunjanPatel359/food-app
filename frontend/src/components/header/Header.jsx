/* eslint-disable react/prop-types */
import { IoFastFoodOutline } from 'react-icons/io5'
import { Command, CommandInput } from '../ui/command'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Header = ({page}) => {
  return (
    <div className='w-full'>
      <div className='bg-gradient-to-tr from-rose-400 to-red-400 w-full'>
        <div className='w-[80%] m-auto flex py-5 px-2 text-white h-[80px] justify-between'>
        <span className='flex text-4xl gap-x-4 cursor-pointer'>
          <IoFastFoodOutline size={40} color='white' />
          <span>Taste</span>
        </span>
        <span className='text-center items-center'>
          <Command className='bg-white text-rose-600 rounded w-[300px]'>
            <CommandInput placeholder='Enter the shop or dish name' />
          </Command>
        </span>
        <span className='text-center items-center'>
          <Link to='/login'>
            <Button className="text-lg hover:text-rose-100">
              SignIn
            </Button>
          </Link>/
          <Link to='/sign-up'>
            <Button className="text-lg">
              Signup
            </Button>
          </Link>
        </span>
        </div>
      </div>

      <div className='w-full'>
        <div className='w-[80%] m-auto'>

      <span className=''>
        <ul className='flex gap-x-1 items-center text-center text-lg'>
          <Link to=''>
            <Button className={`hover:text-rose-600 text-md rounded-[5px] transition duration-300 p-3 ${page==='home'?"text-rose-500":""}`}>
              Home
            </Button>
          </Link>
          <Link to=''>
            <Button className='hover:text-rose-600 text-md rounded-[5px] transition duration-300 p-3'>
              Resturants
            </Button>
          </Link>
          <Link to=''>
            <Button className='hover:text-rose-600 text-md rounded-[5px] transition duration-300 p-3'>
              Dishes
            </Button>
          </Link>
          <Link to=''>
            <Button className='hover:text-red-600 hover:bg-white text-md rounded-[5px] transition duration-300 p-3'>
              Contact Us
            </Button>
          </Link>
        </ul>
      </span>
        </div>
      </div>
    </div>
  )
}

export default Header
