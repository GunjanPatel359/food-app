import { useState } from 'react'
import { useModal } from '../../../customhooks/zusthook'
import { toast } from 'react-toastify'
import axios from 'axios'
import { backend_url } from '../../../server'
import { useParams } from 'react-router-dom'

const CreateFoodCategoryModal = () => {
  const params = useParams()
  const { hotelId } = params
  const { isOpen, type, reloadCom,onClose } = useModal()
  const isModelOpen = isOpen && type === 'create-food-category'
  const [categoryName, setCategoryName] = useState('')
  const [description, SetDescription] = useState('')

  if(!isModelOpen){
    return null
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      const response=await axios.post(`${backend_url}/category/${hotelId}/create-category`,{categoryName,description},{withCredentials:true})
      if(response.data.success){
        return reloadCom()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  return (
    <>
      {isModelOpen && (
        <>
          <div className='w-[550px] p-4 px-10 pt-7'>
            <div>
              <div className='font-semibold text-2xl text-color5 mb-3'>
                Create Category
              </div>
              <div className='w-full h-[2px] bg-color5 mb-3'></div>
              <div>
                <form className='flex flex-col gap-1' onSubmit={handleSubmit}>
                <div className=' font-semibold'>Category Name:</div>
                <input
                  type='text'
                  placeholder='Enter the category name'
                  className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
                  required
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                />

                <div className=' font-semibold'>Category Description:</div>
                <input
                  type='text'
                  placeholder='Enter the category description'
                  className='p-2 w-full text-color5 border border-color1 outline-color3 rounded  hover:border-color4 placeholder:text-color3 mb-1'
                  required
                  value={description}
                  onChange={e => SetDescription(e.target.value)}
                />
                <button type='submit' className='w-full bg-color5 text-white p-2 rounded hover:opacity-90'>Create Category</button>
                <button type='button' className='w-full bg-white text-color5 p-2 rounded border border-color5 hover:opacity-90' onClick={()=>onClose()}>Cancel</button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default CreateFoodCategoryModal
