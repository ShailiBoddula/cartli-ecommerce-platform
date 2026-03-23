import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetailModal from '../ProductDetailModal';
import { womensDressData } from '../HomeCarousel/WomensDressData';
import { gounsPage1 } from '../HomeCarousel/WomensGownsData';
import { mens_kurta } from '../HomeCarousel/MensKurtaData';
import { mensShoesPage1 } from '../HomeCarousel/MensShoesData';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Combine all static product data
  const allProducts = [
    ...womensDressData,
    ...gounsPage1,
    ...mens_kurta,
    ...mensShoesPage1
  ];

  const product = allProducts.find(p => String(p.id) === String(id));

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Product not found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-black text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ProductDetailModal
      product={product}
      onClose={() => navigate(-1)}
    />
  );
};

export default ProductDetails;
