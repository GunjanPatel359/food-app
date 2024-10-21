import { useEffect, useState } from "react"
import { useModal } from "../../customhooks/zusthook"
import { Plus } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import { backend_url } from "../../server"
import { useParams } from "react-router-dom"
import CategoryBox from "./CategoryBox"

const HotelFoodItems = () => {
    const param = useParams();
    const { hotelId } = param
    const { onOpen, reloadCmd } = useModal()
    const [category, setCategory] = useState([])
    const [role, setRole] = useState('')

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const roleinfo = await axios.get(`${backend_url}/role/memberrole-info/${hotelId}`, { withCredentials: true })
                if (roleinfo.data.success) {
                    setRole(roleinfo.data.role)
                }
                const response = await axios.get(`${backend_url}/restaurant/${hotelId}/food-items-with-categories`, { withCredentials: true })
                if (response.data.success) {
                    setCategory(response.data.category)
                }
                console.log(response)
            } catch (error) {
                toast.error(error.message)
            }
        }
        initiatePage()
    }, [reloadCmd, hotelId])
    return (
        <div className="m-5">
            {
                <div className="m-5 mt-8">
                    <div className="text-color5 font-semibold text-2xl mb-4">Food Items</div>
                    <div className="flex gap-2">
                        {(role.adminPower || role?.canManageFoodItemData) && <span className="bg-color0 p-2 py-2 transition-all text-color5 hover:opacity-80 cursor-pointer border border-color5 border-dashed rounded-full flex flex-row max-w-fit pr-5" onClick={() => onOpen("create-food-category")}>
                            <span className="flex flex-row border border-color5 rounded-full mr-2 ml-1 border-dashed"><Plus className="inline" /></span> Create Category
                        </span>
                        }
                    </div>

                    {/* <div className="bg-color0 border border-color5 p-4 rounded mt-4 border-dashed text-lg flex flex-col gap-y-2"></div> */}
                    {category.map((item, i) => {
                            return (
                                <CategoryBox key={i} item={item} role={role} />
                            )
                        })}
                </div>
            }
        </div>
    )
}

export default HotelFoodItems
