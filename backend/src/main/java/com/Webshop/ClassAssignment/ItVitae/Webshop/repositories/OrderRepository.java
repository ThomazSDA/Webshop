package com.Webshop.ClassAssignment.ItVitae.Webshop.repositories;

import com.Webshop.ClassAssignment.ItVitae.Webshop.models.Order;
import com.Webshop.ClassAssignment.ItVitae.Webshop.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdAndUser(Long id, User user);
}
