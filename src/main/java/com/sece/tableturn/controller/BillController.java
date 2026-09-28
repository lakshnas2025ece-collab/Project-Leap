package com.sece.tableturn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sece.tableturn.entity.Bill;
import com.sece.tableturn.service.BillService;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @PostMapping("/table/{tableId}")
    public Bill generateBill(@PathVariable Long tableId) {
        return billService.generateBill(tableId);
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public Bill getBill(@PathVariable Long id) {
        return billService.getBill(id);
    }
}