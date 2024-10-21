import { useModal } from '../../../customhooks/zusthook'
import { useEffect, useState } from 'react'
import { Switch } from "../../ui/switch"
import { toast } from 'react-toastify'

import { IoWarning } from "react-icons/io5";
import axios from 'axios'
import { backend_url } from '../../../server'

const EditRolePermissionModal = () => {
  const { isOpen, type,onClose,data } = useModal()

  const isModelOpen = isOpen && type === 'Edit-role-Permission'

  const [roleName,setRoleName]=useState('') 
  const [roleDescription,setRoleDescription]=useState('')
  const [canUpdateRestaurantImg,setCanUpdateRestaurantImg]=useState()
  const [canUpdateRestaurantDetails,setCanUpdateRestaurantDetails]=useState()
  const [canManageRoles,setCanManageRoles]=useState()
  const [canManageFoodItemData,setCanManageFoodItemData]=useState()
  const [adminPower,setAdminPower]=useState()
  const [canAddMember,setCanAddMember]=useState()
  
  
  useEffect(()=>{
    const getRoleInfo=async()=>{
      try {
        const response=await axios.get(`${backend_url}/role/roleinfo/${data.editrole._id}`,{withCredentials:true})
        if(response.data.success){
          const item=response.data.role
          console.log(response.data.role)
          setRoleName(item.roleName)
          setRoleDescription(item.roleDescription)
          setCanUpdateRestaurantImg(item.canUpdateRestaurantImg)
          setCanUpdateRestaurantDetails(item.canUpdateRestaurantDetails)
          setCanManageRoles(item.canManageRoles)
          setCanManageFoodItemData(item.canManageFoodItemData)
          setAdminPower(item.adminPower)
          setCanAddMember(item.canAddMember)
        }
      } catch (error) {
        toast.error(error)
      }
    }
    if(data){
      if(data?.editrole){
        getRoleInfo()
      }
    }
  },[data])
  
  if(!isModelOpen){
    return null
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      console.log(data)
        const response=await axios.post(`${backend_url}/role/edit-role/${data.editrole._id}`,{roleName,roleDescription,canUpdateRestaurantImg,canUpdateRestaurantDetails,canManageRoles,canAddMember,adminPower,canManageFoodItemData},{withCredentials:true})
        if(response.data.success){
          toast.success(response.data.message)
          return onClose()
        }
        return toast.error("Something went wrong")
    } catch (error) {
        toast.error(error.message)
    }
  }
  return (
    <div>
      {isModelOpen && (
        <>
        <div className='lg:w-[600px] w-[480px] h-[580px] p-4 px-10 pt-7'>
            <div>
                <div className='text-2xl font-semibold pb-3'>
                    Manage Role
                </div>
                <div className='w-full border border-color4 shadow-2xl shadow-color2'></div>
                <div className='bg-color0 w-full mt-4 border border-color3'>
                    <form onSubmit={handleSubmit} className='p-4 flex flex-col gap-2'>

                        <div className=' font-semibold'>Role Name:</div>
                        <input type='text' placeholder='Enter the Role name' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={roleName} onChange={(e)=>setRoleName(e.target.value)} name='roleName' />

                        <div className=' font-semibold'>Role Description:</div>
                        <input type='text' placeholder='Enter the role description' className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3' required value={roleDescription} onChange={(e)=>setRoleDescription(e.target.value)} name='roleDescription'/>
                        

                        <div className='p-2 bg-white rounded border border-color3'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>member can update Restaurant image</span>
                            <Switch checked={canUpdateRestaurantImg} onCheckedChange={()=>setCanUpdateRestaurantImg(!canUpdateRestaurantImg)} className="my-auto mr-1" />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded border border-color3'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>member can update Restaurant info</span>
                            <Switch checked={canUpdateRestaurantDetails} onCheckedChange={()=>setCanUpdateRestaurantDetails(!canUpdateRestaurantDetails)} className="my-auto mr-1" />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded border border-color3'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>Manage roles</span>
                        <Switch checked={canManageRoles} onCheckedChange={()=>setCanManageRoles(!canManageRoles)} className="my-auto mr-1" 
                            //  disabled={data.role.adminPower?false:true}
                             />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                                 
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded border border-color3'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>Manage Food items</span>
                        <Switch checked={canManageFoodItemData} onCheckedChange={()=>setCanManageFoodItemData(!canManageFoodItemData)} className="my-auto mr-1" 
                            //  disabled={data.role.adminPower?false:true}
                             />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                                 
                             </p>
                        </div>

                        <div className='p-2 bg-white rounded border border-color3'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>Admin Power</span>
                        <Switch checked={adminPower} onCheckedChange={()=>setAdminPower(!adminPower)} className="my-auto mr-1" 
                             disabled={data.role.adminPower?false:true}
                             />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                                <IoWarning size={22} className='text-color5 inline mr-1'/>
                                This permission give full power to the member. They can do whatever they want, so it is suggested to use it wisely. 
                             </p>
                        </div>


                        <div className='p-2 bg-white rounded border border-color3'>
                            <div className='flex justify-between'>
                            <span className='pl-1 font-semibold'>invite member</span>
                            <Switch checked={canAddMember} onCheckedChange={()=>setCanAddMember(!canAddMember)} className="my-auto mr-1" />
                             </div>
                             <p className='pl-1 h-auto text-justify mt-1'>
                             </p>
                        </div>

                        {/* will be adding other stuff later */}
                        <div className="flex w-full gap-1">
                        <button type='submit' className={`bg-color5 hover:opacity-90 text-white font-bold py-2 px-4 rounded w-full`} >Update Role</button>
                        <button type='button' className={`bg-white text-color5 border border-color5 py-2 px-4 w-full rounded "}`}
                        onClick={()=>onClose()} >Cancel</button>
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

export default EditRolePermissionModal
