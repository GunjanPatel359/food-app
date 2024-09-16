import { useEffect, useState } from "react"
import { useModal } from "../../../customhooks/zusthook"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"
import { backend_url, img_url } from "../../../server"
import RatingShow from "../../customui/RatingShow"
import RatingBar from "../../../components/customui/RatingBar"
import { FaStar } from "react-icons/fa"

const UserFoodDescription = () => {
    const params = useParams()
    const { hotelId } = params
    const { isOpen, type, data, onClose, reloadCom } = useModal()
    const isModelOpen = isOpen && type === 'User-food-item'

    const [foodinfo, setFoodInfo] = useState('')

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await axios.get(`${backend_url}/fooditem/getfooditem/table-user/${data.UserItemInfo}`, { withCredentials: true })
                console.log(res)
                if (res.data.success) {
                    setFoodInfo(res.data.fooditem)
                }
            } catch (error) {
                toast.error(error.response.data.message)
            }
        }
        if (data && data.UserItemInfo) {
            initiatePage()
        }
    }, [data, data.UserItemInto])

    if (!isModelOpen) {
        return null
    }

    return (
        <div>
            {isModelOpen && (
                <div>
                    {foodinfo && (
                        <div className="p-4 flex">
                            <div>
                                <img src={`${img_url}/${foodinfo.imageUrl}`} className="w-[350px]" />
                            </div>
                            <div className="m-1.5"></div>
                            <div className="w-[300px]">
                                <div className="font-semibold text-color5 text-2xl">{foodinfo.name}</div>
                                <div className="font-semibold text-color5 text-md">{foodinfo.smallDescription}</div>
                                <div className="font-semibold text-color5">{foodinfo.description}</div>
                                {/* <div className="font-semibold text-color5 flex"><RatingShow ratingCount={3.3} maxRatingCount={5} size={18} /> <span className="my-auto ml-1">3/5</span></div> */}
                                <div className="flex mb-8 mt-1">
                                    <div className="w-[35%] flex flex-col items-center">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-2xl text-color5 m-auto">
                                                3.4
                                            </div>
                                            <RatingShow ratingCount={3.4} maxRatingCount={5} size={18} />
                                            <div className="mt-1 flex"><span className="bg-color5 border-1 border-color5 p-1 px-3 rounded-full text-xs text-white mx-auto">34882</span></div>
                                        </div>
                                    </div>
                                    <div className=" w-[2px] bg-color4 flex flex-col">
                                    </div>
                                    <div className="w-[65%] pl-2 text-sm">
                                        <div className="flex text-color5">5<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={900} totalCount={2000} /></div></div>
                                        <div className="flex text-color5">4<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={400} totalCount={2000} /></div></div>
                                        <div className="flex text-color5">3<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={200} totalCount={2000} /></div></div>
                                        <div className="flex text-color5">2<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={100} totalCount={2000} /></div></div>
                                        <div className="flex text-color5">1<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar height="10px" count={400} totalCount={2000} /></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default UserFoodDescription
