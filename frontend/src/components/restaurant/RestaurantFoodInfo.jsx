import { backend_url } from "../../server";
import axios from "axios";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryOpen from "./CategoryOpen";

const RestaurantFoodInfo = () => {
    const params=useParams()
    const {hotelId}=params
    const [foodInfo, setFoodInfo] = useState([]);

    useEffect(()=>{
        const initialCom=async()=>{
            try {
                const response=await axios.get(`${backend_url}/fooditem/getallfood/${hotelId}`)
                console.log(response)
                if(response.data.success){
                    setFoodInfo(response.data.food)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        initialCom()
    },[hotelId])

    return (
        <div>
            <div className="mt-2 w-full">
                {/* <div className="">hello</div> */}
                <div className="m-2 lg:w-[70%] mx-auto">
                    {foodInfo && (
                        foodInfo.map((item,index)=>{
                            return (
                            <>
                            <CategoryOpen item={item} key={index}/>
                            </>)
                        })
                    )}
                </div>
            </div>
        </div>
    )
}

export default RestaurantFoodInfo
