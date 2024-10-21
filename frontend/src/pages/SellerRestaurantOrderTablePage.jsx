/* eslint-disable react/prop-types */
import { IoIosArrowDown } from "react-icons/io"
import Tooltip from "../components/customui/Tooltip"
import SellerProfileHeader from "../components/sellerprofile/SellerProfileHeader"
import { backend_url, img_url, theme_colors } from "../server"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "axios"

import { IoIosArrowForward } from "react-icons/io";
import { Checkbox } from "../components/ui/checkbox"
import { Minus, Plus } from "lucide-react"
import { useModal } from "../customhooks/zusthook"
import SellerOrderTableManageProvider from "../provider/SellerOrderTableManageProvider"

import { socket } from "../socket"

const SellerRestaurantOrderTablePage = () => {
    const Themes = useMemo(() => theme_colors, [])
    const [theme, setTheme] = useState(Themes[0]);

    const params = useParams()
    const { hotelId } = params
    const { orderTableId } = params
    const { onOpen, reloadCmd } = useModal()

    const [orderTableDetails, setOrderTableDetails] = useState('')
    const [orderFood, setOrderFood] = useState(false)

    const [food, setFood] = useState([]);

    const [order, setOrder] = useState([])

    const [onGoing, setOnGoing] = useState([])

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const res = await axios.get(`${backend_url}/seller/gethoteldata/${hotelId}`, { withCredentials: true })
                if (res.data.hotel.colors) {
                    if (Themes.includes(res.data.hotel.colors)) {
                        setTheme(res.data.hotel.colors)
                    }
                }
            } catch (error) {
                toast.error("Somthing went wrong")
            }
        }
        initiatePage()
    }, [Themes, hotelId])

    useEffect(() => {
        socket.connect()
    }, [])

    useEffect(() => {
        const initiatePage = async () => {
            try {
                const response = await axios.get(`${backend_url}/order-table/${hotelId}/${orderTableId}/get-order-table-details`, { withCredentials: true })
                if (response.data.success) {
                    setOrderTableDetails(response.data.orderTableDetails)
                    setOnGoing(response.data.orderTableDetails.orders)
                    setOrder([])
                }
            } catch (error) {
                toast.error(error)
            }
        }
        if (hotelId && orderTableId) {
            initiatePage()
        }
        socket.on(`restaurant/${hotelId}/order-tables/${orderTableId}`, () => {
            initiatePage()
            console.log('working')
        })
        return () => {
            socket.off(`restaurant/${hotelId}/order-tables/${orderTableId}`)
        }
    }, [hotelId, orderTableId, reloadCmd])


    useEffect(() => {
        const initialCom = async () => {
            try {
                const response = await axios.get(`${backend_url}/fooditem/getallfood/${hotelId}`)
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
        <div className={`theme-${theme}`}>
            <SellerProfileHeader />
            <div className="w-[70%] m-auto mt-8 mb-36">
                {
                    orderTableDetails && (
                        <>
                            <div className="m-2">
                                <div className="text-color5 text-2xl"><span className="text-color5 font-semibold">Restaurant Name:</span> {orderTableDetails.restaurantId.name}</div>
                                <div className="text-color5 text-xl"><span className="text-color5 font-semibold">Table Number:</span> {orderTableDetails.tableNumber}</div>
                                <div className="text-color5 text-xl"><span className="text-color5 font-semibold">Table Description:</span> {orderTableDetails.tableDescription}</div>
                                <div className="text-color5"><span className="text-color5 font-semibold">Status:</span> {orderTableDetails.status}</div>
                                <div className="text-color5"><span className="text-color5 font-semibold">Seats:</span> {orderTableDetails.seats}</div>
                            </div>

                            <div className="">
                                <div className="">
                                    <div className="text-white font-semibold text-2xl bg-color5 p-2 pl-5">Orders</div>
                                    {onGoing.length > 0 ? (
                                        <>
                                            {onGoing.map((item, i) =>
                                                <OrderItems item={item} key={i} />
                                            )}
                                            <div className="flex justify-between p-2">
                                                <span className="text-xl text-color5 font-semibold">
                                                    Total Amount
                                                </span>
                                                <span className="text-xl text-color5 font-semibold pr-1">
                                                    {onGoing.reduce((total, item) => total + item.foodItemId.price * item.quantity, 0)}/-
                                                </span>
                                            </div>
                                        </>
                                    ) : <div className="text-color5 mt-3 text-center font-semibold">{`Haven't ordered anything yet`}</div>}
                                    <div className="w-full h-[2px] bg-color4 mb-3 mt-3 shadow shadow-color0"></div>
                                </div>
                            </div>

                            <div className="bg-color5 text-color2 p-3 text-xl flex justify-between mb-2">
                                <div className="font-semibold text-2xl ml-2 text-white">Add Order</div>
                                <div className="text-center items-center my-auto">
                                    <div className="p-1 bg-white mr-2 rounded cursor-pointer">
                                        <IoIosArrowForward className={`transition-all text-color5 ${orderFood ? "rotate-90" : ""}`} onClick={() => setOrderFood(!orderFood)} />
                                    </div>
                                </div>
                            </div>

                            <div className={`transition-all duration-500 grid ${!orderFood ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}>
                                <div className="overflow-hidden">

                                    {food && food.map((item, i) =>
                                        <CategoryOpen item={item} key={i} order={order} setOrder={setOrder} />
                                    )
                                    }
                                    <div className="flex">
                                        <button className="text-xl bg-white text-color5 border border-color5 shadow shadow-color5 p-2 w-full rounded mr-1">reset</button>
                                        <button className="text-xl bg-color5 text-white p-2 w-full rounded shadow hover:opacity-90"
                                            onClick={() => onOpen('Ordertable-make-Order',
                                                {
                                                    orderTableOrderFood: {
                                                        orderTabelId: orderTableDetails._id,
                                                        order
                                                    }
                                                }
                                            )}
                                        >Order</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
            <SellerOrderTableManageProvider />
        </div>
    )
}

const OrderItems = ({ item }) => {
    const food = item.foodItemId
    var color = "text-rose-500"
    switch (item.status) {
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
    }
    // "Waiting","Preparing","prepared","Completed"
    return (
        <div className='p-2 bg-white border-b border-color2'>
            <div className='flex transition-all'>
                <img
                    src={`${img_url}/${food.imageUrl}`}
                    className='h-[90px] rounded shadow shadow-color3'
                />
                <div className='ml-2 w-full flex-col flex gap-1'>
                    <div className='flex justify-between w-full'>
                        <div className='text-xl text-color5 font-semibold'>
                            {food.name}
                        </div>
                        <div>
                            <span>
                                <div className={`p-1 rounded-full px-3 text-white ${color}`}>{item.status}</div>
                            </span>
                        </div>

                    </div>
                    <div className='flex justify-between w-full '>
                        <div className='text-color5'>{food.smallDescription}</div>
                        <div>
                            <span>
                                <div className="text-color5 font-semibold text-xl">{item.quantity} X {food.price}/-</div>
                            </span>
                        </div>
                    </div>
                    <div className='flex'>
                        <Tooltip position="right" content={`${food.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${food.veg ? 'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
                            <span className={`border-2 w-6 h-6 flex justify-evenly p-[2.3px] ${food.veg ? 'border-green-500' : 'border-red-500'}`}>
                                <span className={`m-auto mx-auto rounded-full w-full h-full ${food.veg ? 'bg-green-500' : 'bg-red-500'} `} size={17}>
                                </span>
                            </span>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CategoryOpen = ({ item, order, setOrder }) => {
    const [open, setOpen] = useState(true)
    return (
        <div className="mb-1">
            <div className="flex bg-color0 text-color5 p-2 pl-4 w-full justify-between z-10">
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
                        <div className="border-1 bg-color1 p-1 cursor-pointer" onClick={() => setOpen(!open)}>
                            <IoIosArrowDown className={`${open ? "" : "-rotate-90"} transition-all duration-500 text-color5`} size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`ease-linear duration-300 transition-all ${open ? "max-h-screen overflow-clip" : "max-h-0 overflow-hidden"}`}>
                {item?.foodItemIds && item.foodItemIds.length > 0 &&
                    item.foodItemIds.map((item, i) =>
                        <FoodItemOpen item={item} key={i} order={order} setOrder={setOrder} />
                    )
                }
            </div>
        </div>
    )
}

const FoodItemOpen = ({ item, order, setOrder }) => {
    const [count, setCount] = useState(1)
    useEffect(() => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (check) {
            setCount(check.quantity)
        }
    }, [item, order])
    const handleCheckClick = () => {
        const check = order.find((food) => {
            if ((food._id).toString() == (item._id).toString())
                return item
        })
        if (!check) {
            setOrder([...order, { _id: item._id, quantity: count, item }])
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
        if (count > 1) {
            setCount(count - 1)
        }

    }
    return (
        <div className='p-2 bg-white border-b border-color2'>
            <div className='flex transition-all'>
                <Checkbox
                    checked={handlecheck()}
                    onCheckedChange={() => handleCheckClick()}
                    className="m-auto mr-3 border-color4 text-color5 data-[state=checked]:bg-color0 rounded shadow shadow-color1 data-[state=checked]:text-color5" />
                <img
                    src={`${img_url}/${item.imageUrl}`}
                    className='h-[90px] rounded shadow shadow-color3'
                />
                <div className='ml-2 w-full flex-col flex gap-1'>
                    <div className='flex justify-between w-full'>
                        <div className='text-xl text-color5 font-semibold'>
                            {item.name}
                        </div>
                        <div>
                            <span>
                                <div className="text-color5 font-semibold text-xl">{item.price}/-</div>
                            </span>
                        </div>

                    </div>
                    <div className='flex justify-between w-full '>
                        <div className='text-color5'>{item.smallDescription}</div>
                        <div>
                            <span>
                                <div className='text-color5 font-semibold flex gap-2'>
                                    <span className="border border-color5 rounded text-center bg-color5 shadow">
                                        <Minus className="inline text-white cursor-pointer" onClick={onValuedown} />
                                    </span>
                                    <input type="number" value={count} onChange={() => { }} className="inline w-6 text-center outline-none border border-color5  rounded" inputMode="numeric" />
                                    <span className="border border-color5 rounded text-center bg-color5 shadow">
                                        <Plus className="inline text-white cursor-pointer" onClick={onValueup} />
                                    </span>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className='flex'>
                        <Tooltip position="right" content={`${item.veg ? 'veg' : 'non-veg'}`} TooltipStyle={`whitespace-nowrap ${item.veg ? 'bg-green-600 text-green-50 border-white shadow-sm shadow-black' : 'bg-red-600 text-red-50 border-white shadow-sm shadow-black'}`}>
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
