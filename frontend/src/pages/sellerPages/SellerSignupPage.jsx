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

const SellerSignupPage = () => {
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
    name: z.string().min(1, {
      message: '* Username must be at least 1 characters.'
    }),
    email: z.string().email({
      message:"* please provide valid email"
    }),
    password: z.string().min(5, {
      message: '* Password must be at least 5 characters.'
    }),
    confirmPassword: z.string().min(5)
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
  const onSubmit = async(values) => {
    try {
      if(values.password !== values.confirmPassword){
        return toast.error("password and confirmpassword do not match")
      }
      axios.post(`${backend_url}/seller/create-seller`,{
        name:values.name,
        email:values.email,
        password:values.password,
      },{
        headers:{"Content-Type":"application/json"}
      }).then((res)=>{
        if(res.data.success){
          toast.success(res.data.message)
          form.reset()
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
      <div className='lg:w-[30%] sm:w-[60%] flex m-auto justify-center border border-gray-500 p-8'>
        <div className='w-[250px]'>
        <p className='text-center text-xl from-neutral-700 font-bold'>Sign Up</p>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your name' 
                    className="rounded border border-gray-400 hover:border-gray-700"
                     {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email' 
                    className="rounded border border-gray-400 hover:border-gray-700"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      required
                      placeholder='Enter your password'
                      className="rounded border border-gray-400 hover:border-gray-700"
                      {...field}
                      />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      required
                      placeholder='confirm password'
                      className="rounded border border-gray-400 hover:border-gray-700"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <Button type='submit' className="bg-gray-300 rounded  hover:bg-gray-200 py-0">Submit</Button>
          </form>
        </Form>
        <Link to="/seller/login" className='underline text-blue-900'>{`Already have an Account`}</Link>
        </div>
      </div>
    </div>
    ):("")}
    </>
  )
}

export default SellerSignupPage
