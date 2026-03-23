import React, { useState, useEffect } from "react";
import MainCarousel from "../../HomeCarousel/MainCarousel";
import MensKurtaCarousel from "../../HomeCarousel/MensKurtaCarousel";
import MensShoesCarousel from "../../HomeCarousel/MensShoesCarousel";
import WomensDressCarousel from "../../HomeCarousel/WomensDressCarousel";
import Footer from "../../Footer/Footer";
import ProductDetailModal from "../../ProductDetailModal";
import { mens_kurta } from "../../HomeCarousel/MensKurtaData";
import { mensShoesPage1 } from "../../HomeCarousel/MensShoesData";
import { womensDressData } from "../../HomeCarousel/WomensDressData";
import { gounsPage1 } from "../../HomeCarousel/WomensGownsData";
import { womensTopData } from "../../HomeCarousel/WomensTopData";
import { homeSectionData } from "../../HomeCarousel/HomeSectionData";


const HomePage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const allProducts = [
      ...mens_kurta,
      ...mensShoesPage1,
      ...womensDressData,
      ...gounsPage1,
      ...womensTopData,
      ...homeSectionData
    ];
    localStorage.setItem('allProducts', JSON.stringify(allProducts));
  });

  const handleProductClick = (product) => {
    console.log('handleProductClick called with product:', product.title);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };
  return (
    <div>
      {user && (
        <div className="bg-gray-100 py-4 px-4 text-center">
          <h2 className="text-xl font-semibold">Welcome back, {user.firstName} {user.lastName}!</h2>
        </div>
      )}
      <MainCarousel onProductClick={handleProductClick} />
      <div className="py-10">
        <MensKurtaCarousel onProductClick={handleProductClick} />
      </div>
      <div className="py-10">
        <MensShoesCarousel onProductClick={handleProductClick} />
      </div>
      <div className="py-10">
        <WomensDressCarousel onProductClick={handleProductClick} />
      </div>
      <Footer />
      {showModal && <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
};

export default HomePage;
