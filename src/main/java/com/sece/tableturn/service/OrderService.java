package com.sece.tableturn.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sece.tableturn.entity.Order;
import com.sece.tableturn.entity.RestaurantTable;
import com.sece.tableturn.exception.BusinessRuleException;
import com.sece.tableturn.repository.OrderRepository;
import com.sece.tableturn.repository.RestaurantTableRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    public Order createOrder(Order order) {

        RestaurantTable table = restaurantTableRepository
                .findById(order.getTable().getId())
                .orElse(null);

        if (table == null) {
            throw new BusinessRuleException("Table not found");
        }

        if (!"OCCUPIED".equalsIgnoreCase(table.getStatus())) {
            throw new BusinessRuleException(
                    "Table must be occupied before placing an order");
        }

        order.setTable(table);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("OPEN");

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByTable(Long tableId) {

        RestaurantTable table = restaurantTableRepository
                .findById(tableId)
                .orElse(null);

        if (table == null) {
            throw new BusinessRuleException("Table not found");
        }

        return orderRepository.findByTable(table);
    }
}