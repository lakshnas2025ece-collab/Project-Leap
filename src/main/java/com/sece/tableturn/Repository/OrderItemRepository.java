package com.sece.tableturn.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sece.tableturn.entity.Order;
import com.sece.tableturn.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);
}