import { useEffect, useState } from "react"
import SellerProfileHeader from "../components/sellerprofile/SellerProfileHeader"
import { io } from "socket.io-client"
import SlideMenu from "../components/slidemenu/SlideMenu"

import { MdOutlineTableBar } from "react-icons/md";
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import { backend_url } from "../server";
import { addSeller, sellerLogout } from "../redux/reducers/seller";
import { toast } from "react-toastify";
import OrderTables from "../components/restaurantManage/OrderTables";
import RestaurantManageProvider from "../provider/RestaurantManageProvider";

const SellerRestaurantManagePage = () => {
    const params=useParams()
    const {hotelId}=params
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [select, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)

    
    useEffect(() => {
        const socket = io("http://localhost:4000", { query: { orderID: '123' } })
        // socket.on(`/order`)
        // socket.emit('order', 123)
        // socket.on('do')
        // socket.on(`/order/123`, (message) => {
        //     console.log(message)
        // })
    }, [])


    useEffect(() => {
        const userinfo = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${backend_url}/seller/sellerinfo`, {
                    withCredentials: true
                })
                if (!res.data.seller) {
                    dispatch(sellerLogout())
                    navigate('/seller/login')
                }
                dispatch(addSeller(res.data.seller))
            } catch (err) {
                toast.error(err)
                if (err.response.data.success === false) {
                    dispatch(sellerLogout())
                    navigate("/seller/login")
                }
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        const memberInfo=async()=>{
            setLoading(true)
            try {
                const response=await axios.get(`${backend_url}/member/${hotelId}/ismember`,{withCredentials:true})
                if (response.data.data) {
                    return
                }
                navigate('/seller/login')
            } catch (error) {
                navigate('/seller/login')
                toast.error(error)
            }finally{
                setLoading(false)
            }
        }
        userinfo()
        memberInfo()
    }, [dispatch, navigate,hotelId])

    const menuItemList = [
        { icon: <MdOutlineTableBar size={22} />, text: "Table", alert: false },
    ]

    return (
        <div>
            <SellerProfileHeader />
            <div className='flex w-full transition-all duration-1000'>

                <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList} />

                <div className='w-full'>
                    {select === 0 && <OrderTables/>} 
                </div>
            </div>
            <RestaurantManageProvider />
        </div>
    )
}

export default SellerRestaurantManagePage
