package com.capstone.PaymentService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    private int amount;
    private String description;
    private String email;
    private String name;
    private String phoneNo;
}