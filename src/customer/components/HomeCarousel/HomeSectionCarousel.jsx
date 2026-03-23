import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard';
import { homeSectionData } from './HomeSectionData';

const HomeSectionCarousel = () => {
  const items = homeSectionData.map((item, index) => (
    <HomeSectionCard key={index} product={item} />
  ));

  return (
    <AliceCarousel
      items={items}
      responsive={{
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3 },
      }}
      autoPlay
      autoPlayInterval={3000}
      infinite
      disableButtonsControls
      disableDotsControls
    />
  );
};

export default HomeSectionCarousel;