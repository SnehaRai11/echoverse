
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
}

const Slider: React.FC<SliderProps> = ({ label, value, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-2 flex justify-between">
        <span>{label}</span>
        <span className="font-bold text-teal-400">{value.toFixed(1)}</span>
      </label>
      <input
        type="range"
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer 
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                   [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full 
                   [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150 
                   [&::-webkit-slider-thumb]:ease-in-out hover:[&::-webkit-slider-thumb]:bg-teal-400 
                   focus:[&::-webkit-slider-thumb]:ring-2 focus:[&::-webkit-slider-thumb]:ring-teal-300
                   disabled:opacity-50 disabled:cursor-not-allowed
                   [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-teal-500
                   [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none"
        {...props}
      />
    </div>
  );
};

export default Slider;
