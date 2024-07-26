/* eslint-disable react/prop-types */
// import { useState } from 'react'
import { useModal } from '../../customhooks/zusthook'
import { Plus } from 'lucide-react'
import { useSelector } from 'react-redux'

const ProfileAddresses = () => {
  const { onOpen } = useModal()
  const { user } = useSelector(state => state.user)

  const columns = [
    {
      field:'country',
      headerName: 'Country',
      width: 100,
    },
    {
      field: 'state',
      headerName: 'state',
      width: 100
    },
    {
      field: 'city',
      headerName: 'city',
      width: 100
    },
    {
      field: 'address',
      headerName: 'address',
      width: 200
    },
    {
      field: 'zipCode',
      headerName: 'zipCode',
      width: 100
    }
  ]

  const rows = user.addresses.map((item, i) => {
    return { ...item, id: i }
  })

  return (
    <div className='p-10 pt-1'>
      <div className='flex justify-end p-2'>
        <span
          className='text-rose-500 transition-all duration-200 bg-rose-100 p-1 rounded cursor-pointer hover:bg-rose-200 font-extrabold'
          onClick={() => onOpen('add-address')}
        >
          <Plus size={25} />
        </span>
      </div>
      <div className='w-full h-[300px]'>
        <AddressHolder columns={columns} rows={rows} />
      </div>
    </div>
  )
}

const AddressHolder = ({ columns, rows }) => {
  // const [expand, setExpand] = useState(false)
  return (
    <>
      <div className='w-full flex flex-col'>
        <div className='w-full flex p-3 pl-4 border rounded-xl border-rose-400  shadow-sm'>
          {columns.map((item,i) => {
            return (
              <>
                <span className={`font-semibold text-rose-600`}
                style={{'width':item.width + 'px'}}
                key={i}
                >
                  {item.headerName}
                </span>
              </>
            )
          })}
        </div>
      </div>
      {rows.map((item, i) => {
        const index = 0
        return (
          <div
            className='w-full bg-transparent border rounded-xl border-rose-600 border-t-transparent shadow-sm flex p-3 pl-4'
            key={i}
          >
            {columns.map((product, i) => {
              const w=columns[index + i].width
              return (
                <>
                  <span
                  style={{'width':w}}
                    className={`text-rose-500`}
                  >{item[product.field]}</span>
                </>
              )
            })}

          </div>
        )
      })}
    </>
  )
}

export default ProfileAddresses
