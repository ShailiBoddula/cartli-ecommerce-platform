import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const images = [
  { src: "/assets/1.png", alt: "Outfit 1" },
  { src: "/assets/2.png", alt: "Outfit 2" },
  { src: "/assets/3.png", alt: "Outfit 3" },
  { src: "/assets/4.png", alt: "Outfit 4" },
];

const MainCarousel = () => {
  const items = images.map((image, index) => (
    <div
      key={index}
      className="w-full h-[420px] bg-white flex items-center justify-center"
    >
      <img
        src={image.src}
        alt={image.alt}
        role="presentation"
        className="cursor-pointer max-w-full max-h-full object-contain"
      />
    </div>
  ));

  return (
    <AliceCarousel
      items={items}
      autoPlay
      autoPlayInterval={2000}
      infinite
      disableButtonsControls
      mouseTracking
    />
  );
};

export default MainCarousel;
