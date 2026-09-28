package com.sece.tableturn.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sece.tableturn.exception.BusinessRuleException;
import com.sece.tableturn.entity.Customer;
import com.sece.tableturn.entity.Reservation;
import com.sece.tableturn.entity.RestaurantTable;
import com.sece.tableturn.repository.ReservationRepository;
import com.sece.tableturn.repository.RestaurantTableRepository;
import com.sece.tableturn.repository.CustomerRepository;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RestaurantTableRepository restaurantTableRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public Reservation createReservation(Reservation reservation) {

        RestaurantTable table = restaurantTableRepository
                .findById(reservation.getTable().getId())
                .orElse(null);

        if (table == null) {
            throw new BusinessRuleException("Table not found");
        }

        if (!"FREE".equalsIgnoreCase(table.getStatus())) {
            throw new BusinessRuleException("Table is not free");
        }

        if (reservation.getPartySize() > table.getCapacity()) {
            throw new BusinessRuleException("Party size exceeds table capacity");
        }

        List<Reservation> existingReservations =
                reservationRepository
                        .findByTableAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                table,
                                reservation.getReservationDate(),
                                reservation.getEndTime(),
                                reservation.getStartTime());

        if (!existingReservations.isEmpty()) {
            throw new BusinessRuleException("Table is already reserved for this time");
        }

        if (reservation.getCustomer() != null) {

            Customer customer = customerRepository
                    .findById(reservation.getCustomer().getId())
                    .orElse(null);

            if (customer == null) {
                throw new BusinessRuleException("Customer not found");
            }

            reservation.setCustomer(customer);
        }

        reservation.setTable(table);
        reservation.setStatus("CONFIRMED");

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservation(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }

    public void deleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }
}