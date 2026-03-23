import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import ProductCard from '../ProductCard/ProductCard';
import { mens_kurta } from './MensKurtaData';

const MensKurtaCarousel = ({ onProductClick }) => {
  const items = mens_kurta.map((item, index) => (
    <ProductCard key={item.id} product={item} onClick={onProductClick} />
  ));

  const renderPrevButton = ({ isDisabled }) => (
    <button
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
      disabled={isDisabled}
    >
      ←
    </button>
  );

  const renderNextButton = ({ isDisabled }) => (
    <button
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
      disabled={isDisabled}
    >
      →
    </button>
  );

  return (
    <div className="relative px-4 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 py-5">Men's Shirts</h2>
      <AliceCarousel
        items={items}
        responsive={{
          0: { items: 1 },
          568: { items: 2 },
          1024: { items: 5 },
        }}
        autoPlay
        autoPlayInterval={3000}
        infinite
        disableDotsControls
        renderPrevButton={renderPrevButton}
        renderNextButton={renderNextButton}
      />
    </div>
  );
};

export default MensKurtaCarousel;