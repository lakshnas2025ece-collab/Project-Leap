package com.sece.tableturn.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sece.tableturn.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

}