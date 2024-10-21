/* eslint-disable react/prop-types */
import "./oneWayScrollBar.css"
const OneWayScrollBar = ({max,min,value,onChange,step}) => {
  return (
    <div className="absoulte">
      {/* <input type="range" max={50} min={0} value={minimumRating} onChange={(e) => { setMinimumRating(e.target.value) }} className="cursor-pointer" /> */}
      <input className="cursor-pointer slider w-full" type="range" step={step} max={max} min={min} value={value}  onChange={onChange} />
    </div>
  )
}

export default OneWayScrollBar
