import { useEffect, useMemo, useState } from "react"
import Header from "../../components/header/Header"
import axios from "axios"
import { backend_url, theme_colors } from '../../server'
import { addUser } from "../../redux/reducers/user"
import { useDispatch } from "react-redux"


const HomePage = () => {

  const Themes=useMemo(()=>theme_colors,[])
  const [theme,setTheme]=useState(Themes[0]);
  const [loading,setLoading]=useState(true)
  
  const dispatch=useDispatch()

  useEffect(() => {
    const userinfo = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${backend_url}/user/userinfo`, {
          withCredentials: true
        })
        if(!res.data.user){
          return
        }
        dispatch(addUser(res.data.user))
        if(res.data.user.colors){
          setTheme(res.data.user.colors)
        }
      } catch (err) {
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    userinfo()
  }, [dispatch])

  return (
    <>
    {!loading && (
      <>
      <div className={`theme-${theme}`}>
        <Header page='home' />
        <div className="w-full h-[500px] bg-[url('/food3.jpg')] bg-center bg-cover">
        <div className="bg-[rgba(245,100,108,0.38)] w-full h-full flex items-center justify-center">
          <div className="">
            hello
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
 