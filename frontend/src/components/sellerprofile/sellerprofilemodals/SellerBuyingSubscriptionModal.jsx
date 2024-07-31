import { useModal } from '../../../customhooks/zusthook'
import { Check } from "lucide-react"
import SellerPayPalPayment from './SellerPayPalPayment'

const SellerBuyingSubscriptionModal = () => {
    const {data,isOpen, type } = useModal()
  const isModelOpen = isOpen && type === 'purchase-subscription'
  return (
    <>
    {isModelOpen?(
      <div className='h-auto w-[550px]'>
            <>
                <div className='w-full font-bold text-2xl p-6'>
                    Purchasing subscription
                </div>
            <div className='flex w-full flex-row p-7 pt-0'>
            <div className='flex justify-center pr-4'>
            <div key={data.title} className="">
              <div>
                <div className="">
                  Purchasing {data.title} Package
                </div>
                {/* <div>{data.description}</div> */}
              </div>
              <div>
                <span className="text-4xl font-bold">{data.price}</span>
                <span className="text-muted-foreground">/m</span>
              </div>
              <div className="flex flex-col items-start gap-4">
                <div>{data.features.map((feature)=>
                  <div key={feature} className="flex gap-2 items-center">
                    <Check  className="text-muted-foreground"/>
                    <p>{feature}</p>
                  </div>
                )}</div>
              </div>
            </div>
            </div>
            <div className='w-[300px]'>
              <div>
            <SellerPayPalPayment item={data}/>
              </div>
            </div>
            </div>
            </>
            </div>
        ):""}
      </>
  )
}

export default SellerBuyingSubscriptionModal
