import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { addSeller, sellerLogout } from '../../redux/reducers/seller'

import axios from 'axios'
import { toast } from 'react-toastify'
import { backend_url, theme_colors } from '../../server'

import { User } from 'lucide-react'
import { BiPurchaseTagAlt } from "react-icons/bi";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";

import SellerInfo from '../../components/sellerprofile/SellerInfo'
import SlideMenu from '../../components/slidemenu/SlideMenu'
import SellerProfileHeader from '../../components/sellerprofile/SellerProfileHeader'
import SellerResturantInfo from '../../components/sellerprofile/SellerResturantInfo'
import SellerProfileModalProvider from '../../provider/SellerProfileModalProvider'
import SellerSubscription from '../../components/sellerprofile/SellerSubscription'
import AdditionalSettingsSeller from "../../components/sellerprofile/AdditionalSettingsSeller.jsx"
import { LuSettings2 } from 'react-icons/lu'
import { setCookie } from '../../lib/setCookie'

const SellerProfilePage = () => {
  const Themes=useMemo(()=>theme_colors,[])
  const [theme,setTheme]=useState(Themes[0]);
const dispatch = useDispatch()
const navigate=useNavigate()
const [select, setSelected] = useState(0)
const [loading,setLoading]=useState(true)

useEffect(() => {
    const sellerinfo = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${backend_url}/seller/sellerinfo`, {
          withCredentials: true
        })
        if(!res.data.seller){
          dispatch(sellerLogout())
          setCookie("seller_token",res.data.seller_token,1,true)
          navigate('/seller/login')
        }
        if(res.data.seller.colors){
          setTheme(res.data.seller.colors)
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
    sellerinfo()
  }, [dispatch,navigate])

  const menuItemList=[
    { icon:<User size={22}/>,text:"Profile", alert:false},
    { icon:<HiOutlineBuildingStorefront size={22} />,text:"Hotel",alert:false },
    { icon:<BiPurchaseTagAlt size={22}/>,text:"subscription",alert:false},
    { icon:<LuSettings2 size={22} />,text:"settings",alert:false } 
  ]

  console.log(theme)


  return (
    <div className={`theme-${theme}`}>
    {!loading ? (
      <>
      <div>
      <SellerProfileHeader />
      
      <div className='flex w-full transition-all duration-1000'>
      
        <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList}/>

        <div className='w-full'>
          {select === 0 && <SellerInfo/>} 
          {select === 1 && <SellerResturantInfo/>}
          {select === 2 && <SellerSubscription/>}
          {select === 3 && <AdditionalSettingsSeller setTheme={setTheme} theme={theme} />}
        </div>
      </div>
      <SellerProfileModalProvider/>
      </div>
    </>
    ):("") }
    </div>
  )
}

export default SellerProfilePage