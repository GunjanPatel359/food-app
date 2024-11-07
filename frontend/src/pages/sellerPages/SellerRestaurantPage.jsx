import SlideMenu from "../../components/slidemenu/SlideMenu"
import SellerProfileHeader from "../../components/sellerprofile/SellerProfileHeader"
import { useEffect, useMemo, useState } from "react"
import SellerRestaurant from "../../components/sellerhotel/SellerRestaurant"
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md"
import {IoFastFoodOutline} from "react-icons/io5"
// import { MdManageAccounts } from "react-icons/md";
import { MdOutlineTableBar } from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { MdAttachMoney } from "react-icons/md";
import SellerManageRole from "../../components/sellerhotel/SellerManageRole";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, theme_colors } from "../../server";
import SellerHotelModalProvider from "../../provider/SellerHotelModalProvider";
import HotelFoodItems from "../../components/sellerhotel/HotelFoodItems";
import OrderTableManage from "../../components/sellerhotel/OrderTableManage";
import { useDispatch } from "react-redux";
import { addSeller, sellerLogout } from "../../redux/reducers/seller";
import AdditionalSettingsHotel from "../../components/sellerhotel/AdditionalSettingsHotel";
import AdditonalTaxManage from "../../components/sellerhotel/AdditonalTaxManage.jsx"

const SellerRestaurantPage = () => {
    const Themes=useMemo(()=>theme_colors,[])
    const [theme,setTheme]=useState(Themes[0]);

    const params = useParams()
    const {hotelId}=params
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const [loading,setLoading]=useState(false)
    const [select,setSelected]=useState(0)

    const menuItemList=[
        { icon:<BsFillInfoCircleFill size={22} />,text:"Hotel",alert:false },
        { icon:<MdOutlineManageAccounts size={22} />,text:"roles",alert:false },
        { icon:<IoFastFoodOutline size={22} />,text:"foodItem",alert:false },
        { icon:<MdOutlineTableBar size={22} />,text:"OrderTables",alert:false },
        { icon:<MdAttachMoney size={22} />,text:"Payment",alert:false },
        { icon:<LuSettings2 size={22} />,text:"preferences",alert:false }        
    ]

    useEffect(()=>{
        const initiatePage=async()=>{
            try {
                const res=await axios.get(`${backend_url}/seller/gethoteldata/${hotelId}`,{withCredentials:true})
                console.log(res)
                if(res.data.hotel.colors){
                  if(Themes.includes(res.data.hotel.colors)){
                    setTheme(res.data.hotel.colors)
                  }
                }
            } catch (error) {
                toast.error("Somthing went wrong")
            }
        }
        initiatePage()
    },[Themes, hotelId])

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

  return (
    <div className={`theme-${theme}`}>
        <SellerProfileHeader />
        <div className="flex">
            <SlideMenu menuItemList={menuItemList} select={select} setSelected={setSelected} />
            <div className="w-full">
            {select === 0 && <SellerRestaurant />} 
            {select === 1 && <SellerManageRole />} 
            {select === 2 && <HotelFoodItems />}
            {select === 3 && <OrderTableManage />}
            {select === 4 && <AdditonalTaxManage/>}
            {select === 5 && <AdditionalSettingsHotel setTheme={setTheme} theme={theme} />}
            </div>
        </div>
        <SellerHotelModalProvider />
    </div>
  )
}

export default SellerRestaurantPage
