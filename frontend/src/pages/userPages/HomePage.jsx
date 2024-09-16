import { useEffect, useState } from "react"
import RatingShow from "../../components/customui/RatingShow"
import Header from "../../components/header/Header"


const HomePage = () => {
  const [starFillColor,setStarFillColor]=useState('')
  const [starEmptyColor,setStarEmptyColor]=useState('')
  useEffect(()=>{
    setStarFillColor(window.getComputedStyle(document.documentElement).getPropertyValue('--color-5'))
    setStarEmptyColor(window.getComputedStyle(document.documentElement).getPropertyValue('--color-5'))
  },[])

  return (
    <div>
      <Header page='home' />
      <div className="w-full h-[500px] bg-[url('/food3.jpg')] bg-center bg-cover">
      <div className="bg-[rgba(245,100,108,0.38)] w-full h-full flex items-center justify-center">
        <div className="">
          hello
        </div>
      </div>
      </div>
      <RatingShow ratingCount={3.3} maxRatingCount={5} fillColor={starFillColor} emptyColor={starEmptyColor} size={30} />
    </div>
  )
}

export default HomePage
 