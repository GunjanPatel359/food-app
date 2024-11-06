import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../../components/ui/form'

import z from 'zod'
import { toast } from 'react-toastify'

import { backend_url } from '../../server'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { setCookie } from '../../lib/setCookie'

const SellerLoginPage = () => {
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate()

  const {seller}=useSelector((state)=>state.seller)

  useEffect(()=>{
    setLoading(true)
    if(seller){
      navigate("/seller/profile")
    }
    setLoading(false)
  },[seller,navigate])
  
  const formSchema = z.object({
    email: z.string().email({
      message:"* please provide valid email"
    }),
    password: z.string().min(5, {
      message: '* invalid password'
    })
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const onSubmit = async(values) => {
    try {
      axios.post(`${backend_url}/seller/login`,{
        email:values.email,
        password:values.password,
      },{
        headers:{"Content-Type":"application/json"},
        withCredentials:true
      }).then((res)=>{
        console.log(res.data)
        if(res.data.success){
          toast.success(res.data.message)
          // dispatch(sellerLogin(res.data.seller))
          setCookie("seller_token",res.data.seller_token,1,true)
          form.reset()
          navigate("/seller/profile")
        }
      }).catch((err)=>{
        toast.error(err.response.data.message)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    {!loading?(
    <div className='w-full flex m-auto justify-center h-[100vh]'>
      <div className='lg:w-[30%] sm:w-[60%] flex m-auto justify-center border border-color3 shadow shadow-color0 p-8'>
        <div className='w-[250px]'>
        <p className='text-center text-2xl from-neutral-700 font-bold mb-5 text-color5'>Login In</p>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
           
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-color5">Email address</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email' 
                    className="rounded border border-color2 hover:border-color5"
                    {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-color5">Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      required
                      placeholder='Enter your password'
                      className="rounded border border-color2 hover:border-color5"
                      {...field}
                      />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <Button type='submit' className="bg-color3 rounded hover:bg-color4 py-0 w-full text-white">Login In</Button>
          </form>
        </Form>
        <hr className='hidden h-6'/>
        <Link to="/seller/sign-up" className='underline text-color4 hover:text-color5'>{`Don't have an Account`}</Link>
        </div>
      </div>
    </div>
    ):("")}
    </>
  )
}

export default SellerLoginPage
