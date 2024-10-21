import { useEffect, useRef, useState } from 'react'
import { useModal } from '../customhooks/zusthook'
import CreateRoleModal from '../components/sellerhotel/sellerhotelmodals/CreateRoleModal'
import InviteMemberModal from '../components/sellerhotel/sellerhotelmodals/InviteMemberModal'
import EditRolePermissionModal from '../components/sellerhotel/sellerhotelmodals/EditRolePermissionModal'
import CreateFoodCategoryModal from '../components/sellerhotel/sellerhotelmodals/CreateFoodCategoryModal'
import CreateFoodItemModal from '../components/sellerhotel/sellerhotelmodals/CreateFoodItemModal'
import CreateTableModal from '../components/sellerhotel/sellerhotelmodals/CreateTableModal'
import DeleteRoleModal from '../components/sellerhotel/sellerhotelmodals/DeleteRoleModal'
import ManageRoleMemberModal from '../components/sellerhotel/sellerhotelmodals/ManageRoleMemberModal'
import EditFoodItemModal from '../components/sellerhotel/sellerhotelmodals/EditFoodItemModal'
import DeleteFoodItemModal from '../components/sellerhotel/sellerhotelmodals/DeleteFoodItemModal'
import EditCategoryModal from '../components/sellerhotel/sellerhotelmodals/EditCategoryModal'
import DeleteFoodCategory from '../components/sellerhotel/sellerhotelmodals/DeleteFoodCategory'
import EditOrderTableInfoModal from '../components/sellerhotel/sellerhotelmodals/EditOrderTableInfoModal'
import DeleteOrderTableModal from '../components/sellerhotel/sellerhotelmodals/DeleteOrderTableModal'

const SellerHotelModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { isOpen,onClose } = useModal()
  const divRef=useRef()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';  
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
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
          <div className='transition-all duration-500 max-h-[600px] overflow-y-scroll flex flex-col bg-white border-2 border-white shadow-2xl rounded-xl text-color5'>  
          <CreateRoleModal />
          <InviteMemberModal />
          <EditRolePermissionModal />
          <CreateFoodCategoryModal />
          <EditCategoryModal />
          <CreateFoodItemModal />
          <DeleteRoleModal />
          <ManageRoleMemberModal />
          <EditFoodItemModal />
          <DeleteFoodItemModal/>
          <DeleteFoodCategory />
          <CreateTableModal />
          <EditOrderTableInfoModal />
          <DeleteOrderTableModal />
          </div>
        )}
      </div>
    </>
  )
}

export default SellerHotelModalProvider
