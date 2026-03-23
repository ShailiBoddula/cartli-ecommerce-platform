package com.shopsy.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shopsy.backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategory_Name(String categoryName, Pageable pageable);

    Page<Product> findByBrand(String brand, Pageable pageable);

    Page<Product> findByColor(String color, Pageable pageable);

    Page<Product> findByDiscountedPriceBetween(double minPrice, double maxPrice, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR p.category.name = :category) AND " +
           "(:brand IS NULL OR p.brand = :brand) AND " +
           "(:color IS NULL OR p.color = :color) AND " +
           "(:minPrice IS NULL OR p.discountedPrice >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.discountedPrice <= :maxPrice)")
    Page<Product> findByFilters(@Param("category") String category,
                                @Param("brand") String brand,
                                @Param("color") String color,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice,
                                Pageable pageable);
}