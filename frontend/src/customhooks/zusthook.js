import { create } from 'zustand'

export const useModal = create((set) => ({
    type: null,
    data:null,
    reloadCmd:null,
    isOpen: false,
    onOpen:(type,data=null)=>set({ isOpen:true,type,data}),
    reloadCom:(data=null,reloadCmd=Date.now())=>set({isOpen:false,type:null,data,reloadCmd}),
    onClose:(data=null)=>set({ isOpen:false,type:null,data})
}))