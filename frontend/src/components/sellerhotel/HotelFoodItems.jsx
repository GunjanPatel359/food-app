import { useModal } from "../../customhooks/zusthook"
import { Plus } from "lucide-react"


const HotelFoodItems = () => {
    const {onOpen}=useModal()
  return (
      <div className="m-5">
        {
        <div className="m-5 mt-8">
            <div className="text-rose-500 font-semibold text-2xl mb-4">Food Items</div>
            <div className="flex gap-2">
        <span className="bg-rose-50 p-2 py-2 transition-all text-rose-500 hover:opacity-80 cursor-pointer border border-rose-500 border-dashed rounded-full flex flex-row max-w-fit pr-5" onClick={()=>onOpen("create-food-category")}>
           <span className="flex flex-row border border-rose-500 rounded-full mr-2 ml-1 border-dashed"><Plus className="inline"/></span> Create Category
        </span>
        <span className="bg-rose-50 p-2 py-2 transition-all text-rose-500 hover:opacity-80 cursor-pointer border border-rose-500 border-dashed rounded-full flex flex-row max-w-fit pr-5" onClick={()=>onOpen("create-food-item")}>
           <span className="flex flex-row border border-rose-500 rounded-full mr-2 ml-1 border-dashed"><Plus className="inline"/></span> Create Food Item
        </span>

            </div>
        <div className="bg-rose-50 border border-rose-500 p-4 rounded mt-4 border-dashed text-lg flex flex-col gap-y-2">
        
        </div>
        
        </div>
        }   
    </div>
  )
}

export default HotelFoodItems
