import { toast } from 'react-toastify';
import { useModal } from '../../../customhooks/zusthook'
import { IoIosWarning } from "react-icons/io";
import axios from 'axios';
import { backend_url } from '../../../server';
import { useDispatch } from 'react-redux';
import { addSeller } from '../../../redux/reducers/seller';
import { useNavigate } from 'react-router-dom';

const SellerDeleteRestaurantModal = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const { isOpen, type, onClose, data } = useModal()
  const isModelOpen = isOpen && type === 'delete-restaurant'
  const handleClick=async()=>{
    try {
        const res=await axios.delete(`${backend_url}/seller/deleterestaurant/${data._id}`,{withCredentials:true})
        if(res.data.success){
            dispatch(addSeller(res.data.seller))
            navigate('/seller/profile')
            onClose()
        }
    } catch (error) {
        toast.error(error.message)
    }
  }
  return (
    <>
      {isModelOpen && (
        <>
          <div className='w-[450px] p-3'>
            <div className='text-center m-3 font-bold text-xl'><IoIosWarning className='inline translate-y-[-1px]' size={20}/>  Are You Sure?</div>
            <div className='w-[90%] h-[1px] bg-rose-400 m-auto'></div>
            <div className='p-5 text-justify'>You want to delete <span className='text-red-500 font-semibold underline'>{data.name}</span>. This action cannot be undone.</div>
            <div className='flex flex-col w-[90%] m-auto'>
                <button className='text-red-600 w-full p-2 border border-red-600 rounded-xl mb-2 shadow-red-600 shadow-inner' onClick={handleClick}>Delete</button>
                <button className='transition-all text-white w-full p-2 border bg-rose-400 rounded-xl shadow-md shadow-rose-200 hover:opacity-90' onClick={()=>onClose()}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default SellerDeleteRestaurantModal
