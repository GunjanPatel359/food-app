import { useEffect, useState } from "react";
import AddAddressModal from "../components/profile/profilemodals/AddAddressModal";

export const ProfileModalProvider=()=>{
    const [isMounted,setIsMounted]=useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null 
    }

    return (
        <>
        <AddAddressModal/>
        </>
    )
}