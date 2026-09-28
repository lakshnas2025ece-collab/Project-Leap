package com.sece.tableturn.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sece.tableturn.entity.Order;
import com.sece.tableturn.entity.RestaurantTable;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByTable(RestaurantTable table);

    List<Order> findByTableAndStatus(
            RestaurantTable table,
            String status);
}