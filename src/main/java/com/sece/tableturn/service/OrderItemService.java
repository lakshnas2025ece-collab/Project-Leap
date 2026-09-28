package com.sece.tableturn.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sece.tableturn.entity.Order;
import com.sece.tableturn.entity.OrderItem;
import com.sece.tableturn.exception.BusinessRuleException;
import com.sece.tableturn.repository.OrderItemRepository;
import com.sece.tableturn.repository.OrderRepository;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    public OrderItem addOrderItem(OrderItem orderItem) {

        Order order = orderRepository
                .findById(orderItem.getOrder().getId())
                .orElse(null);

        if (order == null) {
            throw new BusinessRuleException("Order not found");
        }

        if (!"OPEN".equalsIgnoreCase(order.getStatus())) {
            throw new BusinessRuleException("Order is not open");
        }

        if (orderItem.getQuantity() <= 0) {
            throw new BusinessRuleException("Quantity must be greater than zero");
        }

        if (orderItem.getPrice() < 0) {
            throw new BusinessRuleException("Price cannot be negative");
        }

        orderItem.setOrder(order);

        return orderItemRepository.save(orderItem);
    }

    public List<OrderItem> getItemsByOrder(Long orderId) {

        Order order = orderRepository
                .findById(orderId)
                .orElse(null);

        if (order == null) {
            throw new BusinessRuleException("Order not found");
        }

        return orderItemRepository.findByOrder(order);
    }
}