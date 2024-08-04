import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { addSeller, sellerLogout } from '../../redux/reducers/seller'

import axios from 'axios'
import { toast } from 'react-toastify'
import { backend_url } from '../../server'

import { User } from 'lucide-react'
import { BiPurchaseTagAlt } from "react-icons/bi";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";

// import SlideMenuVariant2 from '../../components/slidemenu/SlideMenuVariant2'
import SellerInfo from '../../components/sellerprofile/SellerInfo'
import SlideMenu from '../../components/slidemenu/SlideMenu'
import SellerProfileHeader from '../../components/sellerprofile/SellerProfileHeader'
import SellerResturantInfo from '../../components/sellerprofile/SellerResturantInfo'
import SellerProfileModalProvider from '../../provider/SellerProfileModalProvider'
import SellerSubscription from '../../components/sellerprofile/SellerSubscription'

const SellerProfilePage = () => {
const dispatch = useDispatch()
const navigate=useNavigate()

const [select, setSelected] = useState(0)
const [loading,setLoading]=useState(true)

useEffect(() => {
    const userinfo = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${backend_url}/seller/sellerinfo`, {
          withCredentials: true
        })
        if(!res.data.seller){
          dispatch(sellerLogout())
          navigate('/seller/login')
        }
        dispatch(addSeller(res.data.seller))
      } catch (err) {
        toast.error(err)
        if(err.response.data.success===false){
          dispatch(sellerLogout())
          navigate("/seller/login")
        }
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    userinfo()
  }, [dispatch,navigate])

  const menuItemList=[
    { icon:<User size={22}/>,text:"Profile", alert:false},
    { icon:<HiOutlineBuildingStorefront size={22} />,text:"Hotel",alert:false },
    { icon:<BiPurchaseTagAlt size={22}/>,text:"subscription",alert:false},
  ]

  return (
    <>
    {!loading ? (
      <>
      <SellerProfileHeader />
      
      <div className='flex w-full transition-all duration-1000'>
      
        <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList}/>

        <div className='w-full'>
          {select === 0 && <SellerInfo/>} 
          {select === 1 && <SellerResturantInfo/>}
          {select === 2 && <SellerSubscription/>}
          {/* {select === 1 && <ProfileAddresses/>}  */}
        </div>
      </div>
      <SellerProfileModalProvider/>
    </>
    ):("") }
    </>
  )
}

export default SellerProfilePage



// import ProfileHeader from '../../components/profile/ProfileHeader'
// import SlideMenu from '../../components/slidemenu/SlideMenu'
// import ProfileInfo from '../../components/profile/ProfileInfo'
// import { User } from 'lucide-react'
// import { FaRegAddressBook } from 'react-icons/fa'
// import ProfileAddresses from '../../components/profile/ProfileAddresses'
// import { ProfileModalProvider } from '../../provider/ProfileModalProvider'
