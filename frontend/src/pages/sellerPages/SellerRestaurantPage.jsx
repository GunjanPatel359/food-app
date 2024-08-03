import SlideMenu from "../../components/slidemenu/SlideMenu"
import SellerProfileHeader from "../../components/sellerprofile/SellerProfileHeader"
import { useEffect, useState } from "react"
import SellerRestaurant from "../../components/sellerhotel/SellerRestaurant"
import { BsFillInfoCircleFill } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md"
import {IoFastFoodOutline} from "react-icons/io5"
// import { MdManageAccounts } from "react-icons/md";
import { MdOutlineTableBar } from "react-icons/md";
import SellerManageRole from "../../components/sellerhotel/SellerManageRole";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url } from "../../server";
import SellerHotelModalProvider from "../../provider/SellerHotelModalProvider";
import HotelFoodItems from "../../components/sellerhotel/HotelFoodItems";


const SellerRestaurantPage = () => {
    const params = useParams()
    const {hotelId}=params

    const [select,setSelected]=useState(0)
    const menuItemList=[
        { icon:<BsFillInfoCircleFill size={22} />,text:"Hotel",alert:false },
        { icon:<MdOutlineManageAccounts size={22} />,text:"roles",alert:false },
        { icon:<IoFastFoodOutline size={22} />,text:"foodItem",alert:false },
        { icon:<MdOutlineTableBar size={22} />,text:"foodItem",alert:false },
    ]
    useEffect(()=>{
        const initiatePage=async()=>{
            try {
                const response=await axios.get(`${backend_url}/seller/gethoteldata/${hotelId}`,{withCredentials:true})
                console.log(response)
            } catch (error) {
                toast.error("Somthing went wrong")
            }
        }
        initiatePage()
    },[])
  return (
    <div>
        <SellerProfileHeader />
        <div className="flex">
            <SlideMenu menuItemList={menuItemList} select={select} setSelected={setSelected} />
            <div className="w-full">
            {select === 0 && <SellerRestaurant/>} 
            {select === 1 && <SellerManageRole/>} 
            {select === 2 && <HotelFoodItems />}
            {select === 3 && <HotelFoodItems />}
            </div>
        </div>
        <SellerHotelModalProvider />
    </div>
  )
}

export default SellerRestaurantPage
