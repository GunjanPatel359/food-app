import { useEffect, useState } from 'react'
import { useModal } from '../../../customhooks/zusthook'
import { toast } from 'react-toastify'
import axios from 'axios'
import { backend_url, img_url } from '../../../server'
import { useParams } from 'react-router-dom'
import { FaRegCircleUser } from 'react-icons/fa6'
import { MdCancel } from 'react-icons/md'

const ManageRoleMemberModal = () => {
    const params = useParams()
    const { hotelId } = params
    const { isOpen, data, type,onlyReloadCom,onClose } = useModal()

    const [roleMembers, setRoleMembers] = useState([])
    const [roleId, setRoleId] = useState([])
    const [loading,setLoading]=useState(false)
    const isModelOpen = isOpen && type == "manage-role-member"

    useEffect(() => {
        const roleMembers = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${backend_url}/member/${data.manageMemberRole._id}/${hotelId}/membersWithDetails`, { withCredentials: true })
                if (response.data.success) {
                    setRoleMembers(response.data.roleMembers)
                    setRoleId(response.data.roleId)
                }
            } catch (error) {
                toast.error(error.message)
            }finally{
                setLoading(false)
            }
        }
        if (data && data.manageMemberRole) {
            roleMembers()
        }
    }, [hotelId,data])

    if (!isModelOpen) {
        return null
    }

    const handleRemoveMember=async(id)=>{
        if(loading){
            return null
        }
        setLoading(true)
        try {
            const response=await axios.post(`${backend_url}/member/remove-member/${hotelId}`,{roleId:roleId,sellerId:id},{withCredentials:true})
                if (response.data.success) {
                    onlyReloadCom()
                    setRoleMembers((item)=>item.filter((item)=>item._id!=id))
                    toast.success("member deleted successfully")
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
                <div className="lg:w-[600px] w-[480px] max-h-[500px] p-3 px-10 pt-7">
                    <div className='relative'>
                    <MdCancel className='cursor-pointer absolute -right-6 -top-2 text-white bg-color5 rounded-full' onClick={() => onClose()} size={25} />
                </div>
                    <div>
                        <div className="text-2xl font-semibold pb-3">Members</div>
                        <div className="w-full border border-color4 shadow-2xl shadow-color2"></div>
                    </div>
                    <div className='mt-2 flex flex-col gap-2'>
                        {roleMembers.length>0?roleMembers.map((item, i) => {
                            return (
                                <div
                                    key={i}
                                    className='flex border border-color5 p-2 justify-between rounded shadow shadow-color5'
                                >
                                    <div className='flex'>
                                        <div className='my-auto cursor-pointer'>
                                            {item.avatar ? (
                                                <img
                                                    src={`${img_url}/${item.avatar}`}
                                                    className='rounded-full w-[40px]'
                                                />
                                            ) : (
                                                <FaRegCircleUser size={40} />
                                            )}
                                        </div>
                                        <div className='flex flex-col ml-2'>
                                            <div className='font-semibold'>
                                                {item.name}
                                            </div>
                                            <div className='text-sm'>
                                                {item.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex mr-1'>
                                        <MdCancel size={30} className={`m-auto ${loading?'opacity-80 cursor-not-allowed':'hover:opacity-80 cursor-pointer'}`} onClick={()=>handleRemoveMember(item._id)}/>
                                    </div>
                                </div>
                            )
                        }):<>
                        <div className='mt-3 mb-3'>
                            <p className='text-lg font-bold text-center'>No members yet</p>
                        </div>
                        </>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageRoleMemberModal
