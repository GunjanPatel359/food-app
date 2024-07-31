
import clsx from "clsx"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card.jsx"
import { Check } from "lucide-react"
// import { Link } from "react-router-dom"
import { Button } from "../ui/button.jsx"
import { useModal } from "../../customhooks/zusthook.js"
import { useEffect, useState } from "react"
import axios from "axios"
import { backend_url } from "../../server.js"

const SellerSubscription = () => {
  const {onOpen}=useModal()
  const [sellerPlans,setSellerPlans]=useState([])
  useEffect(()=>{
    const fetchpurchse=async()=>{
      const response=await axios.get(`${backend_url}/subscription/all/subscription-plans`)
      console.log(response.data)
      setSellerPlans(response.data)
    }
      fetchpurchse()
  },[])
  return (
    <div className="m-10">
    <div className="flex justify-evenly flex-wrap">
      {sellerPlans.map((card)=>
            <Card key={card.title} className={clsx('w-[300px] flex flex-col justify-between m-2 text-rose-500 rounded-xl shadow-md border-rose-400 shadow-rose-200',{"border-2 border-rose-300 text-white bg-rose-500":card.title==="Premium"})}>
              <CardHeader>
                <CardTitle className={clsx('',{'text-muted-foreground':card.title!=='Premium'})}>
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                <span className="text-muted-foreground">/m</span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>{card.features.map((feature)=>
                  <div key={feature} className="flex gap-2 items-center">
                    <Check  className="text-muted-foreground"/>
                    <p>{feature}</p>
                  </div>
                )}</div>
                <Button className={clsx('w-full text-center bg-primary p-2 text-rose-500 bg-white shadow-md hover:text-rose-500 hover:bg-white hover:border-rose-400 hover:border transition-all rounded-2xl text-md',{
                    '!bg-muted-foreground border border-rose-500 hover:border-rose-500 shadow-rose-100 ':card.title !== 'Premium'
                })}
                onClick={()=>onOpen('purchase-subscription',card)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          )}
    </div>
    </div>
  )
}

export default SellerSubscription
