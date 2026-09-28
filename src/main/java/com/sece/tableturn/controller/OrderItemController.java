package com.sece.tableturn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sece.tableturn.entity.OrderItem;
import com.sece.tableturn.service.OrderItemService;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @PostMapping
    public OrderItem addOrderItem(@RequestBody OrderItem orderItem) {
        return orderItemService.addOrderItem(orderItem);
    }

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getItemsByOrder(
            @PathVariable Long orderId) {

        return orderItemService.getItemsByOrder(orderId);
    }
}