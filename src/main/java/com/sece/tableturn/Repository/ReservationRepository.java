package com.sece.tableturn.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sece.tableturn.entity.Reservation;
import com.sece.tableturn.entity.RestaurantTable;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByTableAndReservationDate(
            RestaurantTable table,
            LocalDate reservationDate);

    List<Reservation> findByTableAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThan(
            RestaurantTable table,
            LocalDate reservationDate,
            LocalTime endTime,
            LocalTime startTime);
}