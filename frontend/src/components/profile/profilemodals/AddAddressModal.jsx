/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useModal } from '../../../customhooks/zusthook'

import { Country, State, City } from 'country-state-city'

import { MdCancel } from 'react-icons/md'

import {
  Select,
  SelectItem,
  SelectLabel,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectGroup
} from '../../ui/select'

import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'

import { toast } from 'react-toastify'
import { Button } from '../../ui/button'
import axios from 'axios'
import { backend_url } from '../../../server'
import { addUser } from '../../../redux/reducers/user'
import { useDispatch } from 'react-redux'

const Transition = ({ children, show, duration = 500, easing = 'ease-in' }) => {
  const className = `fixed inset-0 width-[100%] height-[100%] flex justify-center items-center transition-all duration-${duration} ease-${easing} ${
    show ? 'backdrop-brightness-50 opacity-100 visible' : 'backdrop-brightness-100 opacity-0 invisible'
  }`;

  return (
    <div className={className}>
      <div className={`transition-all ease-${easing} duration-${duration} w-[450px] flex flex-col bg-gradient-to-tr from-color5 to-color4 border-2 border-color2 text-white shadow-2xl rounded-xl ${show?"scale-100 opacity-100":"scale-125 opacity-0"}`}>
        {children}  
      </div>
    </div>
  );
};

const AddAddressModal = () => {
  const dispatch = useDispatch()
    const { isOpen, type, onClose } = useModal()
    const isModalOpen = isOpen && type === 'add-address'
  
    const [mcountry, setCountry] = useState('')
    const [mstate, setState] = useState('')
    const [city, setCity] = useState('')
    const [address, setAddress] = useState('')
    const [zipCode, setZipCode] = useState()
  
    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden' 
      } else {
        document.body.style.overflow = '' 
      }
  
      return () => {
        document.body.style.overflow = '' 
      }
    }, [isModalOpen])
  
    if (!isModalOpen) {
      return <Transition show={isModalOpen}></Transition>
    }
  
    const closeModal = () => {
      onClose()
    }
  
    const handleSubmit = async e => {
      e.preventDefault()
      if (!mcountry || !mstate || !city || !address || !zipCode) {
        return toast.error('Please fill all the required fields')
      }
      const country = Country.getCountryByCode(mcountry).name
      const state = State.getStateByCodeAndCountry(mstate,mcountry).name
      if (zipCode.length !== 6) {
        return toast.error('invalid zipcode')
      }
      try {
        const res = await axios.patch(
          `${backend_url}/user/add-address`,
          {
            country,
            state,
            city,
            address,
            zipCode
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        )
        if (res.status === 200 || res.status === 201) {
          dispatch(addUser(res.data.user))
          toast.success('Address added successfully')
          onClose()
        } else {
          return toast.error(res.data.message)
        }
      } catch (err) {
        return toast.error(err.response.data.message)
      }
    }

  return (
    <Transition show={isModalOpen}>
           <div className='flex justify-end text-right pr-3 pt-3'>
             <MdCancel className='cursor-pointer' onClick={() => closeModal()} size={25} />
           </div>
           <div className='p-6 pt-0 gap-y-1 flex flex-col'>
             <div className='text-center text-white text-xl mb-3'>Add Address</div>
             <Select
              onValueChange={value => setCountry(value)}
              className='border-2 rounded-xl'
              required
            >
              <SelectTrigger className='w-full mb-2 border-2 rounded-3xl shadow-lg'>
                <SelectValue placeholder='* Select Your Country' />
              </SelectTrigger>
              <SelectContent className='bg-gradient-to-tr from-color5 to-color4 text-white rounded-2xl'>
                <SelectGroup className=' bg-gradient-to-tr from-color5 to-color4 gap-y-3 border-transparent rounded-2xl'>
                  <SelectLabel className='text-rose-950'>
                    ----Country----
                  </SelectLabel>
                  {Country.getAllCountries().map((item, i) => {
                    return (
                      <SelectItem
                        className='text-white bg-transparent'
                        key={i}
                        value={item.isoCode}
                      >
                        {item.name}
                      </SelectItem>
                    )
                  })
                  }
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              onValueChange={value => setState(value)}
              className='border-2 rounded-xl'
              required
            >
              <SelectTrigger className='w-full mb-2 border-2 rounded-3xl shadow-lg'>
                <SelectValue placeholder='* Select a State' />
              </SelectTrigger>
              <SelectContent className='bg-gradient-to-tr from-color5 to-color4 text-white rounded-2xl'>
                <SelectGroup className=' bg-gradient-to-tr from-color5 to-color4 gap-y-3 border-transparent rounded-2xl'>
                  <SelectLabel className='text-rose-950'>
                    ----State----
                  </SelectLabel>
                  {mcountry &&
                    State.getStatesOfCountry(mcountry).map((item, i) => {
                      return (
                        <SelectItem
                          className='text-white bg-transparent'
                          key={i}
                          value={item.isoCode}
                        >
                          {item.name}
                        </SelectItem>
                      )
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              onValueChange={value => setCity(value)}
              className='border-2 rounded-xl'
              required
            >
              <SelectTrigger className='w-full mb-2 border-2 rounded-3xl shadow-lg'>
                <SelectValue placeholder='* Select a city' />
              </SelectTrigger>
              <SelectContent className='bg-gradient-to-tr from-color5 to-color4 text-white rounded-2xl'>
                <SelectGroup className=' bg-gradient-to-tr from-color5 to-color4 gap-y-3 border-transparent rounded-2xl'>
                  <SelectLabel className='text-rose-950'>
                    ----City----
                  </SelectLabel>
                  {mcountry &&
                    mstate &&
                    City.getCitiesOfState(mcountry, mstate).map((item, i) => {
                      return (
                        <SelectItem
                          className='text-white bg-transparent'
                          key={i}
                          value={item.name}
                        >
                          {item.name}
                        </SelectItem>
                      )
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Textarea
              className='mb-2 p-4 border-2 rounded-3xl shadow-lg'
              onChange={e => {
                setAddress(e.target.value)
              }}
              placeholder='* Enter your address'
              required
            />
            <Input
              className='mb-3 border-2 rounded-3xl shadow-lg'
              placeholder='* Enter your zipcode'
              type='number'
              onChange={e => setZipCode(e.target.value)}
              required
            />

            <Button
              className='bg-white text-color5 border border-color5 rounded-3xl py-1 shadow-lg hover:bg-color0 hover:shadow-xl w-full'
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
    </Transition>
  );
};

export default AddAddressModal 