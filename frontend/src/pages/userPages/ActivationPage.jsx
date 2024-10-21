// import React from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'
import { backend_url } from '../../server'

const ActivationPage = () => {
    const { token } = useParams();
    console.log(token);
    const handleClick = async () => {
        try {
            axios.post(`${backend_url}/user/activation`,{
                token
            },
            {
                headers:{"Content-Type":"application/json"}
            }
        ).then((res)=>{
            if(res.data.success){
                return toast.success(res.data.message)
            }
        }).catch((err)=>{
            toast.error(err.response.data.message)
        })
        } catch (err) {
            toast.error(err)
        }
    }

    return (
        <div className='flex flex-col text-center justify-center min-h-screen min-w-screen'>
            <div>
                <Button onClick={handleClick} variant="contained" className=' h-min'>Click here to active your account</Button>
            </div>
        </div>
    )
}

export default ActivationPage
