import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import ProductDetailModal from '../ProductDetailModal';
import { mens_kurta } from '../HomeCarousel/MensKurtaData';
import { mensShoesPage1 } from '../HomeCarousel/MensShoesData';

const MenPage = () => {
  const menProducts = [
    ...mens_kurta,
    ...mensShoesPage1
  ];

  useEffect(() => {
    console.log('MenPage products:', menProducts);
    console.log('MenPage products length:', menProducts.length);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  console.log('Rendering MenPage');
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Men's Collection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menProducts.map((product, index) => (
          <ProductCard 
            key={product.id || index} 
            product={product} 
            onClick={() => {
              setSelectedProduct(product);
              setShowModal(true);
            }} 
          />
        ))}
      </div>

      {showModal && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default MenPage;
