package com.capstone.SocietyManagementService.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SocietyNotFoundException.class)
    public ResponseEntity<String> handleSocietyNotFoundException(SocietyNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FlatNotFoundException.class)
    public ResponseEntity<String> handleFlatNotFoundException(FlatNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateFlatException.class)
    public ResponseEntity<String> handleDuplicateFlatException(DuplicateFlatException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResidentNotFoundException.class)
    public ResponseEntity<String> handleResidentNotFoundException(ResidentNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResidentAlreadyExistsException.class)
    public ResponseEntity<String> handleResidentAlreadyExistsException(ResidentAlreadyExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EmergencyContactNotFoundException.class)
    public ResponseEntity<String> handleEmergencyContactNotFoundException(EmergencyContactNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SecurityDetailsNotFoundException.class)
    public ResponseEntity<String> handleSecurityDetailsNotFoundException(SecurityDetailsNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BlockNotFoundException.class)
    public ResponseEntity<String> handleBlockNotFoundException(BlockNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ParkingNotFoundException.class)
    public ResponseEntity<String> handleParkingNotFoundException(ParkingNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGlobalException(Exception ex) {
        return new ResponseEntity<>("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}