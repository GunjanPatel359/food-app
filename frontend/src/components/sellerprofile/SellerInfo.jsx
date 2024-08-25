import { useEffect, useRef, useState } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { addSeller } from '../../redux/reducers/seller'
import { useDispatch, useSelector } from 'react-redux'
import { backend_url, img_url } from '../../server'
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
        console.log(res)
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
        className='w-40 h-40 rounded-full border-4 border-color4 flex items-center justify-center cursor-pointer'
        onClick={() => fileInputRef.current.click()}
      >
        <div className='w-full h-full border border-white rounded-full flex justify-center items-center'>

        {previewImage ? (
          <img
            className='text-color3 rounded-full hover:opacity-85 transition-all duration-300'
            alt=''
            src={`${img_url}/${previewImage}`}
          />
        ) : (
          <FaRegUser className='text-color3 hover:text-color4' size={85} />
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
            className='p-2 pl-5 rounded-full border-2 border-color5 text-color5 placeholder-color5 focus:border-color5 outline-none hover:border-color4 hover:text-color4 hover:focus:border-color4'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* <input placeholder='Your name' className='p-2 pl-5 rounded-full border-2 border-color5 text-color5 placeholder-color5 focus:border-color5 outline-none' /> */}
          <button className={`transition-all duration-300 ml-3 text-white py-2 px-4 rounded-xl hover:bg-color4 ${name===form?"bg-color4 opacity-85":" bg-color5 opacity-100"}`}>
            Change name
          </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default SellerInfo
