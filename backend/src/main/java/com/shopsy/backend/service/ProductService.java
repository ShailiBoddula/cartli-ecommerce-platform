package com.shopsy.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.shopsy.backend.model.Product;

public interface ProductService {

    Page<Product> findAll(Pageable pageable);

    Product findById(Long id);

    Product save(Product product);

    Product update(Long id, Product product);

    void delete(Long id);

    Page<Product> findByCategory(String categoryName, Pageable pageable);

    Page<Product> findByBrand(String brand, Pageable pageable);

    Page<Product> findByColor(String color, Pageable pageable);

    Page<Product> findByPriceRange(double minPrice, double maxPrice, Pageable pageable);

    Page<Product> findByFilters(String category, String brand, String color, Double minPrice, Double maxPrice, Pageable pageable);
}