import { useDispatch } from 'react-redux';
import { backend_url, theme_colors } from '../../server';
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import { addUser } from '../../redux/reducers/user';
import { useParams } from 'react-router-dom';
import ProfileHeader from '../../components/profile/ProfileHeader';
import FoodInfo from '../../components/restaurant/FoodInfo';

const FoodItemPage = () => {
    const dispatch=useDispatch()
    const params=useParams()
    const {foodItemId}=params
    const Themes = useMemo(() => theme_colors, [])
    const [theme, setTheme] = useState(Themes[0]);
    const [user,setUser]=useState('')
    const [foodItem,setFoodItem]=useState('')

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
              if (res.data.user.colors) {
                setTheme(res.data.user.colors)
            }
        }
        userinfo()
    },[dispatch])

    useEffect(()=>{
        const foodinfo = async()=>{
            try {
                const res=await axios.get(`${backend_url}/fooditem/${foodItemId}/get-food-item`,{withCredentials:true})
                if(res.data.success){
                    setFoodItem(res.data.fooditem)
                }
            } catch (error) {
                console.log(error)
            }
        }
        if(foodItemId){
            foodinfo()
        }
    },[foodItemId])

    if(!foodItemId){
        return <div>Food Item not found</div>
    }

    if(!foodItem){
        return <div>Food Item not found</div>
    }

    console.log(foodItem)

  return (
    <div>
      <div className={`theme-${theme}`}>
        <ProfileHeader user={user} />
        <FoodInfo fooditem={foodItem}/>
      </div>
    </div>
  )
}

export default FoodItemPage
