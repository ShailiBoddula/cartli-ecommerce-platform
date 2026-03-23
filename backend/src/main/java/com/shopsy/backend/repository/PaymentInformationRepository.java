package com.shopsy.backend.repository;

import com.shopsy.backend.model.PaymentInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentInformationRepository extends JpaRepository<PaymentInformation, Long> {

    PaymentInformation findByRazorpayOrderId(String razorpayOrderId);
}