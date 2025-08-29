
import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, isLoading = false, ...props }) => {
  return (
    <button
      className={`flex items-center justify-center px-6 py-3 font-bold text-white rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 focus:ring-teal-500 ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader /> : children}
    </button>
  );
};

export default Button;
