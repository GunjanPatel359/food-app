import { IoFastFoodOutline } from "react-icons/io5";
import { 
    Command, 
    CommandDialog, 
    CommandInput
} from "../ui/command";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div 
    className="bg-red-400 flex p-5 items-center text-white h-[80px] justify-evenly w-full">
    <span className="flex text-4xl gap-x-4">
      <IoFastFoodOutline
      size={40}
      color="white"
      />
      <span>Taste</span>
    </span>
    <span className="text-center items-center">
        <Command
        className="bg-white text-red-500 rounded w-[300px]"
        >
            <CommandInput 
            placeholder="Enter the shop or dish name"/>
        </Command>
    </span>
    <span className="">
        <ul className="flex gap-x-1 items-center text-center text-lg">
            <Link to="">
            <Button className="hover:text-red-500 hover:bg-white text-md rounded-[5px] transition duration-300 p-3">Home</Button>
            </Link>
            <Link to="">
            <Button className="hover:text-red-500 hover:bg-white text-md rounded-[5px] transition duration-300 p-3">Resturants</Button>
            </Link>
            <Link to="">
            <Button className="hover:text-red-500 hover:bg-white text-md rounded-[5px] transition duration-300 p-3">Dishes</Button>
            </Link>
            <Link to="">
            <Button className="hover:text-red-500 hover:bg-white text-md rounded-[5px] transition duration-300 p-3">Contact Us</Button>
            </Link>
        </ul>
    </span>
    </div>
  )
}

export default Header
