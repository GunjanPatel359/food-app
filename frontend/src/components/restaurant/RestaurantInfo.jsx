/* eslint-disable react/prop-types */

import { FaRegStar, FaStar } from "react-icons/fa"
import { img_url } from "../../server"
import RatingShow from "../customui/RatingShow"
import RatingBar from "../customui/RatingBar"
import { useEffect, useState } from "react"

const RestaurantInfo = ({ hotel }) => {
    const [color5, setColor5] = useState('')
    useEffect(() => {
        const primaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--color-5');
        setColor5(primaryColor);
    }, []);
    if (!hotel) {
        return <div>Loading...</div>
    }
    return (
        <>
            <div className="sm:flex m-2 border border-color5 rounded lg:w-[70%] mx-auto">
                <div className="sm:w-[40%] w-[100%] p-2">
                    <img src={`${img_url}/${hotel.imgUrl}`} className="rounded shadow shadow-color4 w-full" />
                </div>
                <div className="sm:w-[60%] p-2 pt-0 sm:pt-2 flex flex-col gap-2">
                    <div className="text-2xl font-bold text-color5">{hotel.name}</div>
                    <div className="flex">
                        <span className="text-color5 font-semibold text-md mr-1">Ratings:</span>
                        <span className="p-[1px]"><RatingShow ratingCount={3.3} maxRatingCount={5} size={20} /></span>
                        <span className="text-color4 text-sm ml-1 my-auto">3.1/5</span>
                        <span className="text-sm my-auto text-color4 ml-1 border border-color4 rounded-full px-3 bg-color0">Total ratings: 0</span>
                    </div>
                    <div className="my-1">{hotel.cusineTypes.length > 0 && hotel.cusineTypes.map((item, i) => {
                        return (
                            <div key={i} className="inline border border-color5 p-1 rounded-xl mr-1 text-color5 bg-color0 px-2 text-center shadow shadow-color2">
                                <div className="inline text-center relative -top-[1px] -left-[1px]">{item}</div>
                            </div>)
                    })}</div>
                    <div>
                        <div className="text-color5 w-full text-justify"><span className="text-color5 font-semibold">location:</span> {hotel.addresses.address}, {hotel.addresses.city}, {hotel.addresses.state}, {hotel.addresses.country} </div>
                    </div>
                </div>
            </div>
            <div className="lg:w-[70%] m-auto">
                <div className="text-color5 text-3xl font-bold my-4 mx-2">Reviews and Ratings</div>
                <div className="flex m-4 mb-8">
                    <div className="w-[35%] flex flex-col items-center">
                        <div className="flex flex-col gap-1">
                            <div className="text-7xl text-color5">
                                3.4
                            </div>
                            <RatingShow ratingCount={3.4} maxRatingCount={5} size={20} />
                            <div className="mt-1 flex"><span className="bg-color5 border-1 border-color5 p-1 px-3 rounded-full text-sm text-white mx-auto">34882</span></div>
                        </div>
                    </div>
                    <div className=" w-[2px] bg-color4 flex flex-col">
                    </div>
                    <div className="w-[65%] pl-10">
                        <div className="flex text-color5">5<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={900} totalCount={2000} /></div></div>
                        <div className="flex text-color5">4<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={400} totalCount={2000} /></div></div>
                        <div className="flex text-color5">3<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={200} totalCount={2000} /></div></div>
                        <div className="flex text-color5">2<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={100} totalCount={2000} /></div></div>
                        <div className="flex text-color5">1<FaStar className="text-color5 my-auto ml-1 mr-4" /><div className="flex w-full flex-1 m-auto"><RatingBar count={400} totalCount={2000} /></div></div>
                    </div>
                </div>
                <div className="border border-color3 p-4 rounded">
                    <div className="text-color5 text-2xl font-bold my-2">Rate Us</div>
                    <div>
                        <RatingForm maxRatingCount={5} color={color5} size={50} />
                    </div>
                </div>
            </div>
        </>
    )
}

const RatingForm = ({ maxRatingCount = 5, color,size }) => {
    const [count, setCount] = useState(0)
    const [demon, setDemon] = useState(0)
    const [text,setText]=useState('')
    return (
        <>
        <div className="flex flex-col gap-2">
            <div className="flex relative m-auto">
                {[...new Array(maxRatingCount)].map((_, i) => {
                    const index = i + 1;
                    var isFilled=false;
                    if(count){
                        if(count>=index){
                            isFilled=true;
                            }
                    }else{
                        if(demon){
                            if(demon>=index){
                                isFilled=true;
                                }
                        }
                    }
                    // var isFilled = count >= index || (demon && demon >= index);
                    const StarComponent = isFilled ? FaStar : FaRegStar;

                    return (
                        <StarComponent
                            className="cursor-pointer"
                            color={color}
                            size={size}
                            key={i}
                            onMouseEnter={() => setDemon(index)}
                            onMouseLeave={() => setDemon(0)}
                            onClick={() => setCount(index)}
                        />
                    );
                })}
            </div>
            <div>
                <textarea className="w-full h-[100px] border-2 border-color1 hover:border-color2 rounded p-2 placeholder:text-color2 outline-color5 text-color5" placeholder="please share your experince with others" value={text} onChange={(e)=>setText(e.target.value)} />
            </div>
            <div className="flex gap-2">
                <button className="w-[50%] p-2 bg-color4 text-white">Submit review</button>
                <button className="w-[50%] border-2 border-color4 text-color4">cancel</button>
            </div>
            </div>
        </>
    )
}

export default RestaurantInfo
