package com.capstone.SocietyManagementService.dto.residentdtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResidentRequestToUpdate {
    private String name;
    private String phoneNo;
    private String email;
}