import { create } from 'zustand'

export const useModal = create((set) => ({
    type: null,
    isOpen: false,
    onOpen:(type)=>set({ isOpen:true,type}),
    onClose:()=>set({ isOpen:false,type:null})
}))