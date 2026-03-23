import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import FilterSidebar from '../FilterSidebar';
import ProductDetailModal from '../ProductDetailModal';
import api from '../../../config/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    brands: [],
    colors: [],
    minPrice: '',
    maxPrice: ''
  });

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    if (!token) {
      setError('Please log in to view products.');
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/products?page=${page}&size=${size}`);
      setProducts(prev => page === 0 ? res.data.content : [...prev, ...res.data.content]);
      setHasMore(res.data.totalPages > page + 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => product.category?.name && filters.categories.includes(product.category.name));
    }

    // Filter by subcategory
    if (filters.subcategories.length > 0) {
      filtered = filtered.filter(product => product.category?.name && filters.subcategories.includes(product.category.name)); // Assuming subcategory is same as category for now
    }

    // Filter by brand
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }

    // Filter by color
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => filters.colors.includes(product.color));
    }

    // Filter by price
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(product => {
        // Assuming product.discountedPrice is a number
        const price = product.discountedPrice || 0;
        const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

 const handleProductClick = (product) => {
  console.log("Clicked product:", product);

  if (!product.id) {
    alert("Invalid product: missing ID");
    return;
  }

  setSelectedProduct(product);
  setShowModal(true);
};


  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="flex">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        <div className="flex-1 ml-8">
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id || index} product={product} onClick={handleProductClick} />
            ))}
          </div>
          {loading && <p className="text-center text-gray-500 mt-8">Loading products...</p>}
          {filteredProducts.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 mt-8">No products match your filters.</p>
          )}
          {hasMore && !loading && (
            <div className="text-center mt-8">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
      {showModal && <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
};

export default ProductsPage;