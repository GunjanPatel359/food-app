import { useModal } from '../../../customhooks/zusthook';
import { backend_url } from '../../../server';
import axios from 'axios';
import { useState } from 'react'
import { IoWarning } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteFoodCategory = () => {
    const params = useParams()
    const { hotelId } = params

    const { type, data, isOpen, reloadCom,onClose } = useModal();
    const isModelOpen = isOpen && type === "Delete-Food-Category";
    const [loading,setLoading]=useState(false)
    if(!isModelOpen){
        return null
    }
    const handleClick=async()=>{
        setLoading(true)
        try {
            const response=await axios.delete(`${backend_url}/category/${hotelId}/${data.categoryDelete._id}/delete-category`,{withCredentials:true})
            if(response.data.success){
                reloadCom()
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
                    <div className="lg:w-[600px] w-[480px] p-3 px-10 pt-7">
                        <div>
                            <div className="text-2xl font-semibold pb-3">Delete Food Category</div>
                            <div className="w-full border border-rose-400 shadow-2xl shadow-rose-200"></div>
                            <div className="mt-2">
                            <IoWarning size={25} className="inline mr-1" />Are you sure you want to delete <span className="font-semibold text-rose-500 underline">{data.categoryDelete.categoryName}</span>?
                            </div>
                            <div>All the items having category <span className="font-semibold text-rose-500 underline">{data.categoryDelete.categoryName}</span> will be deleted.</div>
                            <div className="flex w-full gap-2 mt-4 mb-3">
                                <button className="w-[50%] bg-rose-500 text-white p-2 rounded text-center hover:opacity-90 cursor-pointer" onClick={handleClick} disabled={loading?true:false}>Delete Food Category</button>
                                <button className="w-[50%] bg-white text-rose-500 p-2 rounded text-center border border-rose-500 hover:opacity-90 cursor-pointer" disabled={loading?true:false} onClick={()=>onClose()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
    </div>
  )
}

export default DeleteFoodCategory
