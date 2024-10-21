import { useModal } from '../../../customhooks/zusthook'
import { backend_url } from '../../../server'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { IoWarning } from 'react-icons/io5'
import { socket } from '../../../socket'

const ConfirmBackToAvailableModal = () => {
    const params=useParams()
  const {hotelId}=params
  const { isOpen, type,data,onClose } = useModal()
  const isModelOpen = isOpen && type === 'back-to-available'
  const [loading,setLoading]=useState(false)
  if(!isModelOpen){
    return null
  }
    const handleBackToAvailable=async()=>{
        setLoading(true)
        try {
            const res=await axios.get(`${backend_url}/order-table/${hotelId}/back-to-available/${data.backToAvailable._id}`,{withCredentials:true})
            if(res.data.success){
                toast.success("back to available succesfully")
                socket.emit("restaurant/hotel/order-tables",hotelId)
                onClose()
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    }
  return (
    <div>
      {isModelOpen && (
        <>
         <div className="w-[500px] p-6">
        <div className="text-color5 font-semibold text-2xl mb-2">
            Back To Available
        </div>
        <div className="w-full h-[2px] bg-color5 mb-2"></div>
        <div className='text-justify text-color5'>
            <IoWarning className='inline mr-1 text-color5' size={22} />
            Are you sure you want to transfer table number <span className='text-color5 font-semibold underline'>{data.backToAvailable.tableNumber}</span> to available?
        </div>
        <div className='flex w-full gap-1 mt-4'>
        <button className='text-white bg-color5 w-full p-2 rounded' onClick={handleBackToAvailable} disabled={loading}>Confirm</button>
        <button className='text-color5 bg-white w-full p-2 border border-color5 rounded' disabled={loading} onClick={()=>onClose()}>cancel</button>
        </div>
        </div>
        </>
      )}
    </div>
  )
}

export default ConfirmBackToAvailableModal
