import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  if (!product.id) return null;

  return (
    <div
      className="cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-80 w-full object-contain bg-gray-100 transition-transform duration-300 group-hover:scale-105"
          onError={(e) => e.target.src = '/assets/1.png'}
        />
      </div>
      <h3 className="mt-3 font-medium text-gray-900 truncate">{product.brand}</h3>
      <p className="text-gray-600 text-sm truncate">{product.title}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="font-semibold text-gray-900">₹{product.discountedPrice}</span>
        {product.price && product.price !== product.discountedPrice && (
          <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
