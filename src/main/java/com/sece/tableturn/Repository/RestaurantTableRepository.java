package com.sece.tableturn.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sece.tableturn.entity.RestaurantTable;

public interface RestaurantTableRepository
        extends JpaRepository<RestaurantTable, Long> {

}