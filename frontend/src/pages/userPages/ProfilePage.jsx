import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { addUser, logout } from '../../redux/reducers/user'
import { backend_url } from '../../server'
import { toast } from 'react-toastify'
import axios from 'axios'

import ProfileHeader from '../../components/profile/ProfileHeader'
import SlideMenu from '../../components/slidemenu/SlideMenu'
import ProfileInfo from '../../components/profile/ProfileInfo'
import { User } from 'lucide-react'
import { FaRegAddressBook } from 'react-icons/fa'
import ProfileAddresses from '../../components/profile/ProfileAddresses'
import { ProfileModalProvider } from '../../provider/ProfileModalProvider'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate=useNavigate()
  
  const [select, setSelected] = useState(0)
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    const userinfo = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${backend_url}/user/userinfo`, {
          withCredentials: true
        })
        dispatch(addUser(res.data.user))
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
    { icon:<FaRegAddressBook size={25} />,text:"Addresses",alert:false }
  ]

  return (
    <>{!loading ? (
      <>
      <ProfileHeader />
      
      <div className='flex w-full transition-all duration-1000'>
      
        <SlideMenu select={select} setSelected={setSelected} menuItemList={menuItemList}/>

        <div className='w-full'>
          {select === 0 && <ProfileInfo/>} 
          {select === 1 && <ProfileAddresses/>} 
          {/* {select === 1 && <h1>Hello</h1>} */}
        </div>
      </div>
      <ProfileModalProvider/>
    </>
    ):("") }
    </>
  )
}

export default ProfilePage
