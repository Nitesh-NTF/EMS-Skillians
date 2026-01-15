import React from "react";

export const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 w-full m-auto">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      <p className="mt-3 text-sm text-gray-600">{text}</p>
    </div>
  );
};

export const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-white border-t-transparent" />
    </div>
  );
};

export const SkeletonLoader = () => {
  return (
    <div className="space-y-4 animate-pulse p-7">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
    </div>
  );
};

export const PulseLoader = () => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" />
      <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-150" />
      <span className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-300" />
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
  );
};

 
