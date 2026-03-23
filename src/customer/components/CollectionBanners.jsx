import React from 'react';
import kurtaImage from '../../assets/kurta_collection_copy_1920x.webp';
import salwarImage from '../../assets/salwar_kameez_coll_copy_964ddb72-3c2d-4f64-918d-22f1bf2b0b6e_1920x.webp';
import sareeImage from '../../assets/saree_collection_copy_ac322513-d150-483d-bff1-4149ef9b3ac5_1920x.webp';

const CollectionBanners = () => {
  const banners = [
    {
      image: kurtaImage,
      title: 'Kurta Collection',
      alt: 'Kurta Collection'
    },
    {
      image: salwarImage,
      title: 'Salwar Kameez Collection',
      alt: 'Salwar Kameez Collection'
    },
    {
      image: sareeImage,
      title: 'Saree Collection',
      alt: 'Saree Collection'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
      {banners.map((banner, index) => (
        <div key={index} className="relative h-96 md:h-screen/2 lg:h-screen/3 overflow-hidden">
          <img
            src={banner.image}
            alt={banner.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-3xl font-bold text-center">
              {banner.title}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollectionBanners;
