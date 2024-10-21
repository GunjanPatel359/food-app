import { useEffect, useState } from "react";

import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button"
import { Link } from "@mui/material";

import { AiOutlineEye } from "react-icons/ai"
import { AiOutlineEyeInvisible } from "react-icons/ai"

import { toast } from "react-toastify";

import axios from "axios";
import { backend_url } from "../../server";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/reducers/user";
import { setCookie } from "../../lib/setCookie";

const LoginPage = () => {
  const {user}=useSelector((state)=>state.user);
  const dispatch=useDispatch()
  const navigate=useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
    setLoading(true)
    if(user){
      navigate("/profile")
    }
    setLoading(false)
  },[user,navigate])


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      axios.post(
        `${backend_url}/user/login`
        , {
        email,
        password
      },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          }
        }
      ).then((res) => {
        if (res.data.success) {
          toast.success("Logged in successfully")
          console.log(res.data)
          dispatch(addUser(res.data.user))
          setCookie("token",res.data.token,1,true)
          navigate("/profile")
        } else {
          toast.error("Invalid credentials")
        }
      })
    } catch (err) {
      toast.error(err)
    }
  }

  return (
    <>
    {!loading?(
      <div className="min-w-screen min-h-screen items-center justify-center flex">
      <div className="w-[470px] m-auto justify-center items-center flex flex-col gap-3 shadow shadow-color0 border border-color3 py-[90px]">
        <h1 className="text-[30px] font-[600] text-color4">Login In</h1>
        <form className="flex flex-col gap-4 justify-center" onSubmit={handleSubmit}>
          <TextField value={email} type="email" label="email" variant="outlined" className="w-[250px]" onChange={(e) => setEmail(e.target.value)} required />
          <div className="relative">
            <TextField value={password} type={visible ? "text" : "password"} className="w-[250px]" label="password" variant="outlined" onChange={(e) => setPassword(e.target.value)} required />
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
          <Button variant="contained" type="submit">Login In</Button>
        </form>
        <Link href="/sign-up"><p className="text-[15px]">{`Don't have an Account`}</p></Link>
      </div>
    </div>):("")}
    </>
  )
}

export default LoginPage
