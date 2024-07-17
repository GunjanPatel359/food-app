import { useEffect, useRef, useState } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { addSeller } from '../../../redux/reducers/seller'
import { useDispatch, useSelector } from 'react-redux'
import { backend_url, img_url } from '../../../server'
import { toast } from 'react-toastify'
import axios from 'axios'

const SellerInfo = () => {

  const dispatch = useDispatch()
  const {seller}=useSelector((state)=>state.seller)
  
  const fileInputRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)
  const form=seller.name
  const [name,setName]=useState(seller.name)

  useEffect(()=>{
    setPreviewImage(seller.avatar)
  },[seller.avatar])

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newForm = new FormData();
      newForm.append('sellerimage', e.target.files[0]);
  
      axios.post(`${backend_url}/seller/setimage`, newForm, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }).then((res) => {
          toast.success(res.data);
          dispatch(addSeller(res.data.seller))
          setPreviewImage(res.data.seller.avatar)
        })
        .catch((err) => {
          if (err) {
            const errorMessage = err || 'An error occurred.';
            toast.error(errorMessage);
          } else {
            toast.error('Network error or other issue occurred.');
          }
        });
    }
  };
  return (
    <div className='flex flex-col w-full items-center justify-center mt-8'>
      <div
        className='w-40 h-40 rounded-full border-4 border-rose-400 flex items-center justify-center cursor-pointer'
        onClick={() => fileInputRef.current.click()}
      >
        <div className='w-full h-full border border-white rounded-full flex justify-center items-center'>

        {previewImage ? (
          <img
            className='text-rose-300 rounded-full hover:opacity-85 transition-all duration-300'
            alt=''
            src={`${img_url}/${previewImage}`}
          />
        ) : (
          <FaRegUser className='text-rose-300 hover:text-rose-400' size={85} />
        )}
        <input
          className='hidden'
          type='file'
          ref={fileInputRef}
          onChange={handleImageChange}
          id="sellerimage"
          accept=".jpg,.jpeg,.png"
          />
          </div>
      </div>

      <div className='mt-5'>
        <div>
          <form>
          <input
            placeholder='Your name'
            className='p-2 pl-5 rounded-full border-2 border-rose-500 text-rose-500 placeholder-rose-500 focus:border-rose-500 outline-none hover:border-rose-400 hover:text-rose-400 hover:focus:border-rose-400'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* <input placeholder='Your name' className='p-2 pl-5 rounded-full border-2 border-rose-500 text-rose-500 placeholder-rose-500 focus:border-rose-500 outline-none' /> */}
          <button className={`transition-all duration-300 ml-3 text-white py-2 px-4 rounded-xl hover:bg-rose-400 ${name===form?"bg-rose-400 opacity-85":" bg-rose-500 opacity-100"}`}>
            Change name
          </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default SellerInfo
