import React from 'react';
import { LoaderCircle } from 'lucide-react';

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center h-full min-h-64 w-full">
      <div className="flex flex-col items-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
        <span className="mt-3 text-sm text-gray-600">{text}</span>
      </div>
    </div>
  );
};

export default Loader;
