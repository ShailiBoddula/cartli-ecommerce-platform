package com.shopsy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopsy.backend.model.Address;
import com.shopsy.backend.model.User;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
}
