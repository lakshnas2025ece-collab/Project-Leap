package com.sece.tableturn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sece.tableturn.entity.Reservation;
import com.sece.tableturn.service.ReservationService;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public Reservation createReservation(
            @RequestBody Reservation reservation) {

        return reservationService.createReservation(reservation);
    }

    @GetMapping
    public List<Reservation> getAllReservations() {

        return reservationService.getAllReservations();
    }

    @GetMapping("/{id}")
    public Reservation getReservation(
            @PathVariable Long id) {

        return reservationService.getReservation(id);
    }

    @DeleteMapping("/{id}")
    public void deleteReservation(
            @PathVariable Long id) {

        reservationService.deleteReservation(id);
    }
}