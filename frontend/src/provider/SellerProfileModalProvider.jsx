import { useEffect, useRef, useState } from 'react'
import { useModal } from '../customhooks/zusthook'
import SellerDeleteRestaurantModal from '../components/sellerprofile/sellerprofilemodals/SellerDeleteRestaurantModal'
import SellerAddResturantModal from '../components/sellerprofile/sellerprofilemodals/SellerAddResturantModal'
import SellerBuyingSubscriptionModal from '../components/sellerprofile/sellerprofilemodals/SellerBuyingSubscriptionModal'

const SellerProfileModalProvider = () => {
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
          <div className='transition-all duration-500 ease-ease-in w-auto max-h-[600px] overflow-y-scroll flex flex-col bg-white border-2 border-color5 shadow-2xl rounded-xl text-color5'>  
          <SellerAddResturantModal/>
          <SellerDeleteRestaurantModal/>
          <SellerBuyingSubscriptionModal />
          </div>
        )}
      </div>
    </>
  )
}

export default SellerProfileModalProvider
