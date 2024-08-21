/* eslint-disable react/prop-types */

import { img_url } from "../../server"

const RestaurantInfo = ({hotel}) => {
    if(!hotel){
        return <div>Loading...</div>
    }
  return (
    <>
    <div className="sm:flex m-2 border border-rose-500 rounded lg:w-[70%] mx-auto">
        <div className="sm:w-[40%] w-[100%] p-2">
            <img src={`${img_url}/${hotel.imgUrl}`} className="rounded shadow shadow-rose-400 w-full" />
        </div>
        <div className="sm:w-[60%] p-2 pt-0 sm:pt-2 flex flex-col gap-2">
            <div className="text-2xl font-bold text-rose-500">{hotel.name}</div>
            <div className="my-1">{hotel.cusineTypes.length>0 && hotel.cusineTypes.map((item,i)=>{
                return (
                <div key={i} className="inline border border-rose-500 p-1 rounded-xl mr-1 text-rose-500 bg-rose-50 px-2 text-center shadow shadow-rose-200">
                    <div className="inline text-center relative -top-[1px] -left-[1px]">{item}</div>
                </div>)
            })}</div>
            <div>
            <div className="text-rose-500 w-full text-justify"><span className="text-rose-500 font-semibold">location:</span> {hotel.addresses.address}, {hotel.addresses.city}, {hotel.addresses.state}, {hotel.addresses.country} </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default RestaurantInfo
