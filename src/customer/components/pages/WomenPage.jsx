import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import ProductDetailModal from '../ProductDetailModal';
import { womensDressData } from '../HomeCarousel/WomensDressData';

const WomenPage = () => {
  const products = womensDressData;
  
  useEffect(() => {
    console.log('WomenPage products:', products);
    console.log('WomenPage products length:', products.length);
  }, []);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Women's Collection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
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

export default WomenPage;
