package com.sece.tableturn.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sece.tableturn.entity.Bill;
import com.sece.tableturn.entity.RestaurantTable;

public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByTable(RestaurantTable table);
}