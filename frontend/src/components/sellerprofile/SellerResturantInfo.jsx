import { Plus } from 'lucide-react'
import { useModal } from '../../customhooks/zusthook'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { backend_url, img_url } from '../../server'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const SellerResturantInfo = () => {
  const navigate=useNavigate()

    const {onOpen}=useModal()
    const {seller}=useSelector((state)=>state.seller)
    const [hotels,setHotels]=useState([])

    useEffect(()=>{
      const getAllSellerHotels=async()=>{
          try {
            const res=await axios.get(`${backend_url}/seller/getallsellerhotels`,{
              withCredentials:true
            })
            setHotels(res.data.hotel)
          } catch (error) {
            toast.error(error)
          }
        }
        if(seller.restaurantIDs.length>0){
          getAllSellerHotels()
        }
    },[seller])


  return (
      <div className='p-10 pt-1'>
      <div className='flex justify-end p-2'>
        <span
          className='text-rose-500 transition-all duration-200 bg-rose-100 p-1 rounded cursor-pointer hover:bg-rose-200 font-extrabold'
          onClick={()=>onOpen("create-restaurant")}
        >
          <Plus size={25} />
        </span>
      </div>
      <div className='w-full h-[300px] flex flex-wrap'>
        {hotels.length>0 && hotels.map((item,i)=>{
          return (
            <div key={i} className='transition-all duration-300 p-3 border border-rose-500 rounded-xl bg-white shadow-xl'
            >
              <img src={`${img_url}/${item.imgUrl}`} className='h-[170px] rounded-xl' />
              <div className='flex flex-col p-1'>
              <div className='text-2xl text-rose-500 font-bold flex flex-wrap'>{item.name}</div>
              <div className='text-rose-600 font-semibold flex flex-wrap'>Country: <span className='ml-1 text-rose-500 font-normal'>{item.addresses.country}</span></div>
              <div className='text-rose-600 font-semibold flex flex-wrap'>State: <span className='ml-1 text-rose-500 font-normal'>{item.addresses.state}</span></div>
              <div className='text-rose-600 font-semibold flex flex-wrap'>City: <span className='ml-1 text-rose-500 font-normal'>{item.addresses.city}</span></div>
              <div className='text-rose-600 font-semibold mb-2 flex flex-wrap'>zipcode: <span className='ml-1 text-rose-500 font-normal'>{item.addresses.zipCode}</span></div>
              <button className='mb-1 transition-all bg-rose-400 text-white p-1 rounded-xl px-3 hover:opacity-90 shadow'
              onClick={()=>navigate(`/seller/${item._id}`)}
              >View</button>
              <button className='bg-white text-red-500 p-1 rounded-xl px-3 border border-red-500 shadow hover:text-red-600 hover:border-red-600' onClick={()=>onOpen("delete-restaurant",item)}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>  
  )
}

export default SellerResturantInfo
