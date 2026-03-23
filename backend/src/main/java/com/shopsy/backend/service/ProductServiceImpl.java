package com.shopsy.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.shopsy.backend.model.Product;
import com.shopsy.backend.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        Product existingProduct = findById(id);
        existingProduct.setTitle(product.getTitle());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setDiscountedPrice(product.getDiscountedPrice());
        existingProduct.setDiscountPercent(product.getDiscountPercent());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setColor(product.getColor());
        existingProduct.setSizes(product.getSizes());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setCategory(product.getCategory());
        return productRepository.save(existingProduct);
    }

    @Override
    public void delete(Long id) {
        Product product = findById(id);
        productRepository.delete(product);
    }

    @Override
    public Page<Product> findByCategory(String categoryName, Pageable pageable) {
        return productRepository.findByCategory_Name(categoryName, pageable);
    }

    @Override
    public Page<Product> findByBrand(String brand, Pageable pageable) {
        return productRepository.findByBrand(brand, pageable);
    }

    @Override
    public Page<Product> findByColor(String color, Pageable pageable) {
        return productRepository.findByColor(color, pageable);
    }

    @Override
    public Page<Product> findByPriceRange(double minPrice, double maxPrice, Pageable pageable) {
        return productRepository.findByDiscountedPriceBetween(minPrice, maxPrice, pageable);
    }

    @Override
    public Page<Product> findByFilters(String category, String brand, String color, Double minPrice, Double maxPrice, Pageable pageable) {
        return productRepository.findByFilters(category, brand, color, minPrice, maxPrice, pageable);
    }
}