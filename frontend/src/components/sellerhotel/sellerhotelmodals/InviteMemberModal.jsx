import { useEffect, useState } from 'react'
import { useModal } from '../../../customhooks/zusthook'

import { CiWarning } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import { MdCancel, MdOutlineWhatsapp } from 'react-icons/md'
import { RiFacebookCircleLine } from 'react-icons/ri'
import { HiChevronRight } from 'react-icons/hi'
import { FaRegCircleUser } from 'react-icons/fa6'
import { GoDotFill } from 'react-icons/go'
import { PlusCircle } from 'lucide-react'
import { GoPaperclip } from 'react-icons/go'
import { AiOutlineCheckCircle } from 'react-icons/ai'

import { backend_url, img_url } from '../../../server'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const InviteMemberModal = () => {
  const { seller } = useSelector((state) => state.seller)
  const params = useParams()
  const { hotelId } = params
  const { isOpen, type, data, onlyReloadCom, onClose } = useModal()
  const isModelOpen = isOpen && type === 'invite-member'

  const [openArrow, setOpenArrow] = useState(false)
  const [usingId, setUsingId] = useState(false)
  const [query, setQuery] = useState('')
  const [resultBoxOpen, setResultBoxOpen] = useState(false)
  const [searchResult, setSearchResult] = useState('')
  const [searchError, setSearchError] = useState('')

  const [item, setItem] = useState()
  const [roleMembers, setRoleMembers] = useState([])

  useEffect(() => {
    const roleMembers = async () => {
      try {
        const response = await axios.get(
          `${backend_url}/member/${data?.inviteRole._id}/${hotelId}/members-sellerid`,
          { withCredentials: true }
        )
        if (response.data.success) {
          setRoleMembers(response.data.members)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
    if (data) {
      if (data?.inviteRole) {
        setItem(data.inviteRole)
        roleMembers()
      }
    }
  }, [data, hotelId])

  if (!isModelOpen) {
    return null
  }

  const handleMemberNameSearch = async e => {
    setQuery(e.target.value)
    if (query.length < 2) {
      setResultBoxOpen(false)
      setSearchResult('')
      return setSearchError('please provide more than two characters')
    }
    setResultBoxOpen(true)
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
    if (e.target.value.length > 24) {
      setResultBoxOpen(true)
      setSearchResult('')
      return setSearchError('id length should 24 character')
    }
    if (e.target.value.length != 24) {
      setResultBoxOpen(false)
      setSearchResult('')
      return setSearchError('id length should 24 character')
    }
    setResultBoxOpen(true)
    try {
      const response = await axios.get(
        `${backend_url}/seller/search/invitesellerwithid?query=${e.target.value}`,
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

  const addMember = async (id) => {
    try {
      const response = await axios.post(`${backend_url}/member/${hotelId}/add-members`, { roleId: data.inviteRole._id, sellerId: id }, { withCredentials: true })
      if (response.data.success) {
        setRoleMembers((rest) => [...rest, id]);
        toast.success(response.data.message)
        onlyReloadCom()
      }
      if (!response.data.success) {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const removeMember = async (id) => {
    try {
      const response = await axios.post(`${backend_url}/member/remove-member/${hotelId}`, { roleId: data.inviteRole._id, sellerId: id }, { withCredentials: true })
      if (response.data.success) {
        setRoleMembers((rest) => rest.filter(memberId => memberId != id));
        toast.success(response.data.message)
        onlyReloadCom()
      }
      if (!response.data.success) {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div>
      {isModelOpen && (
        <>
          {item && (
            <div className='w-[550px] p-4 px-10 pt-7  '>
              <div className=''>
                <div className='relative'>
                    <MdCancel className='cursor-pointer absolute -right-6 -top-2 text-white bg-color5 rounded-full' onClick={() => onClose()} size={25} />
                </div>
                <div className='font-semibold text-2xl text-color5 mb-3'>
                  Invite Member
                </div>
                <div className='w-full h-[2px] bg-color5 mb-3'></div>
                <div className='mb-2'>
                  <CiWarning className='mr-1 inline' size={22} />{' '}
                  <span className='underline font-semibold text-color5'>
                    {item.roleName}
                  </span>{' '}
                  role will be assigned to invited member
                </div>

                <div className='flex'>
                  <div className='w-full border border-color4 outline-color4 rounded-full flex hover:border-color4 p-2 rounded-tr-none rounded-br-none'>
                    <IoSearch
                      className='inline mr-[7px] ml-[6px] m-auto translate-y-[1px]'
                      size={18}
                    />
                    {usingId ? (
                      <>
                        <input
                          type='text'
                          placeholder='Enter member unique Id'
                          className='text-color5 placeholder:text-color4 focus:outline-none inline w-full'
                          value={query}
                          onChange={handleMemberIdSearch}
                        // onClick={() => setResultBoxOpen(true)}
                        />
                        {resultBoxOpen && (
                          <div className='absolute bg-white border border-color5 p-4 px-6 rounded shadow shadow-color3 translate-x-7 translate-y-9 w-[400px]'>
                            <div className='font-semibold'>Search Result</div>
                            <div className='w-full h-[1px] bg-color5 mt-1 mb-2'></div>
                            {searchResult ? (
                              (data?.ownerId != searchResult._id) ?
                                <>
                                  <div className='flex border border-color5 p-2 justify-between rounded shadow'>
                                    <div className='flex'>
                                      <div className='my-auto cursor-pointer'>
                                        {searchResult.avatar ? (
                                          <img
                                            src={`${img_url}/${searchResult.avatar}`}
                                            className='rounded-full w-[40px]'
                                          />
                                        ) : (
                                          <FaRegCircleUser size={40} />
                                        )}
                                      </div>
                                      <div className='flex flex-col ml-2'>
                                        <div className='font-semibold'>
                                          {searchResult._id}
                                        </div>
                                        <div className='text-sm'>{searchResult.email}</div>
                                      </div>
                                    </div>
                                    <div className='flex mr-1'>
                                      {roleMembers.length >= 0 && roleMembers.includes(item._id) ? (
                                        <>
                                          <AiOutlineCheckCircle
                                            className='m-auto cursor-pointer'
                                            size={30}
                                            onClick={() => removeMember(item._id)}
                                          />
                                        </>
                                      ) : (
                                        <>
                                          <PlusCircle
                                            className='m-auto cursor-pointer'
                                            size={30}
                                            onClick={() => addMember(item._id)}
                                          />
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                                : <>
                                  <div className='mt-3 text-color5 text-justify'>
                                    * cannot perform any task on owner of this restaurant
                                  </div>
                                </>
                            ) : (
                              <>
                                {searchError && (
                                  <div className='mt-3 text-color5'>
                                    * {searchError}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type='text'
                          placeholder='Enter member email address or name'
                          className='text-color5 placeholder:text-color4 focus:outline-none inline w-full'
                          value={query}
                          onChange={handleMemberNameSearch}
                        // onClick={() => setResultBoxOpen(true)}
                        />
                        {resultBoxOpen && (
                          <div className='absolute bg-white border border-color5 p-4 px-6 rounded shadow shadow-color3  translate-y-9 w-[420px] max-h-[250px] overflow-scroll'>
                            <div className='font-semibold'>Search Result</div>
                            <div className='w-full h-[1px] bg-color5 mt-1'></div>
                            {searchResult ? (
                              <>
                                <div className='mt-2 flex flex-col gap-y-2'>
                                  {searchResult.map((item, i) => {
                                    if (data?.ownerId == item._id || seller._id == item._id) {
                                      return null
                                    }
                                    return (
                                      <div
                                        key={i}
                                        className='flex border border-color5 p-2 justify-between rounded shadow'
                                      >
                                        <div className='flex'>
                                          <div className='my-auto cursor-pointer'>
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
                                          {roleMembers.length >= 0 && roleMembers.includes(item._id) ? (
                                            <>
                                              <AiOutlineCheckCircle
                                                className='m-auto cursor-pointer'
                                                size={30}
                                                onClick={() => removeMember(item._id)}
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <PlusCircle
                                                className='m-auto cursor-pointer'
                                                size={30}
                                                onClick={() => addMember(item._id)}
                                              />
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </>
                            ) : (
                              <>
                                {searchError && (
                                  <div className='mt-3 text-color5'>
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
                  <div className='border border-color5 rounded-tr-full rounded-br-full'>
                    <HiChevronRight
                      size={22}
                      className={`transition-all inline m-2 translate-y-[1px] ${openArrow ? 'rotate-90' : ''
                        } cursor-pointer`}
                      onClick={() => setOpenArrow(!openArrow)}
                    />
                    <div
                      className={`transition-all absolute flex flex-col bg-white p-2 rounded-2xl border border-color3 shadow ${openArrow ? 'visible' : 'invisible -translate-y-2'
                        }`}
                    >
                      <div
                        className='p-2 cursor-pointer'
                        onClick={() => {
                          setOpenArrow(false)
                          setUsingId(true)
                          setQuery('')
                          setSearchResult('')
                          setResultBoxOpen(false)
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
                      <div className='w-[90%] m-auto h-[1px] bg-color0'></div>
                      <div
                        className='p-2 cursor-pointer'
                        onClick={() => {
                          setOpenArrow(false)
                          setUsingId(false)
                          setQuery('')
                          setSearchResult('')
                          setResultBoxOpen(false)
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
                <div className='w-full h-[0.1px] border border-color3 mt-5'></div>

                <div className='flex justify-between mt-2'>
                  Share Invite link
                  <div>
                    <MdOutlineWhatsapp
                      size={22}
                      className='inline cursor-pointer'
                    />
                    <RiFacebookCircleLine
                      size={22}
                      className='inline cursor-pointer'
                    />
                    <GoPaperclip size={20} className='inline cursor-pointer' />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InviteMemberModal
