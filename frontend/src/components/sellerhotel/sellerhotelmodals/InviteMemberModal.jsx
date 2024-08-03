import { useState } from 'react'
import { useModal } from '../../../customhooks/zusthook'

import { CiWarning } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import { MdOutlineWhatsapp } from 'react-icons/md'
import { RiFacebookCircleLine } from 'react-icons/ri'
import { HiChevronRight } from 'react-icons/hi'
import { FaRegCircleUser } from 'react-icons/fa6'
import { GoDotFill } from 'react-icons/go'
import { PlusCircle } from 'lucide-react'

import { backend_url, img_url } from '../../../server'
import axios from 'axios'

const InviteMemberModal = () => {
  const { isOpen, type, data } = useModal()
  const isModelOpen = isOpen && type === 'invite-member'
  const {item}= data

  const [openArrow, setOpenArrow] = useState(false)
  const [usingId, setUsingId] = useState(false)
  const [query, setQuery] = useState('')
  const [resultBoxOpen, setResultBoxOpen] = useState(false)
  const [searchResult, setSearchResult] = useState('')
  const [searchError, setSearchError] = useState('')

  const handleMemberNameSearch = async e => {
    setQuery(e.target.value)
    setResultBoxOpen(true)
    if (query.length < 2) {
      setSearchResult('')
      return setSearchError('please provide more than two characters')
    }
    try {
      const response = await axios.get(
        `${backend_url}/seller/search/inviteseller?query=${query}`,
        { withCredentials: true }
      )
      if (response.data.success) {
        setSearchResult(response.data.data)
      }
      if (!response.data.success) {
        setSearchError('no result found')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleMemberIdSearch = async e => {
    setQuery(e.target.value)
    setResultBoxOpen(true)
    if (query.length != 24) {
      setSearchResult('')
      return setSearchError('id length should 24 character')
    }
    try {
      const response = await axios.get(
        `${backend_url}/seller/search/invitesellerwithid?query=${query}`,
        { withCredentials: true }
      )
      if (response.data.success) {
        setSearchResult(response.data.data)
      }
      if (!response.data.success) {
        setSearchError('no result found')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      {isModelOpen && (
        <>
          <div className='w-[550px] p-4 px-10 pt-7'>
            <div>
              <div className='font-semibold text-2xl text-rose-600 mb-3'>
                Invite Member
              </div>
              <div className='w-full h-[2px] bg-rose-500 mb-3'></div>
              <div className='mb-2'>
                <CiWarning className='mr-1 inline' size={22} />{' '}
                <span className='underline font-semibold text-rose-500'>
                  {item.roleName}
                </span>{' '}
                role will be assigned to invited member
              </div>
              
              <div className='flex'>
                <div className='w-full border border-rose-400 outline-rose-400 rounded-full flex hover:border-rose-400 p-2 rounded-tr-none rounded-br-none'>
                  <IoSearch
                    className='inline mr-[7px] ml-[6px] m-auto translate-y-[1px]'
                    size={18}
                  />
                  {usingId ? (
                    <>
                      <input
                        type='text'
                        placeholder='Enter member unique Id'
                        className='text-rose-500 placeholder:text-rose-400 focus:outline-none inline w-full'
                        value={query}
                        onChange={handleMemberIdSearch}
                        onClick={() => setResultBoxOpen(true)}
                      />
                      {resultBoxOpen && (
                        <div className='absolute bg-white border border-rose-500 p-4 px-6 rounded shadow shadow-rose-300 translate-x-7 translate-y-9 w-[400px]'
                        >
                          <div className='font-semibold'>Search Result</div>
                          <div className='w-full h-[1px] bg-rose-500 mt-1'></div>
                          {searchResult && (
                              <div
                                className='flex border border-rose-500 p-2 justify-between rounded shadow'
                              >
                                <div className='flex'>
                                  <div className='my-auto'>
                                    {item.avatar ? (
                                      <img
                                        src={`${img_url}/${item.avatar}`}
                                        className='rounded-full w-[40px]'
                                      />
                                    ) : (
                                      <FaRegCircleUser size={40} />
                                    )}
                                  </div>
                                  <div className='flex flex-col ml-2'>
                                    <div className='font-semibold'>
                                      {item.name}
                                    </div>
                                    <div className='text-sm'>{item.email}</div>
                                  </div>
                                </div>
                                <div className='flex mr-1'>
                                  <PlusCircle className='m-auto' size={30} />
                                </div>
                              </div>
                          ) 
                          }
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type='text'
                        placeholder='Enter member email address or name'
                        className='text-rose-500 placeholder:text-rose-400 focus:outline-none inline w-full'
                        value={query}
                        onChange={handleMemberNameSearch}
                        onClick={() => setResultBoxOpen(true)}
                      />
                      {resultBoxOpen && (
                        <div className='absolute bg-white border border-rose-500 p-4 px-6 rounded shadow shadow-rose-300  translate-y-9 w-[420px] max-h-[250px] overflow-scroll'>
                          <div className='font-semibold'>Search Result</div>
                          <div className='w-full h-[1px] bg-rose-500 mt-1'></div>
                          {searchResult ? (
                            <>
                              <div className='mt-2 flex flex-col gap-y-2'>
                                {searchResult.map((item, i) => {
                                  return (
                                    <div
                                      key={i}
                                      className='flex border border-rose-500 p-2 justify-between rounded shadow'
                                    >
                                      <div className='flex'>
                                        <div className='my-auto'>
                                          {item.avatar ? (
                                            <img
                                              src={`${img_url}/${item.avatar}`}
                                              className='rounded-full w-[40px]'
                                            />
                                          ) : (
                                            <FaRegCircleUser size={40} />
                                          )}
                                        </div>
                                        <div className='flex flex-col ml-2'>
                                          <div className='font-semibold'>
                                            {item.name}
                                          </div>
                                          <div className='text-sm'>
                                            {item.email}
                                          </div>
                                        </div>
                                      </div>
                                      <div className='flex mr-1'>
                                        <PlusCircle
                                          className='m-auto'
                                          size={30}
                                        />
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </>
                          ) : (
                            <>
                              {searchError && (
                                <div className='mt-3 text-rose-600'>
                                  * {searchError}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className='border border-rose-500 rounded-tr-full rounded-br-full'>
                  <HiChevronRight
                    size={22}
                    className={`transition-all inline m-2 translate-y-[1px] ${
                      openArrow ? 'rotate-90' : ''
                    } `}
                    onClick={() => setOpenArrow(!openArrow)}
                  />
                  <div
                    className={`transition-all absolute flex flex-col bg-white p-2 rounded-2xl border border-rose-300 shadow ${
                      openArrow ? 'visible' : 'invisible -translate-y-2'
                    }`}
                  >
                    <div
                      className='p-2'
                      onClick={() => {
                        setOpenArrow(false)
                        setUsingId(true)
                        setQuery('')
                        setSearchError('')
                      }}
                    >
                      {usingId ? (
                        <GoDotFill size={20} className='inline' />
                      ) : (
                        <span className='ml-[20px]'></span>
                      )}
                      find with unique ID
                    </div>
                    <div className='w-[90%] m-auto h-[1px] bg-rose-50'></div>
                    <div
                      className='p-2'
                      onClick={() => {
                        setOpenArrow(false)
                        setUsingId(false)
                        setQuery('')
                        setSearchError('')
                      }}
                    >
                      {!usingId ? (
                        <GoDotFill size={20} className='inline' />
                      ) : (
                        <span className='ml-[20px]'></span>
                      )}
                      find with name or email
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full h-[0.1px] border border-rose-300 mt-5'></div>

              <div className='flex justify-between mt-2'>
                Share Invite link
                <div>
                  <MdOutlineWhatsapp size={22} className='inline' />
                  <RiFacebookCircleLine size={22} className='inline' />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default InviteMemberModal
