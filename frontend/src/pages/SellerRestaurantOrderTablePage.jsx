/* eslint-disable react/prop-types */
import { IoIosArrowDown } from "react-icons/io"
import Tooltip from "../components/customui/Tooltip"
import SellerProfileHeader from "../components/sellerprofile/SellerProfileHeader"
import { backend_url, img_url } from "../server"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"

import { IoIosArrowForward } from "react-icons/io";
import { Checkbox } from "../components/ui/checkbox"
import { Minus, Plus } from "lucide-react"


const SellerRestaurantOrderTablePage = () => {
    const params = useParams()
    const { hotelId } = params
    const { orderTableId } = params

    const [orderTableDetails, setOrderTableDetails] = useState('')
    const [orderFood, setOrderFood] = useState(false)

    const [food, setFood] = useState([]);

    const [order, setOrder] = useState([])
    console.log(order)

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const response = await axios.get(`${backend_url}/order-table/${hotelId}/${orderTableId}/get-order-table-details`, { withCredentials: true })
                console.log(response)
                if (response.data.success) {
                    setOrderTableDetails(response.data.orderTableDetails)
                }
            } catch (error) {
                toast.error(error)
            }
        }
        if (hotelId && orderTableId) {
            initiatePage()
        }
    }, [hotelId, orderTableId])


    useEffect(() => {
        const initialCom = async () => {
            try {
                const response = await axios.get(`${backend_url}/fooditem/getallfood/${hotelId}`)
                console.log(response)
                if (response.data.success) {
                    setFood(response.data.food)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        initialCom()
    }, [hotelId])

    return (
        <div>
            <SellerProfileHeader />
            <div className="w-[70%] m-auto mt-8">
                {
                    orderTableDetails && (
                        <>
                            <div className="m-2">
                                <div className="text-rose-500 text-2xl"><span className="text-rose-500 font-semibold">Restaurant Name:</span> {orderTableDetails.restaurantId.name}</div>
                                <div className="text-rose-500 text-xl"><span className="text-rose-500 font-semibold">Table Number:</span> {orderTableDetails.tableNumber}</div>
                                <div className="text-rose-500 text-xl"><span className="text-rose-500 font-semibold">Table Description:</span> {orderTableDetails.tableDescription}</div>
                                <div className="text-rose-500"><span className="text-rose-500 font-semibold">Status:</span> {orderTableDetails.status}</div>
                                <div className="text-rose-500"><span className="text-rose-500 font-semibold">Seats:</span> {orderTableDetails.seats}</div>
                            </div>

                            <div className="">
                                <div className="m-2">
                                    <div className="text-rose-500 font-semibold text-2xl">Orders</div>
                                    {orderTableDetails.orders.length > 0 ? (
                                        <>
                                        </>
                                    ) : <div className="text-rose-500">{`Haven't ordered anything yet`}</div>}
                                </div>
                            </div>

                            <div className="bg-rose-500 text-rose-200 p-3 text-xl flex justify-between mb-2">
                                <div className="font-semibold text-2xl ml-2 text-white">Add Order</div>
                                <div className="text-center items-center my-auto">
                                    <div className="p-1 bg-white mr-2 rounded cursor-pointer">
                                        <IoIosArrowForward className={`transition-all text-rose-500 ${orderFood ? "rotate-90" : ""}`} onClick={() => setOrderFood(!orderFood)} />
                                    </div>
                                </div>
                            </div>

                            <div className={`transition-all duration-500 overflow-clip ${orderFood ? "max-h-screen" : "max-h-0"}`}>
                                {food && food.map((item, index) =>
                                    <CategoryOpen item={item} key={index} order={order} setOrder={setOrder} />
                                )
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

const CategoryOpen = ({ item, order, setOrder }) => {
    const [open, setOpen] = useState(true)
    return (
        <div className="mb-1">
            <div className="flex bg-rose-200 text-rose-500 p-2 pl-4 w-full justify-between z-10">
                <div className="flex flex-col">
                    <div className="font-semibold text-2xl">
                        {item.categoryName}
                    </div>
                    <div>
                        {item.description}
                    </div>
                </div>
                <div className="flex">
                    <div className="m-auto mr-3">
                        <div className="border-1 bg-rose-100 p-1 cursor-pointer" onClick={() => setOpen(!open)}>
                            <IoIosArrowDown className={`${open ? "" : "-rotate-90"} transition-all duration-500`} size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`ease-linear duration-300 transition-all ${open ? "max-h-screen overflow-clip" : "max-h-0 overflow-hidden"}`}>
                {item?.foodItemIds && (
                    <>
                        {item.foodItemIds.length > 0 && (
                            <>
                                {
                                    item.foodItemIds.map((item, i) => {
                                        return (
                                            <>
                                                <FoodItemOpen item={item} key={i} order={order} setOrder={setOrder} />
                                            </>
                                        )
                                    }, [])
                                }
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

const FoodItemOpen = ({ item, order, setOrder }) => {
    const [count, setCount] = useState(1)
    useEffect(()=>{
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if(check){
            setCount(check.quantity)
        }
    },[item, order])
    const handleCheckClick = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (!check) {
            setOrder([...order, { _id: item._id, quantity: count }])
        }
        if (check) {
            const newOrder = order.filter((food) => {
                return (food._id).toString() != (item._id).toString()
            })
            setOrder(newOrder)
        }
    }
    const handlecheck = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check) {
            return true
        }
        return false
    }
    const onValueup = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check) {
            const newOrder = order.map((food) => {
                if ((food._id).toString() == (item._id).toString())
                    return { ...food, quantity: food.quantity + 1 }
                return food
            })
            setOrder(newOrder)
        }
        setCount(count + 1)
    }
    const onValuedown = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check && check.quantity > 1) {
            const newOrder = order.map((food) => {
                if ((food._id).toString() == (item._id).toString())
                    return { ...food, quantity: food.quantity - 1 }
                return food
            })
            setOrder(newOrder)
            setCount(count - 1)
            return
        }
        if(count>1){
            setCount(count - 1)
        }
        
    }
    return (
        <div className='p-2 bg-white border-b border-rose-200'>
            <div className='flex transition-all'>
                <Checkbox
                    checked={handlecheck()}
                    onCheckedChange={() => handleCheckClick()}
                    className="m-auto mr-3 border-rose-400 text-rose-500 data-[state=checked]:bg-rose-50 rounded shadow shadow-rose-100 data-[state=checked]:text-rose-500" />
                <img
                    src={`${img_url}/${item.imageUrl}`}
                    className='h-[90px] rounded shadow shadow-rose-300'
                />
                <div className='ml-2 w-full flex-col flex gap-1'>
                    <div className='flex justify-between w-full'>
                        <div className='text-xl text-rose-500 font-semibold'>
                            {item.name}
                        </div>
                        <div>
                            <span>
                                <div className="text-rose-500 font-semibold text-xl">{item.price}/-</div>
                            </span>
                        </div>

                    </div>
                    <div className='flex justify-between w-full '>
                        <div className='text-rose-500'>{item.smallDescription}</div>
                        <div>
                            <span>
                                <div className='text-rose-500 font-semibold flex gap-2'>
                                    <span className="border border-rose-500 rounded text-center bg-rose-500 shadow">
                                        <Minus className="inline text-white cursor-pointer" onClick={onValuedown}/>
                                    </span>
                                    <input type="number" value={count} className="inline w-6 text-center outline-none border border-rose-500  rounded" inputMode="numeric" />
                                    <span className="border border-rose-500 rounded text-center bg-rose-500 shadow">
                                        <Plus className="inline text-white cursor-pointer" onClick={onValueup} />
                                    </span>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className='flex'>
                        <Tooltip position="right" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle='bg-rose-200 text-rose-600'>
                            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
                                <span className={`m-auto mx-auto rounded-full w-full h-full ${item.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
                                </span>
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerRestaurantOrderTablePage
