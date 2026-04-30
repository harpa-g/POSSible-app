package com.wad.ecommerce.repository;

import com.wad.ecommerce.model.Tab;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TabRepository extends JpaRepository<Tab, Long> {
    Optional<Tab> findByTableNumberAndPaymentStatus(int tableNumber, Tab.PaymentStatus status);
    Optional<Tab> findByTableNumberAndCustomerUsernameAndPaymentStatus(int tableNumber, String username, Tab.PaymentStatus status);
}