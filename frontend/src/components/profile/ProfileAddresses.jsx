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
      width: 150,
    },
    {
      field: 'state',
      headerName: 'state',
      width: 150
    },
    {
      field: 'city',
      headerName: 'city',
      width: 150
    },
    {
      field: 'address',
      headerName: 'address',
      width: 250
    },
    {
      field: 'zipCode',
      headerName: 'zipCode',
      width: 150
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
      <div>
        <div className='w-full flex p-3 pl-4 border rounded-3xl border-rose-500  shadow-sm bg-gradient-to-tr from-rose-500 to-rose-400'>
          {columns.map((item,i) => {
            return (
              <>
                <span className={`bg-transparent rounded-3xl font-semibold text-white`}
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
            className='w-full bg-transparent border rounded-3xl bg-gradient-to-tr from-rose-500 to-rose-300 shadow-sm flex p-3 pl-4'
            key={i}
          >
            {columns.map((product, i) => {
              return (
                <>
                  <span
                    className={`w-[${columns[index + i].width}px] bg-transparent text-white`}
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
