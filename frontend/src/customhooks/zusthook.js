import { create } from 'zustand'

export const useModal = create((set) => ({
    type: null,
    data:null,
    isOpen: false,
    onOpen:(type,data=null)=>set({ isOpen:true,type,data}),
    onClose:(data=null)=>set({ isOpen:false,type:null,data})
}))