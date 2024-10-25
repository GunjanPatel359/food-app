import { useEffect, useMemo, useState } from "react"
import Header from "../../components/header/Header"
import axios from "axios"
import { backend_url, img_url, theme_colors } from '../../server'
import { addUser } from "../../redux/reducers/user"
import { useDispatch } from "react-redux"
import RatingShow from "../../components/customui/RatingShow"


const HomePage = () => {

  const Themes = useMemo(() => theme_colors, [])
  const [theme, setTheme] = useState(Themes[0]);
  const [loading, setLoading] = useState(true)

  const [hotel, setHotel] = useState([])

  const dispatch = useDispatch()

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
    const getDisplayHotel = async () => {
      try {
        const res = await axios.get(`${backend_url}/restaurant/restaurant-get-home`)
        if (res.data.success) {
          setHotel(res.data.hotel)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDisplayHotel()
  }, [])

  console.log(hotel)

  return (
    <>
      {!loading && (
        <>
          <div className={`theme-${theme}`}>
            <Header page='home' />
            <div className="w-full h-[500px] bg-[url('/food3.jpg')] bg-center bg-cover">
              <div className="bg-coloralpha w-full h-full flex items-center justify-center">
                <div className="">
                  hello
                </div>
              </div>
            </div>
            <div className="">
              <div className="my-3 ">
                <div className="w-[85%] m-auto rounded">
                  <div className="w-full">
                    <div className="text-color5 text-3xl p-5 pb-1 font-semibold">
                      Restaurants
                    </div>
                    <div className="flex gap-3 overflow-y-scroll p-5">
                      {hotel.map((item, index) => {
                        return (
                          <>
                            <div className="bg-white min-w-[250px] w-[250px] h-[350px] border border-color1 rounded-2xl shadow-color0 overflow-hidden shadow-lg" key={index}>
                              <div className="relative w-full h-44 overflow-hidden shadow-md shadow-color0">
                                <img className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-ss-lg rounded-se-lg cursor-pointer" src={`${img_url}/${item.imgUrl}`} />
                              </div>
                              {/* <div>
                            <img src={`${img_url}/${item.imgUrl}`} className="rounded-ss-lg rounded-se-lg cursor-pointer hover:scale-105" />
                          </div> */}
                              <div className="p-2 flex flex-col gap-1">
                                <div className="text-color5 font-semibold text-xl">{item.name}</div>
                                <div className="flex mb-2">
                                  <RatingShow ratingCount={item.avgreview} maxRatingCount={5} size={20} />
                                  <span className="bg-color5 border-1 border-color4 px-2 py-[1px] rounded-full text-sm text-white ml-1">{item.totalReview.toString().length < 4
                                    ? `${'0'.repeat(4 - item.totalReview.toString().length)}${item.totalReview}`
                                    : item.totalReview}</span>
                                </div>
                                <div className="flex gap-2">
                                  {item.cusineTypes.map((item) => {
                                    return (
                                      <>
                                        <div className="bg-color0 text-color4 px-2 py-[2px] rounded-xl">
                                          {item}
                                        </div>
                                      </>
                                    )
                                  })}
                                </div>
                                <div className="text-color5 w-full text-justify"><span className="text-color5 font-semibold">location:</span> {`${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`
                                  .length > 35
                                  ? `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`.substring(0, 35) + "..."
                                  : `${item.addresses.address}, ${item.addresses.city}, ${item.addresses.state}, ${item.addresses.country}`} </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default HomePage
