import { useEffect, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'
import { addUser, logout } from '../../redux/reducers/user'
import { backend_url, theme_colors } from '../../server'
import { toast } from 'react-toastify'
import axios from 'axios'

import ProfileHeader from '../../components/profile/ProfileHeader'
import SlideMenu from '../../components/slidemenu/SlideMenu'
import ProfileInfo from '../../components/profile/ProfileInfo'
import UserSettings from '../../components/profile/UserSettings.jsx'
import { User } from 'lucide-react'
import { FaRegAddressBook } from 'react-icons/fa'
import ProfileAddresses from '../../components/profile/ProfileAddresses'
import { ProfileModalProvider } from '../../provider/ProfileModalProvider'
import { useNavigate } from 'react-router-dom'
import { LuSettings2 } from 'react-icons/lu'

const ProfilePage = () => {
  const Themes=useMemo(()=>theme_colors,[])
  const [theme,setTheme]=useState(Themes[0]);

  const dispatch = useDispatch()
  const navigate=useNavigate()
  
  const [select, setSelected] = useState(0)
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    const userinfo = async () => {
      try {
        const res = await axios.get(`${backend_url}/user/userinfo`, {
          withCredentials: true
        })
        if(!res.data.user){
          dispatch(logout())
          navigate('/login')
        }
        dispatch(addUser(res.data.user))
        if(res.data.user.colors){
          setTheme(res.data.user.colors)
        }
      } catch (err) {
        toast.error(err)
        if(err.response.data.success===false){
          dispatch(logout())
          navigate("/login")
        }
        console.log(err)
      }finally{
        setLoading(false)
      }
    }
    userinfo()
  }, [dispatch,navigate])

  const menuItemList=[
    { icon:<User size={25}/>,text:"Profile", alert:false},
    { icon:<FaRegAddressBook size={25} />,text:"Addresses",alert:false },
    { icon:<LuSettings2 size={22} />,text:"preferences",alert:false }    
  ]

  return (
    <div className={`theme-${theme}`}>
    {!loading ? (
      <div>
      <ProfileHeader />
      
      <div className='flex w-full transition-all duration-1000'>
      
        <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList}/>

        <div className='w-full'>
          {select === 0 && <ProfileInfo/>} 
          {select === 1 && <ProfileAddresses/>}
          {select === 2 && <UserSettings theme={theme} setTheme={setTheme} />} 
          {/* {select === 1 && <h1>Hello</h1>} */}
        </div>
      </div>
      <ProfileModalProvider/>
    </div>
    ):("") }
    </div>
  )
}

export default ProfilePage
