/* eslint-disable react/prop-types */

import { Plus } from "lucide-react"
import FoodItemBox from "./FoodItemBox"
import { useModal } from "../../customhooks/zusthook"

const CategoryBox = ({item}) => {
    const {onOpen}=useModal()
  return (
    <div className="bg-rose-50 border border-rose-500 p-4 rounded mt-4 border-dashed text-lg flex flex-col">
        <div className="flex justify-between">
      <div className="text-2xl font-semibold text-rose-500">{item.categoryName}</div>
      <div className="flex"><span className="text-white bg-rose-500 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={()=>onOpen("create-food-item",{addfooditem:item})}><Plus className="m-auto" size={24}/></span></div>
        </div>
      <div className="text-rose-400">
        {item.description}
      </div>
      {/* <div className="bg-rose-50 border border-rose-500 rounded mt-1 border-dashed text-lg flex flex-col"> */}
        {
          item && item.foodItemIds.map((item,i)=>{
                return (
                    <FoodItemBox key={i} item={item} />
                )
            })
        }
      {/* </div> */}
    </div>
  )
}

export default CategoryBox
