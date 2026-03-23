import React from 'react';

const HomeSectionCard = ({ product }) => {
  return (
    <div className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[10rem] mx-3">
      <div className="h-[13rem] w-[10rem]">
        <img
          className="object-cover object-top w-full h-full"
          src={product.imageUrl}  
          alt={product.title}
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-medium text-gray-900">
          {product.title}
        </h3>
      </div>
    </div>
  );
};

export default HomeSectionCard;
