package com.shopsy.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shopsy.backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findByEmailIgnoreCase(String email);

}