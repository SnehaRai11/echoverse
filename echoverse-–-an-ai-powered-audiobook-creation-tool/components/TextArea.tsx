
import React from 'react';
import Loader from './Loader';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isLoading?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({ isLoading = false, ...props }) => {
  return (
    <div className="relative w-full">
      <textarea
        className="w-full p-4 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-200 text-slate-200 placeholder-slate-500 disabled:bg-slate-800"
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-slate-800/70 flex items-center justify-center rounded-lg">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default TextArea;
