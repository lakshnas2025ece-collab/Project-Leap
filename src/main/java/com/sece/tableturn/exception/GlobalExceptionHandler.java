package com.sece.tableturn.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessRuleException(
            BusinessRuleException exception) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", 400);
        response.put("message", exception.getMessage());

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException exception) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", 400);
        response.put(
                "message",
                exception.getBindingResult()
                        .getFieldError()
                        .getDefaultMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}