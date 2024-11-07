import { addUser } from "../redux/reducers/user";
import ProfileHeader from "../components/profile/ProfileHeader";
import { backend_url, theme_colors } from "../server";
import axios from "axios";
import { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import RestaurantInfo from "../components/restaurant/RestaurantInfo";

const UserOccupingTablePage = () => {
    const params=useParams()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {hotelId,orderTabelId,randomString,memberId}=params

    const Themes=useMemo(()=>theme_colors,[])
    const [theme,setTheme]=useState(Themes[0]);

    const [user,setUser]=useState('')
    const [hotel,setHotel]=useState('')

    const initiatePage=async()=>{
        try {
            const response=await axios.get(`${backend_url}/order-table/${hotelId}/qrcode/${orderTabelId}/${randomString}/${memberId}`,{withCredentials:true})
            console.log(response)
            if(response.data.success){
                toast.success(response.data.message)
                navigate(`/user/${hotelId}/${orderTabelId}/user-table`)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    useEffect(()=>{
        const hotelInfo=async()=>{
            try {
                const res=await axios.get(`${backend_url}/restaurant/${hotelId}`)
                console.log(res.data)
                if(res.data.success){
                    setHotel(res.data.hotel)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        if(hotelId && orderTabelId && randomString){
            console.log(hotelId,orderTabelId,randomString)
            const myObject = { hotelId: hotelId, orderTabelId: orderTabelId,randomString:randomString,memberId:memberId };
             const objectString = JSON.stringify(myObject);
            sessionStorage.setItem("orderTable",objectString);
        }
        if(hotelId){
            hotelInfo()
        }
    },[hotelId, memberId, navigate, orderTabelId, randomString, user])

    if(!hotelId && !orderTabelId && !randomString){
        <div>Invalid QR Code</div>
    }

    useEffect(()=>{
        const userinfo = async()=>{
            try{
                const res = await axios.get(`${backend_url}/user/userinfo`, {
                    withCredentials: true
                })
                if(res.data.success){
                    setUser(res.data.user)
                    addUser(res.data.user)
                }
            }catch(e){
                toast.error("please login to continue")
            }    
        }
        userinfo()
    },[dispatch])

  return (
    <div className={`theme-${theme}`}>
      <ProfileHeader user={user} />
      {/* <RestaurantInfo hotel={hotel} /> */}
      {!user?(
        <>
        <div className="flex flex-col w-full m-auto text-rose-500 mt-10 gap-2">
            <div className="m-auto">
            Please login to continue
            </div>
            <div className="m-auto">
                <button className="m-auto bg-rose-500 text-white p-2 rounded hover:opacity-90" onClick={()=>navigate('/login')}>Click here to Login</button>
            </div>
            <div className="m-auto">
                {`If you don't have one`}
                </div>
            <div className="m-auto">
                <button className="m-auto bg-rose-500 text-white p-2 rounded" onClick={()=>navigate('/sign-up')}>Click here to Signup</button>
            </div>
        </div>
        </>
      ):(<>
      <div className="">
            <div className="flex mt-10">
                <button className="bg-color4 p-2 text-white rounded-full px-4 m-auto" onClick={initiatePage}>Click here to confirm your seat</button>
            </div>
        </div>
      </>)}
    </div>
  )
}

export default UserOccupingTablePage
