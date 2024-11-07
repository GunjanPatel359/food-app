/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import HeaderPublic from "../../components/header/HeaderPublic";
import { backend_url, img_url, theme_colors } from "../../server";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { addUser } from "../../redux/reducers/user";
import { toast } from "react-toastify";
import RatingShow from "../../components/customui/RatingShow";
import OneWayScrollBar from "../../components/customui/OneWayScrollBar";
import { useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";

const RestaurantsPage = () => {
    const dispatch = useDispatch()

    const Themes = useMemo(() => theme_colors, [])
    const [theme, setTheme] = useState(Themes[0]);
    const [loading, setLoading] = useState(true)

    const [restaurantData, setRestaurantData] = useState([])

    const [searchQuery, setSearchQuery] = useState('')
    const [filterQuery, setFilterQuery] = useState('minrate=0&mintotalrate=0')


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
                        <div className="flex h-[100vh] mt-1 flex-col md:flex-row">

                            <div className="lg:w-[25%] lg:min-w-[330px] md:min-w-[300px] h-full border-r rounded-md md:flex flex-col border-color3 bg-white shadow hidden">
                                    {/* <div className='mx-auto mt-8 p-[7px] border rounded-full w-[80%] flex border-color5'>
                                        <MdOutlineSearch className="my-auto ml-1 mr-1 text-color5" size={20} />
                                        <input
                                            type="text"
                                            className="outline-none text-color5 placeholder-color3 w-full"
                                            placeholder="Enter restaurant name"
                                            onChange={handleSearchChange}
                                            value={searchString}
                                        />
                                    </div> */}
                                    <div className="p-2">
                                        <Filter setFilterQuery={setFilterQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                                    </div>
                                {/* <div className="w-[80%] h-[1px] bg-color2 mt-3 mx-auto"></div>
                                <div className="bg-red w-[70%] mx-auto font-semibold text-color5 mt-3 text-xl">Filters</div>
                                <FilterForms setFilterQuery={setFilterQuery} /> */}
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

                            <div className="w-full h-full">
                                <RestaurantsShow restaurantData={restaurantData} />
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

const Filter = ({ setFilterQuery,searchQuery,setSearchQuery }) => {

    const [minRating, setMinRating] = useState(0);
    const [minRatingCount, setMinRatingCount] = useState(0);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    };

    const handleMinRatingChange = (e) => {
        setMinRating(e.target.value);
    };

    const handleMinRatingCountChange = (e) => {
        setMinRatingCount(e.target.value);
    };

    const handleFilterApplyClick = () => {
        applyFilters();
    }

    const applyFilters = () => {
        console.log(`minrate=${encodeURIComponent(minRating)}&mintotalrate=${encodeURIComponent(minRatingCount)}`)
        setFilterQuery(`minrate=${encodeURIComponent(minRating)}&mintotalrate=${encodeURIComponent(minRatingCount)}`);
    };

    const handleClearFilterClick = ()=>{
        setSearchQuery('')
        setMinRating(0)
        setMinRatingCount(0)
        setFilterQuery('minrate=0&mintotalrate=0')
    }

    return (
        <div className="flex flex-col gap-2 p-4 bg-white">
            <div className="px-2 py-2 border border-color3 rounded-md  focus:border-color5 text-color5 flex">
            <MdOutlineSearch className="my-auto translate-y-[2px] mr-1 text-color5" size={25} />
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="placeholder:text-color3 text-color5 focus:outline-none"
            />
            </div>
            <div className="h-[2px] w-full bg-color4 rounded-full"></div>
            <div className="text-xl font-semibold text-color5">Filter</div>

            <label className="text-color5 font-semibold">Min Rating: <span className="ml-2 font-normal">{minRating}/5</span></label>
            <div className="flex flex-col lg:w-[80%] md:w-[100%] mx-auto">
                <OneWayScrollBar min={0} max={5} step={0.1} value={minRating} onChange={handleMinRatingChange} />
            </div>

            <label className=" text-color5 font-semibold">Min Rating Count: <span className="ml-2 font-normal">{minRatingCount}</span></label>
            <div className="flex flex-col lg:w-[80%] md:w-[100%] mx-auto">
                <OneWayScrollBar min={0} max={500} step={1} value={minRatingCount} onChange={handleMinRatingCountChange} />
            </div>
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
            <div className="h-[2px] w-full bg-color4 rounded-full"></div>
        </div>
    );
};


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
