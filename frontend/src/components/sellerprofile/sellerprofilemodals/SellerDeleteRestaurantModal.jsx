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
            <div className='m-3 font-bold text-xl pl-2'>Deleting {data.name}</div>
            <div className='w-[90%] h-[1px] bg-color4 m-auto'></div>
            <div className='p-5 text-justify'><IoIosWarning className='inline translate-y-[-1px]' size={20}/> Are You Sure? You want to delete <span className='text-color5 font-semibold underline'>{data.name}</span>. This action cannot be undone.</div>
            <div className='flex flex-col w-[90%] m-auto'>
                <button className='text-color5 w-full p-2 border border-color5 rounded-xl mb-2 shadow-color5 shadow-inner' onClick={handleClick}>Delete</button>
                <button className='transition-all font-semibold text-white w-full p-2 border bg-color4 rounded-xl shadow shadow-color2 hover:opacity-90' onClick={()=>onClose()}>Cancel</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default SellerDeleteRestaurantModal
