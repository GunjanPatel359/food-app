/* eslint-disable react/prop-types */
import SellerProfileHeader from '../../components/sellerprofile/SellerProfileHeader'
import { backend_url, img_url } from '../../server'
import axios from 'axios'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const SellerRestaurant = () => {
  const { hotelId } = useParams()
  const [isUserVerified, setIsUserVerified] = useState(false)
  const [hotel, setHotel] = useState('')
  const [previewImage,setPreviewImage]=useState('')
  const fileInputRef=useRef()
  useEffect(() => {
    const getUserHotel = async hotelId => {
      try {
        const res = await axios.get(
          `${backend_url}/seller/getsellerhotel/${hotelId}`,
          {
            withCredentials: true
          }
        )
        if (res.data.success) {
          setIsUserVerified(true)
          setHotel(res.data.hotel)
          setPreviewImage(res.data.hotel.imgUrl)
        }
      } catch (error) {
        toast.error(error)
      }
    }
    getUserHotel(hotelId)
  }, [isUserVerified, hotelId])
  const handleImageChange = async(e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const formData=new FormData()
        formData.append('updateHotelImage',e.target.files[0])
        const res=await axios.post(`${backend_url}/restaurant/updateImage/${hotelId}`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
            withCredentials:true,
        }) 
        console.log(res)
        if(res.data.success){
            setPreviewImage(res.data.filename)
        }
      } catch (error) {
        toast.error(error)
      }
    }
  }
  return (
    <div>
      {isUserVerified && hotel && (
        <>
          <SellerProfileHeader />
          <div className='flex mt-16 lg:mt-0'>
            <div className=' m-10 border border-rose-400 w-full flex rounded-xl shadow-xl shadow-rose-50 lg:m-32 p-2'>
              <div className='w-[50%] flex items-center'>
                <div className='w-full flex border border-rose-100'>
                  <form className='m-auto w-full'>
                    <img
                      className='m-auto w-auto transition-all'
                      src={`${img_url}/${previewImage}`}
                      onClick={() => fileInputRef.current.click()}
                    />
                    <input
                    className='hidden'
                    type='file'
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept='.jpg,.jpeg,.png'
                  />
                  </form>
                </div>
              </div>
              <div className='w-[50%]'>
                <HotelInfo
                  hotel={{
                    name: hotel.name,
                    addresses: hotel.addresses,
                    cusineTypes: hotel.cusineTypes
                  }}
                  setHotel={setHotel}
                  hotelId={hotelId}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const HotelInfo = ({ hotel ,setHotel,hotelId }) => {

    function deepEqual(obj1, obj2) {
        if (typeof obj1 !== 'object' || obj1 === null ||
            typeof obj2 !== 'object' || obj2 === null) {
          return obj1 === obj2;
        }
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
          return false;
        }
        for (const [key, value] of Object.entries(obj1)) {
          if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
            return false;
          }
          if (typeof value === 'object' && value !== null) {
            if (!deepEqual(value, obj2[key])) {
              return false;
            }
          } else {
            if (value !== obj2[key]) {
              return false;
            }
          }
        }
        return true;
      }

  const [name, setName] = useState(hotel.name)
  const [country, setCountry] = useState(hotel.addresses.country)
  const [state, setState] = useState(hotel.addresses.state)
  const [city, setCity] = useState(hotel.addresses.city)
  const [address, setAddress] = useState(hotel.addresses.address)
  const [zipCode, setZipcode] = useState(hotel.addresses.zipCode)
  const [tag, setTag] = useState("")
  const [cusineTypes, setCusionTypes] = useState(hotel.cusineTypes)

  const formdata = {
    name,
    addresses: {
      country,
      state,
      city,
      address,
      zipCode
    },
    cusineTypes
  }

  const handlezipkeychange = e => {
    const allowedKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 8, 13]
    if (allowedKeys.includes(e.keyCode)) {
      return
    } else {
      e.preventDefault()
    }
  }

  const handletagkeydown = e => {
    if (e.keyCode === 13 && tag) {
      e.preventDefault()
      setCusionTypes([...cusineTypes, tag])
      setTag('')
    } else if (e.keyCode === 32 && tag) {
      setCusionTypes([...cusineTypes, tag])
      setTag('')
    } else if (e.keyCode === 8 && !tag && cusineTypes.length > 0) {
      setCusionTypes(
        cusineTypes.filter((item, i) => i != cusineTypes.length - 1)
      )
    } else if (e.keyCode === 32 && !tag) {
      e.preventDefault()
    }
  }

  const handletagchange = e => {
    setTag(e.target.value)
  }

  const handletagcancelbtn = ind => {
    setCusionTypes(cusineTypes.filter((item, i) => i !== ind))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    if(deepEqual(formdata,hotel)){
        return 
    }
    try {
        const res=await axios.patch(`${backend_url}/seller/updaterestaurantinfo/${hotelId}`,{
            name,
            country,
            state,
            city,
            address,
            zipCode,
            cusineTypes
        },{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true
        })
        if(res.data.success){
            toast.success('Restaurant Info Updated Successfully')
            setHotel(res.data.hotel)
        }
    } catch (error) {
        toast.error(error)
    }
  }

  return (
    <>
      <form
        className='p-4'
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          columnGap: '10px',
          rowGap: '2px'
        }}
        onSubmit={handleSubmit}
      >
        <div className='flex'>
          <div className='m-auto mx-0 text-rose-500 font-bold'>
            Restaurant name:{' '}
          </div>
        </div>
        <input
          type='text'
          required
          placeholder='Enter your restaurant name'
          value={name}
          onChange={e => setName(e.target.value)}
          className='p-2 text-rose-500  rounded-xl outline-none focus:shadow-md  placeholder:text-rose-300 ml-2'
        />
        <div className='flex'>
          <div className='m-auto mx-0 text-rose-500 font-bold'>Country: </div>
        </div>
        <input
          type='text'
          required
          placeholder='Enter Country'
          value={country}
          onChange={e => setCountry(e.target.value)}
          className='p-2 text-rose-500  rounded-xl outline-none focus:shadow-md  placeholder:text-rose-300 ml-2'
        />
        <div className='flex'>
          <div className='m-auto mx-0 text-rose-500 font-bold'>State: </div>
        </div>
        <input
          type='text'
          required
          placeholder='Enter State'
          value={state}
          onChange={e => setState(e.target.value)}
          className='p-2 text-rose-500  rounded-xl outline-none focus:shadow-md  placeholder:text-rose-300 ml-2'
        />
        <div className='flex'>
          <div className='m-auto mx-0 text-rose-500 font-bold'>City: </div>
        </div>
        <input
          type='text'
          required
          placeholder='Enter City'
          value={city}
          onChange={e => setCity(e.target.value)}
          className='p-2 text-rose-500  rounded-xl outline-none focus:shadow-md  placeholder:text-rose-300 ml-2'
        />
        <div className='flex'>
          <div className='m-auto mx-0 text-rose-500 font-bold'>Address: </div>
        </div>
        <input
          type='text'
          placeholder='Enter your Restuarant address'
          required
          className='p-2 text-rose-500  rounded-xl outline-none focus:shadow-md  placeholder:text-rose-300 ml-2'
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <div className='flex'>
          <div className='m-auto mx-0 text-rose-500 font-bold'>zipcode: </div>
        </div>
        <input
          placeholder='Enter zipCode'
          type='text'
          required
          value={zipCode}
          onKeyDown={handlezipkeychange}
          onChange={e => setZipcode(e.target.value)}
          inputMode='numeric'
          pattern='[0-9]*'
          className='p-2 text-rose-500  rounded-xl outline-none focus:shadow-md  placeholder:text-rose-300 ml-2'
        />
        <div className='flex'>
          <div className='m-auto mx-0 text-rose-500 font-bold'>
            cusineTypes:{' '}
          </div>
        </div>
        <div className='p-2 text-rose-500  rounded-xl outline-none focus:shadow-md  placeholder:text-rose-300'>
          <span className='flex w-full p-2 bg-transparent flex-wrap shadow rounded-xl'>
            {cusineTypes &&
              cusineTypes.map((item, i) => {
                if (item === '') {
                  return null
                }
                return (
                  <span
                    key={i}
                    className='flex border rounded-xl border-rose-400 p-1 bg-rose-50 m-[1px] hover:bg-rose-100 shadow'
                  >
                    <span className=''>{item}</span>
                    <span className='flex justify-center align-middle items-center'>
                      <X
                        className='inline text-rose-500 h-full mt-[3px] ml-1 hover:text-rose-600 cursor-pointer'
                        size={14}
                        onClick={() => handletagcancelbtn(i)}
                      />
                    </span>
                  </span>
                )
              })}
            <input
              className='inline outline-0 border-0 p-1 focus-within:border-0 text-rose-500 rounded-xl outline-none  placeholder:text-rose-300'
              type='text'
              placeholder='Enter your cusineTypes'
              onKeyDown={handletagkeydown}
              onChange={handletagchange}
              value={tag}
            />
          </span>
        </div>
        <input
          className={`transition-all text-rose-400 border border-rose-400 ${
            deepEqual(formdata,hotel) ? '' : 'text-rose-500 hover:shadow-md cursor-pointer'
          }  p-2 rounded-xl font-semibold `}
          type='submit'
          value='Update'
        />
      </form>
    </>
  )
}

export default SellerRestaurant
