import { useEffect, useMemo, useState } from "react"
import SellerProfileHeader from "../components/sellerprofile/SellerProfileHeader"
import SlideMenu from "../components/slidemenu/SlideMenu"

import { MdOutlineTableBar } from "react-icons/md";
import { ImSpoonKnife } from "react-icons/im";
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import { backend_url, theme_colors } from "../server";
import { addSeller, sellerLogout } from "../redux/reducers/seller";
import { toast } from "react-toastify";
import OrderTables from "../components/restaurantManage/OrderTables";
import RestaurantManageProvider from "../provider/RestaurantManageProvider";
import ManageOrders from "../components/restaurantManage/ManageOrders";

const SellerRestaurantManagePage = () => {
    const Themes = useMemo(() => theme_colors, [])
    const [theme, setTheme] = useState(Themes[0]);

    const params = useParams()
    const { hotelId } = params
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [select, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)



    useEffect(() => {
        const initiatePage = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${backend_url}/seller/gethoteldata/${hotelId}`, { withCredentials: true })
                if (res.data.hotel.colors) {
                    if (Themes.includes(res.data.hotel.colors)) {
                        setTheme(res.data.hotel.colors)
                    }
                }
            } catch (error) {
                toast.error("Somthing went wrong")
            }finally{
                setLoading(false)
            }
        }
        initiatePage()
    }, [Themes, hotelId])

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
        
        const memberInfo = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${backend_url}/member/${hotelId}/ismember`, { withCredentials: true })
                if (response.data.data) {
                    return
                }
                navigate('/seller/login')
            } catch (error) {
                navigate('/seller/login')
                toast.error(error)
            } finally {
                setLoading(false)
            }
        }

        userinfo()
        memberInfo()
    }, [dispatch, navigate, hotelId])

    const menuItemList = [
        { icon: <MdOutlineTableBar size={22} />, text: "Table", alert: false },
        { icon: <ImSpoonKnife size={22} />, text: "Order", alert: false },
    ]

    console.log(theme)

     return (
        <div className={`theme-${theme}`} key={theme}>
            {!loading ? (
                <>
                    <SellerProfileHeader />
                    <div className='flex w-full transition-all duration-1000'>
                        <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList} />
                        <div className='w-full'>
                            {select === 0 && <OrderTables />}
                            {select === 1 && <ManageOrders />}
                        </div>
                    </div>
                    <RestaurantManageProvider theme={theme} />
                </>
            ) : (
            <>
            </>
                // <LoadingSpinner /> // Optional loading component
            )}
        </div>
    );
};

export default SellerRestaurantManagePage
