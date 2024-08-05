/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios'
import { toast } from 'react-toastify'
import { backend_url } from '../../server'

import { useModal } from '../../customhooks/zusthook'

import RoleItem from './RoleItem'

import { Plus } from 'lucide-react'

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

const SellerManageRole = () => {
  const { onOpen,reloadCmd } = useModal()
  const params = useParams()
  const { hotelId } = params
  const [member, setMember] = useState('')
  const [ownerId,setOwnerId]=useState('')
  const [role, setRole] = useState('')
  const [roles, setRoles] = useState('')
  const [oldRole, setOldRole] = useState('')
  const [reloadcomponent,setReloadComponent]=useState(1);
  // const [loading,setLoading]=useState(false)
  
  useEffect(() => {
    const initiatePage = async () => {
      try {
        const hoteldata = await axios.get(
          `${backend_url}/seller/gethoteldata/${hotelId}`,
          { withCredentials: true }
        )
        if (hoteldata.data.success) {
          setOwnerId(hoteldata.data.hotel.sellerId)
          setMember(hoteldata.data.member)
          setRole(hoteldata.data.role)
          let sortingRoles = hoteldata.data.hotel.roleIds
          sortingRoles.sort((a, b) => a.order - b.order)
          setRoles(sortingRoles)
          setOldRole(sortingRoles)
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }

    initiatePage()

  }, [reloadCmd,hotelId,reloadcomponent])

  function findObjectIndexById (data, id) {
    return data.findIndex(obj => obj._id === id)
  }
  function findObject (data, id) {
    return data.find(obj => obj._id === id)
  }

  function handleDragEnd (event) {
    const { active, over } = event
    if (!role.canManageRoles && !role.adminPower) {
      return toast.warning('You don not have permission to reorder the roles')
    }
    if (
      findObject(roles, active.id).order <= role.order ||
      findObject(roles, over.id).order <= role.order
    ) {
      return toast.warning('cannot change order of higher roles')
    }
    if (active.id != over.id) {
      setRoles(roles => {
        const oldIndex = findObjectIndexById(roles, active.id)
        const newIndex = findObjectIndexById(roles, over.id)
        return arrayMove(roles, oldIndex, newIndex)
      })
    }
  }

  const changeRoleOrder = async () => {
    try {
      const response = await axios.post(
        `${backend_url}/role/reorder-roles/${hotelId}`,
        { roles },
        { withCredentials: true }
      )
      if (response.data.success) {
        setReloadComponent(Date.now())
        toast.success(response.data.message)
      }
    } catch (error) {
      return toast.error(error.message)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    })
  )
  return (
    <div className='m-5'>
      {member && (
        <div className='m-5 mt-8'>
          <div className='text-rose-500 font-semibold text-2xl mb-4'>Roles</div>

          {(role.adminPower || role.canManageRoles) &&
          <span
            className='bg-rose-50 p-2 py-2 transition-all text-rose-500 hover:opacity-80 cursor-pointer border border-rose-500 border-dashed rounded-full flex flex-row max-w-fit pr-5'
            onClick={() => onOpen('create-roles', { role })}
          >
            <span className='flex flex-row border border-rose-500 rounded-full mr-2 ml-1 border-dashed'>
              <Plus className='inline' />
            </span>{' '}
            Create Role
          </span>}

          <div className='bg-rose-50 border border-rose-500 p-4 rounded mt-4 border-dashed text-lg flex flex-col gap-y-2'>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <SortableContext
                items={roles}
                strategy={verticalListSortingStrategy}
              >
                {roles.map((item, i) => {
                  return (
                    <RoleItem
                      item={item}
                      key={item.order}
                      index={i + 1}
                      role={role}
                      ownerId={ownerId}
                    />
                  )
                })}
              </SortableContext>
            </DndContext>
          </div>
          <button
            className={`transition-all bg-rose-500 text-white mt-2 p-3 rounded font-semibold ${
              roles == oldRole ? 'opacity-80' : 'hover:opacity-95'
            }`}
            disabled={roles == oldRole ? true : false}
            onClick={() => changeRoleOrder()}
          >
            Update order
          </button>
        </div>
      )}
    </div>
  )
}

export default SellerManageRole
