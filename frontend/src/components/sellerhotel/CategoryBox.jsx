/* eslint-disable react/prop-types */

import { Plus } from "lucide-react"
import FoodItemBox from "./FoodItemBox"
import { useModal } from "../../customhooks/zusthook"
import { MdDeleteForever, MdEdit } from "react-icons/md"

const CategoryBox = ({ item, role }) => {
  const { onOpen } = useModal()
  return (
    <div className="bg-color0 border border-color5 p-4 rounded mt-4 border-dashed text-lg flex flex-col shadow-lg">
      <div className="flex justify-between">
        <div className="text-2xl font-semibold text-color5">{item.categoryName}</div>
        <div className="flex gap-2">
          <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen("create-food-item", { addfooditem: item })}>
            <Plus className="m-auto" size={24} />
          </span>
          <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen('edit-food-category',{categoryItem:item})}>
            <MdEdit className="m-auto" size={24} />
          </span>
          <span className="text-white bg-color5 rounded w-[32px] items-center flex shadow cursor-pointer hover:opacity-90" onClick={() => onOpen('Delete-Food-Category',{categoryDelete:item})}>
            <MdDeleteForever className="m-auto" size={24} />
          </span>
          
        </div>
      </div>
      <div className="text-color4">
        {item.description}
      </div>
      {/* <div className="bg-color0 border border-color5 rounded mt-1 border-dashed text-lg flex flex-col"> */}
      {
        item && item.foodItemIds.map((item, i) => {
          return (
            <FoodItemBox key={i} item={item} role={role} />
          )
        })
      }
      {/* </div> */}
    </div>
  )
}

export default CategoryBox
