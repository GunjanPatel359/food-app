/* eslint-disable react/prop-types */
import {
    useCallback,
    useEffect,
    useState,
    useRef
} from "react";

import "./temp.css"
export const DoubleScrollBar = ({ min, max, onChange }) => {

    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);


    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );


    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value); 

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    return (
        <div>

            <div className="flex items-center justify-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValRef}
                    onChange={(event) => {
                        const value = Math.min(+event.target.value, maxVal - 1);
                        setMinVal(value);
                        event.target.value = value.toString();
                    }}
                    className={`thumb z-[3] ${minVal > (max - 100) ? "z-[5]" : ""}`}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    ref={maxValRef}
                    onChange={(event) => {
                        const value = Math.max(+event.target.value, minVal + 1);
                        setMaxVal(value);
                        event.target.value = value.toString();
                    }}
                    className="thumb z-[4]"
                />

                <div className="relative w-[200px]">
                    <div className="absolute rounded-[3px] h-[5px] bg-slate-400 w-full z-[1]"></div>
                    <div ref={range} className="absolute rounded-[3px] h-[5px] bg-blue-700 z-[2]"></div>
                    <div className=" absolute text-black left-[6px] text-lg mt-20">{minVal}</div>
                    <div className=" absolute text-black right-[-4px] text-lg mt-20">{maxVal}</div>
                </div>
            </div>
        </div>
    );
}
