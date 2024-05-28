// components/LoadingIndicator.js
import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-xl">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
