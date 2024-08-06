import { useEffect, useRef, useState } from 'react'
import { useModal } from '../../../customhooks/zusthook'
import axios from 'axios'
import { backend_url, img_url } from '../../../server'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Switch } from '../../ui/switch'
import { IoWarning } from 'react-icons/io5'
import { Plus, X } from 'lucide-react'

const EditFoodItemModal = () => {
    const param = useParams()
    const { hotelId } = param
    const { type, data, isOpen,reloadCom } = useModal()
    const isModelOpen = isOpen && type === 'edit-food-item'

    const fileInputRef = useRef(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [loading, setloading] = useState(false)

    const [name, setName] = useState('')
    const [smallDescription, setSmallDescription] = useState('')
    const [description, setDescription] = useState('')
    const [veg, setVeg] = useState(false)
    const [price, setPrice] = useState(0)
    const [tag, setTag] = useState("")
    const [foodTypes, setFoodTypes] = useState([])

    useEffect(() => {
        if (data?.editFoodItem) {
            const item = data.editFoodItem
            setName(item.name)
            setSmallDescription(item?.smallDescription)
            setDescription(item.description)
            setVeg(item.veg)
            setPrice(item.price)
            setTag(item.tag)
            setFoodTypes(item.foodTypes)
        }

    }, [data?.editFoodItem])

    if (!isModelOpen) {
        return null
    }

    const handleImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setPreviewImage(e.target.files[0])
        }
    }

    const handletagkeydown = e => {
        if (e.keyCode === 13 && tag) {
            e.preventDefault()
            setFoodTypes([...foodTypes, tag])
            setTag('')
        } else if (e.keyCode === 32 && tag) {
            setFoodTypes([...foodTypes, tag])
            setTag('')
        } else if (e.keyCode === 8 && !tag && foodTypes.length > 0) {
            setFoodTypes(
                foodTypes.filter((item, i) => i != foodTypes.length - 1)
            )
        } else if (e.keyCode === 32 && !tag) {
            e.preventDefault()
        }
    }

    const handletagchange = e => {
        if (e.target.value != " ") {
            setTag(e.target.value)
        }
    }
    const handletagcancelbtn = ind => {
        setFoodTypes(foodTypes.filter((item, i) => i !== ind))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (price < 0) {
            return toast.warning("Please set the price")
        }
        setloading(true)
        try {
            let formdata = new FormData()
            let response
            const category=data.editFoodItem
            if (previewImage == null) {
                formdata.append('name', name)
                formdata.append('smallDescription', smallDescription)
                formdata.append('description', description)
                formdata.append('veg', veg)
                formdata.append('price', price)
                formdata.append('foodTypes', JSON.stringify(foodTypes))
                formdata.append('categoryId',category.foodCategoryId)
                response = await axios.patch(`${backend_url}/fooditem/${hotelId}/${data.editFoodItem._id}/update-item-without-image`, formdata, { withCredentials: true })
            } else {
                formdata.append('name', name)
                formdata.append('smallDescription', smallDescription)
                formdata.append('description', description)
                formdata.append('veg', veg)
                formdata.append('price', price)
                formdata.append('item-image', previewImage)
                formdata.append('foodTypes', JSON.stringify(foodTypes))
                formdata.append('categoryId',category.foodCategoryId)
                response = await axios.patch(`${backend_url}/fooditem/${hotelId}/${data.editFoodItem._id}/update-item-with-image`, formdata, { withCredentials: true })
            }
            if (response.data.success) {
                toast.success("Food Item updated successfully")
                  return reloadCom()
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setloading(false)
        }
    }
    const handleReset=()=>{
        setloading(true)
        try{
            const item = data.editFoodItem
            setName(item.name)
            setSmallDescription(item?.smallDescription)
            setDescription(item.description)
            setVeg(item.veg)
            setPrice(item.price)
            setTag(item.tag)
            setFoodTypes(item.foodTypes)
            setPreviewImage(null)
        }catch(error){
            toast.error(error.message)
        }finally{
            setloading(false)
        }
    }
    return (
        <div>
            {isModelOpen ? (
                <>
                    <div className='flex flex-col w-[550px] p-12 pt-2 pb-2'>
                        <div className='text-rose-500 text-2xl font-semibold mt-4 mb-4'>
                            Edit Food Item Info
                        </div>
                        <div className='w-full h-[2px] bg-rose-400 m-auto mb-4'></div>
                        <div>
                            <form
                            onSubmit={handleSubmit}
                                className='flex flex-col text-red-500 gap-y-1'
                                encType='multipart/form-data'
                            >
                                <div className='flex w-full'>
                                    <div
                                        onClick={() => fileInputRef.current.click()}
                                        className='m-auto shadow h-auto flex justify-between  border-2 border-rose-500 cursor-pointer rounded-xl bg-rose-50 shadow-rose-300'
                                    >
                                        {previewImage ? (
                                            <img
                                                className='transition-all h-auto rounded-xl border-2 border-white hover:opacity-90 shadow-sm'
                                                src={URL.createObjectURL(previewImage)}
                                            />
                                        ) : (
                                            <>
                                                {/* <div className='w-full m-7 flex justify-normal border-2 border-dashed border-rose-500 rounded-xl'>
                        <div className='transition-all m-auto p-6 flex justify-between items-center align-middle bg-rose-100  hover:opacity-95 shadow-sm rounded-full border-dashed border-2 border-rose-500'>
                          <Plus className='text-rose-500' size={40} />
                        </div>
                      </div> */}
                                                <div className='flex w-full'>
                                                    <img src={`${img_url}/${data?.editFoodItem.imageUrl}`} className='m-auto rounded-xl' />
                                                </div>
                                            </>
                                        )}
                                        <input
                                            className='hidden'
                                            type='file'
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept='.jpg,.jpeg,.png'
                                        />
                                    </div>
                                </div>
                                <div className=' font-semibold mt-3'>Food Name:</div>
                                <input
                                    type='text'
                                    placeholder='Enter the Food name'
                                    className='p-2 w-full text-rose-500 border border-rose-500 outline-rose-400 rounded  hover:border-rose-400 placeholder:text-rose-300 shadow'
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />

                                <div className=' font-semibold'>small description:</div>
                                <input
                                    type='text'
                                    placeholder='Enter the short description'
                                    className='p-2 w-full text-rose-500 border border-rose-500 outline-rose-400 rounded  hover:border-rose-400 placeholder:text-rose-300 shadow'
                                    required
                                    value={smallDescription}
                                    onChange={e => setSmallDescription(e.target.value)}
                                />

                                <div className=' font-semibold'>Food description:</div>
                                <input
                                    type='text'
                                    placeholder='Enter the Food description'
                                    className='p-2 w-full text-rose-400 border border-rose-500 outline-rose-300 rounded  hover:border-rose-400 placeholder:text-rose-300 shadow'
                                    required
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />

                                <div className='p-3 bg-white rounded border border-rose-500 mt-2 shadow'>
                                    <div className='flex justify-between'>
                                        <span className='pl-1 font-semibold'>Pure Veg</span>
                                        <Switch
                                            checked={veg}
                                            onCheckedChange={() => setVeg(!veg)}
                                            className='my-auto mr-1'
                                        />
                                    </div>
                                    <div className='w-[98%] m-auto bg-rose-400 h-[1px] mt-2'></div>
                                    <p className='pl-1 h-auto text-justify mt-2'>
                                        <IoWarning
                                            size={22}
                                            className='text-rose-500 inline mr-1'
                                        />
                                        sdhverevhjeruictnhuernt ernndb getryctrhertgyvtdfijeut
                                        ewtvgwueghc wet tuweuhcgew c
                                    </p>
                                </div>

                                <div className=' font-semibold mt-1'>Food Tags:</div>
                                <div className='border border-rose-500 focus:border-rose-500 outline-none rounded shadow'>
                                    <span className='flex w-full p-2 bg-transparent flex-wrap'>
                                        {foodTypes &&
                                            foodTypes.map((item, i) => {
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
                                            className='inline outline-0 border-0 p-1 focus-within:border-0 text-rose-500 rounded-xl outline-none  placeholder:text-rose-400'
                                            type='text'
                                            placeholder='Enter your foodtypes'
                                            onKeyDown={handletagkeydown}
                                            onChange={handletagchange}
                                            value={tag}
                                        />
                                    </span>
                                </div>

                                <div className=' font-semibold'>Food Price:</div>
                                <input
                                    type='number'
                                    pattern="\d+"
                                    placeholder='Enter the Role name'
                                    className='p-2 w-full text-rose-400 border border-rose-500 outline-rose-300 rounded  hover:border-rose-400 placeholder:text-rose-300 shadow'
                                    required
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />

                                <button
                                type='submit'
                                    disabled={loading ? true : false}
                                    className={`transition-all border border-rose-500 shadow p-2 bg-rose-500 rounded-xl text-white text-center mt-2 ${loading ? 'opacity-70 cursor-none' : 'hover:opacity-90'
                                        }`}
                                >
                                    Update Food Item
                                </button>
                                <button
                                   type="button"
                                    disabled={loading ? true : false}
                                    className={`transition-all border border-rose-500 shadow p-2 bg-white rounded-xl text-rose-500 text-center mb-4  ${loading ? 'opacity-70 cursor-none' : 'hover:opacity-90'
                                        }`}
                                        onClick={handleReset}
                                >
                                    Reset
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    )
}

export default EditFoodItemModal
