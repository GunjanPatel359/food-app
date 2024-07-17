import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { addSeller, sellerLogout } from '../../redux/reducers/seller'
import { backend_url } from '../../server'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import SlideMenuVariant2 from '../../components/slidemenu/SlideMenuVariant2'
import SellerProfileHeader from '../../components/sellerprofile/SellerProfileHeader'
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import SellerInfo from '../../components/sellerprofile/sellerprofilemodals/SellerInfo'

const SellerProfilePage = () => {
const dispatch = useDispatch()
const navigate=useNavigate()

const [select, setSelected] = useState(0)
const [loading,setLoading]=useState(false)

useEffect(() => {
    const userinfo = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${backend_url}/seller/sellerinfo`, {
          withCredentials: true
        })
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
    { icon:<HiOutlineBuildingStorefront size={22} />,text:"Hotel",alert:false }
  ]

  return (
    <>
    {!loading ? (
      <>
      <SellerProfileHeader />
      
      <div className='flex w-full transition-all duration-1000'>
      
        <SlideMenuVariant2 select={select} setSelected={setSelected} menuItemList={menuItemList}/>

        <div className='w-full'>
          {select === 0 && <SellerInfo/>} 
          {/* {select === 1 && <ProfileAddresses/>}  */}
        </div>
      </div>
      {/* <ProfileModalProvider/> */}
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
