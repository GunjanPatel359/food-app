/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import HeaderPublic from "../../components/header/HeaderPublic";
import { backend_url, theme_colors } from "../../server";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { addUser } from "../../redux/reducers/user";
import { MdOutlineSearch } from "react-icons/md";
import { DoubleScrollBar } from "../../components/customui/DoubleScrollBar";
import { toast } from "react-toastify";
// import RatingShow from "../../components/customui/RatingShow";
// import { useNavigate } from "react-router-dom";
import OneWayScrollBar from "../../components/customui/OneWayScrollBar";
import FoodItemOpen from "../../components/restaurant/FoodItemOpen";

const FoodItemsPage = () => {
    const dispatch = useDispatch()

    const Themes = useMemo(() => theme_colors, [])
    const [theme, setTheme] = useState(Themes[0]);
    const [loading, setLoading] = useState(true)

    const [foodItemData, setFoodItemData] = useState([])

    const [searchString, setSearchString] = useState()

    const [searchQuery, setSearchQuery] = useState('')
    const [filterQuery, setFilterQuery] = useState('minrate=0&mintotalrate=0&minPrice=0')

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
                const res = await axios.get(`${backend_url}/restaurant/food-items/search-food-items/search?${filterQuery}&search=${searchQuery}`)
                if (res.data.success) {
                    setFoodItemData(res.data.fooditem)
                }
            } catch (error) {
                toast.error(error)
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
                                <form onSubmit={handleSearchSubmit}>
                                    {/* <div className='mx-auto mt-8 p-[7px] border rounded-full lg:w-[80%] md:w-[85%] flex border-color5'>
                                        <MdOutlineSearch className="my-auto ml-1 mr-1 text-color5" size={20} />
                                        <input
                                            type="text"
                                            className="outline-none text-color5 placeholder-color3 w-full"
                                            onChange={handleSearchChange}
                                            value={searchString}
                                            placeholder="Enter food name"
                                        />
                                    </div> */}
                                    <div className="p-2">
                                        <Filter setFilterQuery={setFilterQuery} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                                    </div>
                                </form>
                                {/* <div className="lg:w-[80%] md:w-[85%] h-[1px] bg-color2 mt-3 mx-auto"></div>
                                <div className="bg-red lg:w-[70%] md:w-[80%] mx-auto font-semibold text-color5 mt-3 text-xl">Filters</div> */}
                                {/* <FilterForms setFilterQuery={setFilterQuery} /> */}
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

                            <div className="md:hidden">
                                <form onSubmit={handleSearchSubmit} className="w-[90%] mx-auto">
                                    <div className='mx-auto mt-3 p-[7px] border rounded-full lg:w-[80%] md:w-[85%] flex border-color5'>
                                        <MdOutlineSearch className="my-auto ml-1 mr-1 text-color5" size={20} />
                                        <input
                                            type="text"
                                            className="outline-none text-color5 placeholder-color3 w-full"
                                            onChange={handleSearchChange}
                                            value={searchString}
                                            placeholder="Enter food name"
                                        />
                                    </div>
                                </form>
                            </div>


                            <div className="w-full h-full">
                                <FoodItemsShow foodItemData={foodItemData} />
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

const Filter = ({ setFilterQuery,searchQuery,setSearchQuery }) => {

    // const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
    const [minRating, setMinRating] = useState(0);
    const [minRatingCount, setMinRatingCount] = useState(0);
    const [reset,setReset]=useState(true)

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value)
    };

    const handlePriceRange = useCallback((newRange) => {
        setPriceRange(newRange);
    }, []);

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
        console.log(`minrate=${encodeURIComponent(minRating)}&mintotalrate=${encodeURIComponent(minRatingCount)}&minPrice=${encodeURIComponent(priceRange.min)}&maxPrice=${encodeURIComponent(priceRange.max)}`)
        setFilterQuery(`minrate=${encodeURIComponent(minRating)}&mintotalrate=${encodeURIComponent(minRatingCount)}&minPrice=${encodeURIComponent(priceRange.min)}&maxPrice=${encodeURIComponent(priceRange.max)}`);
    };

    const handleClearFilterClick = ()=>{
        setSearchQuery('')
        setPriceRange({min:0 , max:1000})
        setReset((prevState) => !prevState);
        setMinRating(0)
        setMinRatingCount(0)
        setFilterQuery('minrate=0&mintotalrate=0&minPrice=0')
    }

    return (
        <div className="flex flex-col gap-2 p-4 bg-white">
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-color3 rounded-md focus:outline-none focus:border-color5 placeholder:text-color3 text-color5"
            />
            <div className="h-[2px] w-full bg-color4 rounded-full"></div>
            <div className="text-xl font-semibold text-color5">Filter</div>

            <label className="text-color5 font-semibold">Price Range:<span className="ml-2 font-normal">{priceRange.min} - {priceRange.max}</span></label>
            <div className="flex flex-col lg:w-[80%] md:w-[100%] mx-auto mt-2">
                <DoubleScrollBar min={0} max={1000} onChange={handlePriceRange} reset={reset} />
            </div>

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

const FoodItemsShow = ({ foodItemData }) => {
    console.log(foodItemData)
    return (
        <>
            <div className="m-3 lg:mx-8 md:mx-4">
                <div className="text-2xl font-semibold text-color5">
                    Food Items
                </div>
                {foodItemData.length > 0 && (
                    <>
                        <div className="flex flex-col gap-1 mt-5">
                            {foodItemData.map((item, i) => {
                                return (<FoodItemOpen item={item} key={i} />)
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default FoodItemsPage
