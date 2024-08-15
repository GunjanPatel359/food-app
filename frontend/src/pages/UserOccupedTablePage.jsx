import { backend_url } from "../server";
import axios from "axios";
import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserOccupedTablePage = () => {
    const params=useParams()
    const navigate=useNavigate()
    const {hotelId,orderTabelId,randomString,memberId}=params
    const {user}=useSelector((state)=>state.user)
    useEffect(()=>{
        const initiatePage=async()=>{
            try {
                const response=await axios.get(`${backend_url}/order-table/${hotelId}/qrcode/${orderTabelId}/${randomString}/${memberId}`,{withCredentials:true})
                console.log(response)
                if(response.data.success){
                    console.log(response.data)
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
            if(!user){
                return navigate("/login")
            }
            initiatePage()
        }
    },[hotelId, memberId, navigate, orderTabelId, randomString, user])

  return (
    <div>
      hello
    </div>
  )
}

export default UserOccupedTablePage
