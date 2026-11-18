import { useEffect, useState } from "react";
import "../styles/priceFilter.css";

interface PriceRangeFilterProps {
    min: number | undefined;
    max: number | undefined;
    minLimit: number;
    maxLimit: number;
    onChange: (min: number, max: number) => void;
}

const PriceRangeFilter = ({ min, max, minLimit, maxLimit, onChange }: PriceRangeFilterProps) => {
    
    const [minVal, setMinVal] = useState<number>(minLimit);
    const [maxVal, setMaxVal] = useState<number>(maxLimit);
    const [minInput, setMinInput] = useState<number>(minLimit);
    const [maxInput, setMaxInput] = useState<number>(maxLimit);


    const [isDragging, setIsDragging] = useState(false);
    const minGap = 5;

    const slideMin = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value >= minLimit && maxVal - value >= minGap) {
            setMinVal(value);
            setMinInput(value);
            onChange(value, maxVal);
        }
    };

    const slideMax = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value <= maxLimit && value - minVal >= minGap) {
            setMaxVal(value);
            setMaxInput(value);
            onChange(minVal, value);
        }
    };

    const minPercent = ((minVal - minLimit) / (maxLimit - minLimit)) * 100;
    const maxPercent = ((maxVal - maxLimit) / (maxLimit - minLimit)) * 100;

    useEffect(() => {
        const safeMin = Math.max(minLimit, Math.min(min ?? minLimit, maxLimit));
        const safeMax = Math.max(safeMin, Math.min(max ?? maxLimit, maxLimit));

        setMinVal(safeMin);
        setMaxVal(safeMax);
        setMinInput(safeMin);
        setMaxInput(safeMax);

        onChange(safeMin, safeMax);
    }, [minLimit, maxLimit, min, max]);

    const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? minLimit : parseFloat(e.target.value);
        if (value >= minLimit && value < maxVal - minGap) {
            setMinInput(value);
            setMinVal(value);
        }
    };

    const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value === "" ? maxLimit : parseFloat(e.target.value);
        if (value <= maxLimit && value > minVal + minGap) {
            setMaxInput(value);
            setMaxVal(value);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: "min" | "max" ) => {
        if (e.key === 'Enter') {
            const value = parseFloat((e.target as HTMLInputElement).value);
            if (
                type === "min" &&
                value >= minLimit &&
                value < maxVal - minGap
            ) {
                setMinVal(value);
                setMinInput(value);
                onChange(value, maxVal);
            } else if (
                type === "max" &&
                value <= maxLimit &&
                value > minVal + minGap
            ) {
                setMaxVal(value);
                setMaxInput(value);
                onChange(minVal, value);
            }
        }
    };

    const startDrag = () => {
        setIsDragging(true);
    };

    const stopDrag = () => {
        setIsDragging(false);
    };

    return (
        <div className="double-slider-box">
            <div className="input-box">
                <div className="min-box">
                    <input
                        type="number"
                        value={minInput}
                        onChange={handleMinInput}
                        onKeyDown={(e) => handleInputKeyDown(e, "min")}
                        onBlur={() => onChange(minVal, maxVal)}
                        className="min-input"
                        min={minLimit}
                        max={maxLimit}
                    />    
                </div>
                <div className="max-box">
                    <input
                        type="number"
                        value={maxInput}
                        onChange={handleMaxInput}
                        onKeyDown={(e) => handleInputKeyDown(e, "max")}
                        onBlur={() => onChange(minVal, maxVal)}
                        className="max-input"
                        min={minLimit}
                        max={maxLimit}
                    />
            </div>
        </div>
        <div className="range-slider">
            <div
                className="slider-track"
                style={{
                    left: `${minPercent}%`,
                    right: `${100 - maxPercent}%`
                }}>
            </div>
            <input
                type="range"
                min={minLimit}
                max={maxLimit}
                value={minVal}
                onChange={slideMin}
                onMouseDown={startDrag}
                onMouseUp={stopDrag}
                onTouchStart={startDrag}
                onTouchEnd={stopDrag}
                className="min-val"
            />
            <input
                type="range"
                min={minLimit}
                max={maxLimit}
                value={maxVal}
                onChange={slideMax}
                onMouseDown={startDrag}
                onMouseUp={stopDrag}
                onTouchStart={startDrag}
                onTouchEnd={stopDrag}
                className="max-val"
            />
            {isDragging && <div className="min-tooltip">{minVal}</div>}    
            {isDragging && <div className="max-tooltip">{maxVal}</div>}
            </div>
        </div>
    );
};

export default PriceRangeFilter;