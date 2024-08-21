import { useModal } from '../../../customhooks/zusthook'
import { useState } from 'react'
import { Switch } from "../../ui/switch"
import { toast } from 'react-toastify'

import { IoWarning } from "react-icons/io5";
import axios from 'axios'
import { backend_url } from '../../../server'
import { useParams } from 'react-router-dom'

const CreateRoleModal = () => {
    const params=useParams()
    const {hotelId}=params
  const { isOpen, type,data ,reloadCom,onClose} = useModal()

  const isModelOpen = isOpen && type === 'create-roles'

  const [roleName,setRoleName]=useState("")
  const [roleDescription,setRoleDescription]=useState("")
  const [canUpdateRestaurantImg,setCanUpdateRestaurantImg]=useState(false)
  const [canUpdateRestaurantDetails,setCanUpdateRestaurantDetails]=useState(false)
  const [canManageRoles,setCanManageRoles]=useState(false)
  const [canManageFoodItemData,setCanManageFoodItemData]=useState(false)
  const [adminPower,setAdminPower]=useState(false)
  const [canAddMember,setCanAddMember]=useState(false)

  if(!isModelOpen){
    return null
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
        const response=await axios.post(`${backend_url}/role/create-role/${hotelId}`,{roleName,roleDescription,canUpdateRestaurantImg,canUpdateRestaurantDetails,canManageRoles,canAddMember,adminPower,canManageFoodItemData},{withCredentials:true})
        if(response.data.success){
          toast.success(response.data.message)
          
          return reloadCom()
        }
        return toast.error("Something went wrong")
    } catch (error) {
        toast.error(error)
    }
  }
  return (
    <div>
      {isModelOpen && (
        <>
        <div className='lg:w-[600px] w-[480px] h-[580px] p-4 px-10 pt-7'>
            <div>
                <div className='text-2xl font-semibold pb-3'>
                    Create Role
                </div>
                <div className='w-full border border-rose-400 shadow-2xl shadow-rose-200'></div>
                <div className='bg-rose-100 w-full mt-4'>
                    <form onSubmit={handleSubmit} className='p-4 flex flex-col gap-2'>

                        <div className=' font-semibold'>Role Name:</div>
                        <input type='text' placeholder='Enter the Role name' className='p-2 w-full text-rose-500 border border-rose-100 outline-rose-300 rounded  hover:border-rose-400 placeholder:text-rose-300' required value={roleName} onChange={(e)=>setRoleName(e.target.value)} />

                        <div className=' font-semibold'>Role Description:</div>
                        <input type='text' placeholder='Enter the role description' className='p-2 w-full text-rose-500 border border-rose-100 outline-rose-300 rounded  hover:border-rose-400 placeholder:text-rose-300' required value={roleDescription} onChange={(e)=>setRoleDescription(e.target.value)}/>
                        

                        <div className='p-2 bg-white rounded'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>member can update Restaurant image</span>
                            <Switch checked={canUpdateRestaurantImg} onCheckedChange={()=>setCanUpdateRestaurantImg(!canUpdateRestaurantImg)} className="my-auto mr-1" />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>member can update Restaurant info</span>
                            <Switch checked={canUpdateRestaurantDetails} onCheckedChange={()=>setCanUpdateRestaurantDetails(!canUpdateRestaurantDetails)} className="my-auto mr-1" />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>Manage roles</span>
                        <Switch checked={canManageRoles} onCheckedChange={()=>setCanManageRoles(!canManageRoles)} className="my-auto mr-1" 
                            //  disabled={data.role.adminPower?false:true}
                             />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                                 
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>Manage food items</span>
                        <Switch checked={canManageFoodItemData} onCheckedChange={()=>setCanManageFoodItemData(!canManageFoodItemData)} className="my-auto mr-1" 
                            //  disabled={data.role.adminPower?false:true}
                             />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                                 
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>Admin Power</span>
                        <Switch checked={adminPower} onCheckedChange={()=>setAdminPower(!adminPower)} className="my-auto mr-1" 
                             disabled={data.role.adminPower?false:true}
                             />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                                <IoWarning size={22} className='text-rose-500 inline mr-1'/>
                                sdhverevhjeruictnhuernt erncyndb getryctrhertgyvtdfijeut ewtvgwueghc wet tuweuhcgew c 
                             </p>
                        </div>


                        <div className='p-2 bg-white rounded'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>invite member</span>
                            <Switch checked={canAddMember} onCheckedChange={()=>setCanAddMember(!canAddMember)} className="my-auto mr-1" />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                             </p>
                        </div>

                        {/* will be adding other stuff later */}
                        <div className="flex gap-2">
                        <button type='submit' className='bg-rose-400 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded w-full'>Create Role</button>
                        <button type='button' className='bg-white hover:text-rose-400 border border-rose-500 text-rose-500 py-2 px-4 rounded w-full' onClick={()=>onClose()}>Cancel</button>
                        </div>
                        
                    </form>
                </div>
                <div className='h-[25px]'></div>
            </div>
        </div>
        </>
      )}
    </div>
  )
}

export default CreateRoleModal
