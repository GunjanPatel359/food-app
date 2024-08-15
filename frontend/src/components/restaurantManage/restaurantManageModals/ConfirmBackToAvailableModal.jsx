import { useModal } from '../../../customhooks/zusthook'
import { backend_url } from '../../../server'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { IoWarning } from 'react-icons/io5'

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
        <div className="text-rose-500 font-semibold text-2xl mb-2">
            Back To Available
        </div>
        <div className="w-full h-[2px] bg-rose-500 mb-2"></div>
        <div className='text-justify'>
            <IoWarning className='inline mr-1' size={22} />
            Are you sure you want to transfer table number <span className='text-rose-500 font-semibold underline'>{data.backToAvailable.tableNumber}</span> to available?
        </div>
        <div className='flex w-full gap-1 mt-4'>
        <button className='text-white bg-rose-500 w-full p-2 rounded' onClick={handleBackToAvailable} disabled={loading}>Confirm</button>
        <button className='text-rose-500 bg-white w-full p-2 border border-rose-500 rounded' disabled={loading} onClick={()=>onClose()}>cancel</button>
        </div>
        </div>
        </>
      )}
    </div>
  )
}

export default ConfirmBackToAvailableModal
