// components/FrontPageGrid.jsx
import React from 'react';
import { Card } from './Card';

export const FrontPageGrid = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-4 py-8 px-16 gap-4 h-150">
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-green-100 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-2 row-span-2 p-2">
        <div className="bg-blue-100 rounded-md w-full h-full "></div>
      </Card>
      <Card styles="col-span-1 row-span-3 p-2">
        <div className="bg-indigo-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-pink-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-2 row-span-2 p-2">
        <div className="bg-blue-800 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-pink-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-2 p-2">
        <div className="bg-green-200 rounded-md w-full h-full"></div>
      </Card>
      <Card styles="col-span-1 row-span-1 p-2">
        <div className="bg-cyan-800 rounded-md w-full h-full"></div>
      </Card>
    </div>
  );
};
