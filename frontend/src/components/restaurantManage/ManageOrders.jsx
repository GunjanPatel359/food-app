/* eslint-disable react/prop-types */
import { backend_url, img_url } from "../../server"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { IoIosArrowForward } from "react-icons/io";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select"

const ManageOrders = () => {
    const { hotelId } = useParams()
    const [table, setTable] = useState([])
    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await axios.get(`${backend_url}/order-table/${hotelId}/get-all-tables-order`, { withCredentials: true })
                if (res.data.success) {
                    const filt = res.data.table
                    const filterd = filt.filter((item) => item.status != "Available")
                    console.log(filterd)
                    setTable(filterd)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        initiatePage()
    }, [hotelId])
    return (
        <div className="m-2">
            {
                table.length > 0 && table.map((item, i) => {
                    return (
                        <TableItems key={i} item={item} />

                    )
                })
            }
        </div>
    )
}

const TableItems = ({ item }) => {
    const [open, setOpen] = useState(true)
    return (
        <>
            <div className="p-3 border border-rose-500 rounded w-[500px] shadow">
                <div className="text-rose-500 text-2xl">Table Number: {item.tableNumber}</div>
                <div className="w-full h-[1px] bg-rose-500 mt-1"></div>
                <div className="p-2 my-2 bg-rose-400 text-white text-xl flex justify-between">
                    <div>
                        Orders
                    </div>
                    <div className="flex">
                        <IoIosArrowForward className={`m-auto transition-all ${open ? "rotate-90" : ""}`} onClick={() => setOpen(!open)} size={23} />
                    </div>
                </div>
                <div className={`transition-all grid ${!open ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
                    <div className="overflow-hidden">
                        {item.orders.map((item, i) => {
                            return (
                                <FoodItemContainer item={item} key={i} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

const FoodItemContainer = ({ item }) => {
    const [selectedOption, setSelectedOption] = useState(item.status);
    const [color,setColor]=useState("")
    useEffect(()=>{
        var color
        switch(selectedOption){
            case 'Waiting':{ color="bg-rose-400"
                break
            }
            case 'Preparing':{ color="bg-blue-500"
                break
            }
            case 'Prepared':{ color="bg-purple-500"
                break
            }
            case 'Completed':{ color="bg-green-500"
                break
            }
            // default:{
            //     color="red"
            // }
        }
        console.log(color)
        setColor(color)
    },[item.status, selectedOption])

    const handleStatusChange=async()=>{
        try {
           const res=await axios.patch(`${backend_url}/food-order/${item._id}/change-status`,{status:selectedOption},{withCredentials:true}) 
           if(res.data.success){
            toast.success(res.data.message)
           }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <>
            <div className="flex m-1 gap-2 justify-between">
                <div className="flex gap-2">
                    <div><img src={`${img_url}/${item.foodItemId.imageUrl}`} className="h-20" /></div>
                    <div className="flex flex-col gap-1">
                        <div className="text-rose-500"><span className="font-semibold">{item.foodItemId.name}</span></div>
                        <div className="text-rose-500">quantity: <span className="font-semibold">{item.quantity}</span></div>
                        <div className='flex'>
                            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.foodItemId.veg ? 'border-green-500' : 'border-red-500'}`}>
                                <span className={`m-auto mx-auto rounded-full w-full h-full ${item.foodItemId.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="text-rose-500 min-w-fit">
                        <div className="flex justify-center">
                        <span className="m-auto mr-1">status: </span>
                        <Select value={selectedOption} onValueChange={(value) => setSelectedOption(value)} >
                            <SelectTrigger className={`w-[130px] text-white ${color} rounded`} >
                                <SelectValue  />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded shadow shadow-rose-100">
                                <SelectGroup className="flex flex-col gap-1" >
                                    <SelectItem value="Waiting" className="bg-rose-400 text-white rounded">Waiting</SelectItem>
                                    <SelectItem value="Preparing" className="bg-blue-500 text-white rounded" >Preparing</SelectItem>
                                    <SelectItem value="Prepared" className="bg-purple-500 text-white rounded" >Prepared</SelectItem>
                                    <SelectItem value="Completed" className="bg-green-500 text-white rounded" >Completed</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>
                    <div className="text-end">
                        <button className="text-white bg-rose-400 p-1 px-2 rounded" onClick={handleStatusChange}>change</button>
                    </div>
                </div>
            </div>
            <div className="m-1 w-full h-[1px] bg-rose-400"></div>
        </>
    )
}

export default ManageOrders
