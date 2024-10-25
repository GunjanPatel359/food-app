/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import HeaderPublic from "../../components/header/HeaderPublic";
import { backend_url, img_url, theme_colors } from "../../server";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { addUser } from "../../redux/reducers/user";
import { Command, CommandInput } from '../../components/ui/command'
import { MdOutlineSearch } from "react-icons/md";
import { DoubleScrollBar } from "../../components/customui/DoubleScrollBar";
import { toast } from "react-toastify";
import RatingShow from "../../components/customui/RatingShow";
import OneWayScrollBar from "../../components/customui/OneWayScrollBar";
import { useNavigate } from "react-router-dom";

const RestaurantsPage = () => {
    const dispatch = useDispatch()

    const Themes = useMemo(() => theme_colors, [])
    const [theme, setTheme] = useState(Themes[0]);
    const [loading, setLoading] = useState(true)

    const [restaurantData, setRestaurantData] = useState([])

    const [searchString, setSearchString] = useState()

    const [searchQuery, setSearchQuery] = useState('')
    const [filterQuery, setFilterQuery] = useState('minrate=0&mintotalrate=0')

    const handleSearchChange = (e) => {
        setSearchString(e.target.value)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        try {
            setSearchQuery(`${searchString}`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const userinfo = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${backend_url}/user/userinfo`, {
                    withCredentials: true
                })
                if (!res.data.user) {
                    return
                }
                dispatch(addUser(res.data.user))
                if (res.data.user.colors) {
                    setTheme(res.data.user.colors)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        userinfo()
    }, [dispatch])

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const res = await axios.get(`${backend_url}/restaurant/restaurants/search-restaurants/search?${filterQuery}&search=${searchQuery}`)
                if (res.data.success) {
                    setRestaurantData(res.data.hotel)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchRestaurantData()
    }, [filterQuery, searchQuery])

    return (
        <>
            {!loading && (
                <>
                    <div className={`theme-${theme}`}>
                        <HeaderPublic page='home' />
                        <div className="flex h-[100vh] mt-1">

                            <div className="w-[25%] h-full border-r rounded-md flex flex-col border-color3 bg-white shadow">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className='mx-auto mt-8 p-[7px] border rounded-full w-[80%] flex border-color5'>
                                        <MdOutlineSearch className="my-auto ml-1 mr-1 text-color5" size={20} />
                                        <input
                                            type="text"
                                            className="outline-none text-color5 placeholder-color3 w-full"
                                            placeholder="Enter restaurant name"
                                            onChange={handleSearchChange}
                                            value={searchString}
                                        />
                                    </div>
                                </form>
                                <div className="w-[80%] h-[1px] bg-color2 mt-3 mx-auto"></div>
                                <div className="bg-red w-[70%] mx-auto font-semibold text-color5 mt-3 text-xl">Filters</div>
                                <FilterForms setFilterQuery={setFilterQuery} />
                                {/* <form className="w-[80%] mx-auto mt-5 border border-black">
                                    <div className="">
                                        <DoubleScrollBar 
                                        min={0}
                                        max={1000}
                                        onChange={({ min, max }) =>
                                          console.log(`min = ${min}, max = ${max}`)
                                        }
                                        />
                                    </div>
                                </form> */}
                            </div>

                            <div className="w-[75%] h-full">
                                <RestaurantsShow restaurantData={restaurantData} />
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

const FilterForms = ({ setFilterQuery }) => {
    const [minimumRating, setMinimumRating] = useState(0)
    const [minimumTotalRating, setMinimumTotalRating] = useState(0)

    const handleFilterApplyClick = () => {
        setFilterQuery(`minrate=${encodeURIComponent(minimumRating / 10)}&mintotalrate=${encodeURIComponent(minimumTotalRating)}`)
    }

    const handleClearFilterClick = () => {
        setMinimumRating(0)
        setMinimumTotalRating(0)
        setFilterQuery('minrate=0&mintotalrate=0')
    }

    return (
        <>
            <form className="w-[80%] mx-auto mt-2 border border-color5 rounded-md p-3">
                <div className="flex flex-col w-[80%] mx-auto">
                    <div className="text-color5">
                        minimum rating: <span className="text-color5">{parseFloat(minimumRating / 10).toFixed(1)}</span>
                    </div>
                    <OneWayScrollBar max={50} min={0} step={1} value={minimumRating} onChange={(e) => { setMinimumRating(e.target.value) }} />
                    <div className="text-color5">
                        minimum total review: <span className="text-color5">{parseInt(minimumTotalRating)}</span>
                    </div>
                    <OneWayScrollBar max={1000} min={0} step={10} value={minimumTotalRating} onChange={(e) => { setMinimumTotalRating(e.target.value) }} />

                    <div className="flex gap-1 mt-2">
                        <div className="w-[50%] border p-1 text-center text-color4 border-color4 cursor-pointer transition-all hover:shadow"
                            onClick={handleClearFilterClick}
                        >
                            Clear Filter
                        </div>
                        <div className="w-[50%] border p-1 text-center bg-color4 text-white cursor-pointer hover:bg-color5 transition-all hover:shadow"
                            onClick={handleFilterApplyClick}
                        >
                            Apply
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

const RestaurantsShow = ({ restaurantData }) => {
    return (
        <>
            <div className="m-3 ml-8 mr-8">
                <div className="text-2xl font-semibold text-color5">
                    Restaurants
                </div>
                {restaurantData.length > 0 && (
                    <>
                        <div className="flex flex-col gap-1 mt-5">
                            {restaurantData.map((item, i) => {
                                return (<RestaurantCard item={item} key={i} />)
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

const RestaurantCard = ({ item }) => {
    const navigate = useNavigate()
    return (
        <div className="flex border-b border-color3 p-2 rounded-md cursor-pointer" onClick={() => navigate(`/restaurant/${item._id}`)}>
            <div className="h-[90px] overflow-hidden shadow shadow-color4 rounded-md shadow-inner-custom">
                <img className="h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-md cursor-pointer" src={`${img_url}/${item.imgUrl}`} />
            </div>
            <div className="ml-3">
                <div className="text-lg text-color5 font-semibold">
                    {item.name}
                </div>
                <div className="flex">
                    <RatingShow ratingCount={item.avgreview} maxRatingCount={5} size={18} />
                    <span className="ml-1 text-color5 text-md"> {parseFloat(item.avgreview).toFixed(1)}/5</span>
                    <span className="bg-color5 border-1 border-color4 p-1 px-3 rounded-full text-xs text-white ml-1">{item.totalReview.toString().length < 4
                        ? `${'0'.repeat(4 - item.totalReview.toString().length)}${item.totalReview}`
                        : item.totalReview}</span>
                </div>
                <div className="text-md text-color4">
                    {`${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`
                        .length > 35
                        ? `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`.substring(0, 35) + "..."
                        : `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`}
                </div>
            </div>
        </div>
    )
}

export default RestaurantsPage
