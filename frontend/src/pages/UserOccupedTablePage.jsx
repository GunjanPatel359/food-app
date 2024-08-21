import { addUser } from "../redux/reducers/user";
import ProfileHeader from "../components/profile/ProfileHeader";
import { backend_url } from "../server";
import axios from "axios";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserOccupedTablePage = () => {
    const params=useParams()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const {hotelId,orderTabelId,randomString,memberId}=params
    const [user,setUser]=useState('')

    useEffect(()=>{
        // const initiatePage=async()=>{
        //     try {
        //         const response=await axios.get(`${backend_url}/order-table/${hotelId}/qrcode/${orderTabelId}/${randomString}/${memberId}`,{withCredentials:true})
        //         console.log(response)
        //         if(response.data.success){
        //             console.log(response.data)
        //         }
        //     } catch (error) {
        //         toast.error(error.message)
        //     }
        // }
        if(hotelId && orderTabelId && randomString){
            console.log(hotelId,orderTabelId,randomString)
            const myObject = { hotelId: hotelId, orderTabelId: orderTabelId,randomString:randomString,memberId:memberId };
             const objectString = JSON.stringify(myObject);
            sessionStorage.setItem("orderTable",objectString);
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
                toast.error(e)
            }    
        }
        userinfo()
    },[dispatch])

  return (
    <div>
      <ProfileHeader user={user} />
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
      <div>
        <h1>Occupied Table</h1>
        </div>
      </>)}
    </div>
  )
}

export default UserOccupedTablePage
