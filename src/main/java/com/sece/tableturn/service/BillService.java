package com.sece.tableturn.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sece.tableturn.entity.Bill;
import com.sece.tableturn.entity.Order;
import com.sece.tableturn.entity.OrderItem;
import com.sece.tableturn.entity.RestaurantTable;
import com.sece.tableturn.exception.BusinessRuleException;
import com.sece.tableturn.repository.BillRepository;
import com.sece.tableturn.repository.OrderItemRepository;
import com.sece.tableturn.repository.OrderRepository;
import com.sece.tableturn.repository.RestaurantTableRepository;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Bill generateBill(Long tableId) {

        RestaurantTable table = restaurantTableRepository
                .findById(tableId)
                .orElse(null);

        if (table == null) {
            throw new BusinessRuleException("Table not found");
        }

        List<Order> orders =
                orderRepository.findByTableAndStatus(table, "OPEN");

        if (orders.isEmpty()) {
            throw new BusinessRuleException(
                    "No open orders found for this table");
        }

        double total = 0;

        for (Order order : orders) {

            List<OrderItem> items =
                    orderItemRepository.findByOrder(order);

            for (OrderItem item : items) {
                total += item.getQuantity() * item.getPrice();
            }

            order.setStatus("CLOSED");
            orderRepository.save(order);
        }

        Bill bill = new Bill();

        bill.setTable(table);
        bill.setTotalAmount(total);
        bill.setBillTime(LocalDateTime.now());
        bill.setStatus("PAID");

        table.setStatus("FREE");
        restaurantTableRepository.save(table);

        return billRepository.save(bill);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBill(Long id) {
        return billRepository.findById(id).orElse(null);
    }
}