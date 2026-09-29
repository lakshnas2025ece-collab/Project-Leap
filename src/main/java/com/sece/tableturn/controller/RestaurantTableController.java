package com.sece.tableturn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.sece.tableturn.entity.RestaurantTable;
import com.sece.tableturn.service.RestaurantTableService;

@RestController
@RequestMapping("/api/tables")
public class RestaurantTableController {

    @Autowired
    private RestaurantTableService restaurantTableService;

    @PostMapping
    public RestaurantTable createTable(
            @Valid @RequestBody RestaurantTable table) {

        return restaurantTableService.createTable(table);
    }

    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return restaurantTableService.getAllTables();
    }

    @GetMapping("/{id}")
    public RestaurantTable getTable(@PathVariable Long id) {
        return restaurantTableService.getTable(id);
    }

    @PutMapping("/{id}")
    public RestaurantTable updateTable(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantTable table) {

        return restaurantTableService.updateTable(id, table);
    }

    @DeleteMapping("/{id}")
    public void deleteTable(@PathVariable Long id) {
        restaurantTableService.deleteTable(id);
    }
}