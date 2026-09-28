package com.sece.tableturn.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sece.tableturn.entity.RestaurantTable;
import com.sece.tableturn.repository.RestaurantTableRepository;

@Service
public class RestaurantTableService {

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    public RestaurantTable createTable(RestaurantTable table) {
        return restaurantTableRepository.save(table);
    }

    public List<RestaurantTable> getAllTables() {
        return restaurantTableRepository.findAll();
    }

    public RestaurantTable getTable(Long id) {
        return restaurantTableRepository.findById(id).orElse(null);
    }

    public RestaurantTable updateTable(Long id, RestaurantTable table) {

        RestaurantTable existing =
                restaurantTableRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setTableNumber(table.getTableNumber());
            existing.setCapacity(table.getCapacity());
            existing.setStatus(table.getStatus());

            return restaurantTableRepository.save(existing);
        }

        return null;
    }

    public void deleteTable(Long id) {
        restaurantTableRepository.deleteById(id);
    }
}