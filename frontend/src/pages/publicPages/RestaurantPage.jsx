import { addUser } from "../../redux/reducers/user"
import ProfileHeader from "../../components/profile/ProfileHeader"
import { backend_url } from "../../server"
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import RestaurantInfo from "../../components/restaurant/RestaurantInfo"
import RestaurantFoodInfo from "../../components/restaurant/RestaurantFoodInfo.jsx"

const RestaurantPage = () => {
    const params=useParams()
    const {hotelId}=params
    const dispatch=useDispatch()
    const [hotel,setHotel]=useState('')
    const [user,setUser]=useState('')

    useEffect(()=>{
        const userinfo = async()=>{
            const res = await axios.get(`${backend_url}/user/userinfo`, {
                withCredentials: true
              })
              if(!res.data.success){
                setUser('')
              }
              if(res.data.success){
                  dispatch(addUser(res.data.user))
                  setUser(res.data.user)
              }
        }
        userinfo()
    },[dispatch])

    useEffect(()=>{
        const intiatePage=async()=>{
            try {
                const response=await axios.get(`${backend_url}/restaurant/${hotelId}`)
                console.log(response)
                if(response.data.success){
                    setHotel(response.data.hotel)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        if(hotelId){
            intiatePage()
        }
    },[hotelId])

    if(!hotelId){
        return <div>Hotel not found</div>
    }
    if(!hotel){
        return <div>Hotel not found</div>
    }
  return (
    <div>
        <ProfileHeader user={user} />
        <RestaurantInfo hotel={hotel} />
        <RestaurantFoodInfo />
    </div>
  )
}

export default RestaurantPage
