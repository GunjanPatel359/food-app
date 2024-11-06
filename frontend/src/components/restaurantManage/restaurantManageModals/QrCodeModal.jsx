/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useModal } from "../../../customhooks/zusthook"
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url } from "../../../server";

const QrCodeModal = ({theme}) => {
  const [color4,setColor5]=useState('')
  const params=useParams()
  const {hotelId}=params
  const { isOpen, type,data } = useModal()
  const isModelOpen = isOpen && type === 'table-qr-code'
  const [qrCodeString,setQrCodeString]=useState('')

  useEffect(()=>{
    const findMember=async()=>{
      try {
        const response=await axios.get(`${backend_url}/member/${hotelId}/member-of-hotel`,{withCredentials:true})
        if(response.data.success){
          initiatQr(response.data.data)
        }
      } catch (error) {
        toast.error(error.mesage)
      }
    }
    const initiatQr=async(memberId)=>{
        setQrCodeString(`http://localhost:5173/user/restaurant/${hotelId}/qrcode/${data.QrCodeSetUserTable._id}/${data.QrCodeSetUserTable.randomString}/${memberId}`)
    }
    if(data && data?.QrCodeSetUserTable){
        findMember()
    }
  },[data, hotelId])

  useEffect(()=>{
    const color5 = window.getComputedStyle(document.documentElement).getPropertyValue('--color-5');
    setColor5(color5);
    console.log(color5)
  },[theme])

  if(!isModelOpen){
    return null
  }

  return (
    <div className="w-[400px] p-5">
        <div className="text-color5 font-semibold text-2xl mb-2">
            Scan Qr Code
        </div>
        <div className="w-full h-[2px] bg-color5 mb-2"></div>
        {data?.QrCodeSetUserTable && (
            <div className="text-color4 text-lg">
               <span className="text-color5 font-semibold text-xl">Table Number :</span> {data?.QrCodeSetUserTable.tableNumber}
            </div>
        )}
        <div className="mt-2 flex justify-center h-[300px] text-center m-auto align-middle">
      <QRCode value={qrCodeString} size={200} fgColor={`${color4}`} className="my-auto"  />
        </div>
      {qrCodeString}
    </div>
  )
}

export default QrCodeModal
