import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState(null);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!product?.id) {
      setAddError('Product ID missing');
      return;
    }

    if (!selectedSize) {
      setAddError('Please select a size');
      return;
    }

    addToCart({
      product,
      size: selectedSize,
      quantity
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 z-10"
        >
          &times;
        </button>

        {/* Product Image */}
        <div className="w-full md:w-1/2 bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain min-h-[400px]"
            onError={(e) => {
              e.target.src = '/assets/1.png';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
          <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
          <p className="text-gray-600 mb-4">Color: {product.color}</p>

          <div className="mb-4">
            <p className="text-3xl font-bold text-gray-900">
              ₹{product.discountedPrice}
              {product.price && product.price !== product.discountedPrice && (
                <span className="ml-3 text-lg line-through text-gray-500">
                  ₹{product.price}
                </span>
              )}
            </p>
            {product.discountPersent && (
              <span className="inline-block mt-1 bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                {product.discountPersent}% off
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
          )}

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Select Size</h4>
            <div className="flex gap-2 flex-wrap">
              {product.size?.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedSize(s.name)}
                  className={`px-4 py-2 border rounded transition-colors ${
                    selectedSize === s.name 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Quantity</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {addError && <p className="text-red-500 mb-2">{addError}</p>}

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
