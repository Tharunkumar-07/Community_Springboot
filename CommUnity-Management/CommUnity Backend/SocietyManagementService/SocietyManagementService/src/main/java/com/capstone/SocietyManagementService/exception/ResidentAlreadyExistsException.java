package com.capstone.SocietyManagementService.exception;

public class ResidentAlreadyExistsException extends RuntimeException {
    public ResidentAlreadyExistsException(String message) {
        super(message);
    }
}
