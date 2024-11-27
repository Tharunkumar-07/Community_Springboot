package com.capstone.PaymentService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResidentResponse {
    private long residentId;
    private String name;
    private String phoneNo;
    private String flatNo;
    private String postal;
    private String email;
    private String societyName;
    private long societyId;
    private Role role;
}