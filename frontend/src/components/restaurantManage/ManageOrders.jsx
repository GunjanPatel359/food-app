/* eslint-disable react/prop-types */
import { backend_url, img_url } from "../../server"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { IoIosArrowForward } from "react-icons/io";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import "./hello.css"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { socket } from "../../socket"

const ManageOrders = () => {
    const { hotelId } = useParams()
    const [table, setTable] = useState([])
    useEffect(()=>{
        socket.connect()
        return () => {
            socket.disconnect();
        };
    },[])
    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await axios.get(`${backend_url}/order-table/${hotelId}/get-all-tables-order`, { withCredentials: true })
                if (res.data.success) {
                    const filt = res.data.table
                    const filterd = filt.filter((item) => item.status != "Available")
                    setTable(filterd)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        initiatePage()
        socket.on(`restaurant/${hotelId}/orders`,()=>{
            console.log(hotelId)
            initiatePage()
        })
        return ()=>{
            socket.off(`restaurant/${hotelId}/orders`)
        }
    }, [hotelId])

    return (
        <div className="m-6">
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 1, 900: 2 }}
            >
                <Masonry gutter='15px'>
                    {
                        table.length > 0 ? table.map((item, i) => {
                            return (
                                <TableItems key={i} item={item} />
                            )
                        }) : (
                            <>
                                <div>no orders</div>
                            </>
                        )
                    }
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}

const TableItems = ({ item }) => {

    const [open, setOpen] = useState(true)

    return (
        <>
            <div className="">
                <div className="p-3 border border-color5 rounded shadow">
                    <div className="text-color5 text-2xl">Table Number: {item.tableNumber}</div>
                    <div className="w-full h-[1px] bg-color5 mt-1"></div>
                    <div className="p-2 my-2 bg-color4 text-white text-xl flex justify-between">
                        <div>
                            Orders
                        </div>
                        <div className="flex">
                            <IoIosArrowForward className={`m-auto transition-all ${open ? "rotate-90" : ""}`} onClick={() => setOpen(!open)} size={23} />
                        </div>
                    </div>
                    <div className={`transition-all grid ${!open ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
                        <div className="overflow-hidden">
                            {item.orders.map((items, i) => {
                                return (
                                    <FoodItemContainer foodId={items} orderTableId={item._id} key={i} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const FoodItemContainer = ({ foodId, orderTableId }) => {
    const { hotelId } = useParams()
    const [item, setItem] = useState()
    const [selectedOption, setSelectedOption] = useState();

    const colorStatus=()=>{
        var color
        switch (selectedOption) {
            case 'Waiting': {
                color = "bg-rose-500"
                break
            }
            case 'Preparing': {
                color = "bg-blue-500"
                break
            }
            case 'Prepared': {
                color = "bg-purple-500"
                break
            }
            case 'Completed': {
                color = "bg-green-500"
                break
            }
            default:{
                color="bg-rose-500"
            }
        }
        return color
    }

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await axios.get(`${backend_url}/order-table/${hotelId}/${foodId}/order-tabel-food-item`, {
                    withCredentials: true
                })
                if (res.data.success) {
                    setItem(res.data.fooditem)
                    setSelectedOption(res.data.fooditem.status)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        initiatePage()
        socket.on(`restaurant/${hotelId}/order-tables/${orderTableId}`,()=>{
            initiatePage()
        })
        return ()=>{
            socket.off(`restaurant/${hotelId}/order-tables/${orderTableId}`)
        }
    }, [foodId, hotelId, orderTableId])

    const handleStatusChange = async (item) => {
        try {
            const res = await axios.patch(`${backend_url}/food-order/${orderTableId}/${item._id}/change-status`, { status: selectedOption }, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            {item && (
                <>
                    <div className="flex m-1 gap-2 justify-between">
                        <div className="flex gap-2">
                            <div><img src={`${img_url}/${item.foodItemId.imageUrl}`} className="h-20" /></div>
                            <div className="flex flex-col gap-1">
                                <div className="text-color5"><span className="font-semibold">{item.foodItemId.name}</span></div>
                                <div className="text-color5">quantity: <span className="font-semibold">{item.quantity}</span></div>
                                <div className='flex'>
                                    <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.foodItemId.veg ? 'border-green-500' : 'border-red-500'}`}>
                                        <span className={`m-auto mx-auto rounded-full w-full h-full ${item.foodItemId.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-color5">
                                <div className="flex justify-center">
                                    <span className="m-auto mr-1 ml-3">status: </span>
                                    <Select value={selectedOption} onValueChange={(value) => setSelectedOption(value)} >
                                        <SelectTrigger className={`w-[130px] text-white ${colorStatus(item.status)} rounded`} >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white rounded shadow shadow-color1">
                                            <SelectGroup className="flex flex-col gap-1" >
                                                <SelectItem value="Waiting" className="bg-rose-500 text-white rounded">Waiting</SelectItem>
                                                <SelectItem value="Preparing" className="bg-blue-500 text-white rounded" >Preparing</SelectItem>
                                                <SelectItem value="Prepared" className="bg-purple-500 text-white rounded" >Prepared</SelectItem>
                                                <SelectItem value="Completed" className="bg-green-500 text-white rounded" >Completed</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="text-end">
                                <button className="text-white bg-color4 p-1 px-2 rounded" onClick={() => handleStatusChange(item)}>change</button>
                            </div>
                        </div>
                    </div>
                    <div className="m-1 w-full h-[1px] bg-color4"></div>
                </>
            )}
        </>
    )
}

export default ManageOrders
