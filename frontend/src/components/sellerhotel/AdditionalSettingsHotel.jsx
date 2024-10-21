/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import Tooltip from "../customui/Tooltip"
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url } from "../../server";
import { useParams } from "react-router-dom";

const AdditionalSettingsHotel = ({setTheme,theme}) => {
  const {hotelId}=useParams()

  const [colorSet,setColorSet] = useState([])

  useEffect(()=>{
    const initiatePage=async()=>{
      try {
        const res=await axios.get(`${backend_url}/restaurant/hotel/colors`)
        console.log(res.data)
        if(res.data.success){
          setColorSet(res.data.colors)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
    initiatePage()
  },[hotelId])

  const changeColor=async()=>{
    try {
      const res=await axios.patch(`${backend_url}/restaurant/${hotelId}/change-color`,{color:theme},{withCredentials:true})
      if(res.data.success){
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <>
        <div className="m-5">
          <div className='m-5 mt-8'>
            <div className='font-semibold text-2xl mb-4 text-color5'>
              Additional Settings
            </div>
            <div className="border mb-5 border-color3"></div>
            <div className="border p-5 shadow text-color4 shadow-color4">
              <div className="mb-3 font-semibold text-color5">
                Color Settings
              </div>
              <span className="flex gap-2">
                {colorSet.map((item, i) =>
                  <ColorPaletes item={item} setTheme={setTheme} key={i} />
                )}
              </span>
              <div>
                <div className="mt-5 mb-5 flex gap-2">
                  <div className="w-10 h-10 bg-color0"></div>
                  <div className="w-10 h-10 bg-color1"></div>
                  <div className="w-10 h-10 bg-color2"></div>
                  <div className="w-10 h-10 bg-color3"></div>
                  <div className="w-10 h-10 bg-color4"></div>
                  <div className="w-10 h-10 bg-color5"></div>
                </div>
                <div>
                  <span className="border p-2 shadow cursor-pointer bg-color4 text-white shadow-color1 border-color4" onClick={changeColor}>Change Colors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default AdditionalSettingsHotel


const ColorPaletes = ({ item,setTheme }) => {
  return (
    <div className={`theme-${item} flex`} onClick={()=>setTheme(item)}>
    <Tooltip position="bottom" content={`${item}`} TooltipStyle='bg-color1 text-color5 z-10 whitespace-nowrap translate-x-3' 
    >
      <div className={`w-10 h-10 rounded-full shadow cursor-pointer border-black bg-color5`} 
      >
      </div>
    </Tooltip>
    </div>
  )
}