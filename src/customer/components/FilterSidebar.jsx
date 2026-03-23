import React from 'react';

const FilterSidebar = ({ filters, onFilterChange, hideCategories = false }) => {
  const categories = ['Men', 'Women'];
  const subcategories = ['Clothing', 'Accessories'];
  const brands = [
    // Men's kurta brands
    'Majestic Man', 'SG LEMAN', 'FUBAR', 'ALY JOHN', 'PETER ENGLAND', 'WRODSS', 'RAHUL LOOK', 'Manthan', 'allan peter', 'Nofilter',
    // Men's shoes brands
    'Abros', 'asian', 'BIRDE', 'BRUTON', 'aadi', 'CAMPUS', 'World Wear Footwear', 'JQR', 'NIVIA', 'SFR', 'density', 'BERSACHE', 'ASE', 'AIRDRON', 'Reebok', 'Skechers', 'KILLER', 'Asics',
    // Women's dress brands
    'Aarvia', 'Sheetal Associates', 'AAYU', 'Janasya', 'SHRI RADHA RANI CREATIONS', 'Tokyo Talkies', 'Rudraaksha', 'NE STYLE', 'VISHVAA ENTERPRISE', 'FALTOOO FASHION', 'dyrectdeals', 'SASSAFRAS', 'AASK', 'SUBH LAXMI', 'Vishudh', 'SHREEJI ENTERPRISE', 'Fashion2wear', 'Selvia', 'SLENOR', 'PRETTY LOVING THING', 'Ishin',
    // Women's gowns brands
    'Riya Creation', 'SAPONHARSH', 'NE STYLE', 'Zinariya Fab', 'GLFashion', 'Femvy', 'BLACK SCISSOR', 'ftDiva', 'Annsh Apparel', 'Smart Shop'
  ];
  const colors = ['Green', 'Yellow', 'Blue', 'White', 'Grey', 'Pink', 'Black', 'Light Blue'];

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleSubcategoryChange = (subcategory) => {
    const newSubcategories = filters.subcategories.includes(subcategory)
      ? filters.subcategories.filter(s => s !== subcategory)
      : [...filters.subcategories, subcategory];
    onFilterChange({ ...filters, subcategories: newSubcategories });
  };

  const handleBrandChange = (brand) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handleColorChange = (color) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const handlePriceChange = (type, value) => {
    onFilterChange({ ...filters, [type]: value });
  };

  return (
    <div className="w-64 bg-white p-4 border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Category Filter */}
      {!hideCategories && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Category</h4>
          {categories.map(category => (
            <label key={category} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      )}

      {/* Subcategory Filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Subcategory</h4>
        {subcategories.map(subcategory => (
          <label key={subcategory} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={filters.subcategories.includes(subcategory)}
              onChange={() => handleSubcategoryChange(subcategory)}
              className="mr-2"
            />
            {subcategory}
          </label>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Brand</h4>
        <div className="max-h-40 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="mr-2"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Color</h4>
        {colors.map(color => (
          <label key={color} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={filters.colors.includes(color)}
              onChange={() => handleColorChange(color)}
              className="mr-2"
            />
            {color}
          </label>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Price Range</h4>
        <div className="flex items-center mb-2">
          <span className="mr-2">Min:</span>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            placeholder="0"
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Max:</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
            placeholder="5000"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
