import { useEffect, useState } from "react"

import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button"
import { Link } from "@mui/material";

import {AiOutlineEye} from "react-icons/ai"
import {AiOutlineEyeInvisible} from "react-icons/ai"

import { toast } from "react-toastify";

import axios from "axios"
import {backend_url} from "../../server"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [visible, setVisible] = useState(false);
  const [loading,setLoading]=useState(false);

  const navigate=useNavigate()

  const {user}=useSelector((state)=>state.user)

  useEffect(()=>{
    setLoading(true)
    if(user){
      navigate("/profile")
    }
    setLoading(false)
  },[user,navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!name){
      return toast.error("Please enter your name")
    }
    if(!email){
      return toast.error("Please enter valid email")
    }
    if(!password){
      return toast.error("Please enter a valid password")
    }
    if(password.length<6){
      return toast.error("password should be 6 character long")
    }
    if(password!==confirmPassword){
      return toast.error("password and conform password does not match")
    }
    try{
      axios.post(`${backend_url}/user/create-user`,
        {
          name,
          email,
          password,
          phoneNumber
        },
        {
         headers:{"Content-Type":"application/json"}
        }
      ).then((res)=>{
        if(res.data.success){
          toast.success(res.data.message)
          setName("")
          setEmail("")
          setPassword("")
          setConfirmPassword("")
          setPhoneNumber("")
        }
      }).catch((err)=>{
        toast.error(err.response.data.message)
      })
    }catch(err){
      console.log(err)
    }
  }
  
  return (
    <>
    {!loading?(
    <div className="min-w-screen min-h-screen items-center justify-center flex">
      <div className="w-[470px] align-middle m-auto justify-center items-center flex flex-col gap-3 shadow shadow-color0 border border-color3 py-[30px]">
        <h1 className="text-[30px] font-[600] text-color4">Sign up</h1>
        <form className="flex flex-col gap-4 justify-center" onSubmit={handleSubmit}>
          <TextField value={name} type="text" label="username" variant="outlined" className="w-[250px]" onChange={(e) => setName(e.target.value)} required />
          <TextField value={email} type="email" label="email" variant="outlined" className="w-[250px]" onChange={(e) => setEmail(e.target.value)} required />
          <div className="relative">
            <TextField value={password} type={visible?"text":"password"} label="password" variant="outlined" className="w-[250px]" onChange={(e) => setPassword(e.target.value)} required />
            {visible ? (
              <AiOutlineEye
                className="absolute right-2 top-[25%] cursor-pointer"
                size={27}
                onClick={() => setVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-2 top-[25%] cursor-pointer"
                size={27}
                color="rgb(30,30,30)"
                onClick={() => setVisible(true)}
              />
            )}
          </div>
          <TextField value={confirmPassword} label="confirm password" variant="outlined" className="w-[250px]" onChange={(e) => setConfirmPassword(e.target.value)} required />
          <TextField value={phoneNumber} type="number" label="phonenumber" variant="outlined" onChange={(e) => setPhoneNumber(e.target.value)} />
          <Button type="submit" variant="contained">sign up</Button>
        </form>
        <Link href="/login"><p className="text-[15px]">Already have an existing account!</p></Link>
      </div>
    </div>):("")}
    </>
  )
}

export default SignupPage
