/* eslint-disable react/prop-types */
import { FaUserShield } from "react-icons/fa6";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";

import { useSortable } from "@dnd-kit/sortable";
import { useModal } from "../../customhooks/zusthook";
import {CSS} from "@dnd-kit/utilities"

const RoleItem = ({item,role,ownerId}) => {
    const {onOpen}=useModal()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    }=useSortable({id:item._id})

    const style={
        transform:CSS.Transform.toString(transform),
        transition
    }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-color5 p-3 pl-4 rounded text-white shadow-md">
        <div className=" flex justify-between">
            <div className="flex">{item.roleName}{item.roleName=="Owner"?<FaUserShield className=" ml-2 cursor-pointer m-auto" size={22}/>:<><IoPeople className="ml-2 inline m-auto" size={26} onClick={()=>onOpen("manage-role-member",{manageMemberRole:item})} /><sup className="m-auto">{item.memberList.length}</sup></>}</div>
                <div className="flex gap-x-3 pr-4">
                    {ManageButtons(item,role,onOpen,ownerId)}
                    {/* {item.roleName!="Owner" &&(
                        <>
                        {(role.canManageRoles || role.adminPower || role.canAddMember)?<FaUserPlus className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('invite-member',{item})}/>:<></>}
                        {(role.canManageRoles || role.adminPower)?<BiSolidEdit className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('Edit-role-Permission')}/>:<></>}
                        {role.adminPower || role.adminPower?<MdDelete className="cursor-pointer m-auto" size={22} />:<></>}
                        </>
                    )} */}
                </div>
            </div>
        </div>
  )  

}

function ManageButtons(item,role,onOpen,ownerId){

    if(item.roleName=="Owner" || item.order<=role.order){
        return <></>
    }

    if(role.adminPower){
        return (<>
        {<FaUserPlus className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('invite-member',{inviteRole:item,role,ownerId})}/>}
        {<BiSolidEdit className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('Edit-role-Permission',{editrole:item,role})}/>}
        {<MdDelete className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('Delete-role',{deleterole:item,rolefordelete:role})} />}
        </>)
    }

    // if(!role.adminPower && role.canManageRoles && item.order<role.order ){
    //    return (
    //     <>
    //     </>
    //    )
    // }

    if(!role.adminPower && role.canManageRoles){
        return(<>
        {role.canAddMember&&(<FaUserPlus className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('invite-member',{inviteRole:item,role,ownerId})}/>)}
        {<BiSolidEdit className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('Edit-role-Permission',{editrole:item,role})}/>}
        {<MdDelete className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('Delete-role',{deleterole:item,rolefordelete:role})} />}
        </>)
    }

    return <></>
}

export default RoleItem
