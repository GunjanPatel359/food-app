import { useEffect, useRef, useState } from 'react'
import { useModal } from '../customhooks/zusthook'
import CreateRoleModal from '../components/sellerhotel/sellerhotelmodals/CreateRoleModal'
import InviteMemberModal from '../components/sellerhotel/sellerhotelmodals/InviteMemberModal'
import EditRolePermissionModal from '../components/sellerhotel/sellerhotelmodals/EditRolePermissionModal'
import CreateFoodCategoryModal from '../components/sellerhotel/sellerhotelmodals/CreateFoodCategoryModal'
import CreateFoodItemModal from '../components/sellerhotel/sellerhotelmodals/CreateFoodItemModal'
import CreateTableModal from '../components/sellerhotel/sellerhotelmodals/CreateTableModal'
import DeleteRoleModal from '../components/sellerhotel/sellerhotelmodals/DeleteRoleModal'

const SellerHotelModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { isOpen,onClose } = useModal()
  const divRef=useRef()

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return null
  }

  const handleClose=(e)=>{
    if(e.target === divRef.current){
      onClose()
    }
  }
  return (
    <>
      <div
        className={`fixed inset-0 width-[100%] height-[100%] flex justify-center items-center transition-all duration-500 ease-ease-in shadow-2xl ${isOpen
            ? 'backdrop-brightness-50 opacity-100 visible'
            : 'backdrop-brightness-100 opacity-0 invisible'
        }`}
        onClick={handleClose}
        ref={divRef}
      >
        {isOpen && (
          <div className='transition-all duration-500 ease-ease-in w-auto max-h-[600px] overflow-y-scroll flex flex-col bg-white border-2 border-white shadow-2xl rounded-xl text-rose-500'>  
          <CreateRoleModal />
          <InviteMemberModal />
          <EditRolePermissionModal />
          <CreateFoodCategoryModal />
          <CreateFoodItemModal />
          <CreateTableModal />
          <DeleteRoleModal />
          </div>
        )}
      </div>
    </>
  )
}

export default SellerHotelModalProvider
