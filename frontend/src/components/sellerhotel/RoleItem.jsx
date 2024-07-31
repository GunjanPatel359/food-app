/* eslint-disable react/prop-types */
import { FaUserShield } from "react-icons/fa6";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";

import { useSortable } from "@dnd-kit/sortable";
// import { useDraggable } from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities"
import { useModal } from "../../customhooks/zusthook";

const RoleItem = ({item,role}) => {
    const {onOpen}=useModal()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    }=useSortable({id:item._id})

    // const {
    //     transform,
    //     transition
    // }=useDraggable({id:item._id})

    const style={
        transition,
        transform:CSS.Transform.toString(transform)
    }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-rose-500 p-3 pl-4 rounded text-white shadow-lg shadow-rose-200">
        <div className=" flex justify-between">
            <div className="flex">{item.roleName}{item.roleName=="Owner"?<FaUserShield className=" ml-2 cursor-pointer m-auto" size={22}/>:<></>}</div>
                <div className="flex gap-x-3 pr-4">
                    {ManageButtons(item,role,onOpen)}
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

function ManageButtons(item,role,onOpen){

    if(item.roleName!="Owner" && role.adminPower){
        return (<>
        {<FaUserPlus className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('invite-member',{item})}/>}
        {<BiSolidEdit className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('Edit-role-Permission',{editrole:item,role})}/>}
        {<MdDelete className="cursor-pointer m-auto" size={22} />}
        </>)
    }

    if(item.roleName!="Owner" && !role.adminPower && role.canManageRoles && item.order<role.order ){
       return (
        <>
        </>
       )
    }

    if(item.roleName!="Owner" && !role.adminPower && role.canManageRoles && item.order>role.order ){
        return(<>
        {<FaUserPlus className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('invite-member',{item})}/>}
        {<BiSolidEdit className="cursor-pointer m-auto" size={22} onClick={()=>onOpen('Edit-role-Permission',{editrole:item,role})}/>}
        {<MdDelete className="cursor-pointer m-auto" size={22} />}
        </>)
    }

    return <></>
}

export default RoleItem
