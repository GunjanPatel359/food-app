import { useParams } from "react-router-dom";
import { useModal } from "../../../customhooks/zusthook";
import { IoWarning } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url } from "../../../server";
import { useEffect, useState } from "react";

const DeleteRoleModal = () => {
    const params = useParams()
    const { hotelId } = params

    const { type, data, isOpen, reloadCom,onClose } = useModal();
    const isModelOpen = isOpen && type === "Delete-role";

    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        setLoading(false)
    },[])

    if (!isModelOpen) {
        return null;
    }
    const handleClick=async()=>{
        setLoading(true)
        try {
            const response=await axios.delete(`${backend_url}/role/${hotelId}/${data?.deleterole._id}/delete-role`,{withCredentials:true})
            if(response.data.success){
                toast.success(response.data.message)
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
                            <div className="text-2xl font-semibold pb-3">Delete Role</div>
                            <div className="w-full border border-color4 shadow-2xl shadow-color2"></div>
                            <div className="mt-2">
                                <IoWarning size={25} className="inline mr-1" />Are you sure you want to delete <span className="font-semibold text-color5 underline">{data.deleterole.roleName}</span> role?
                            </div>
                            <div className="flex w-full gap-2 mt-4 mb-3">
                                <button className="w-[50%] bg-color5 text-white p-2 rounded text-center hover:opacity-90 cursor-pointer" onClick={handleClick} disabled={loading?true:false}>Delete Role</button>
                                <button className="w-[50%] bg-white text-color5 p-2 rounded text-center border border-color5 hover:opacity-90 cursor-pointer" disabled={loading?true:false} onClick={()=>onClose()}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeleteRoleModal;
