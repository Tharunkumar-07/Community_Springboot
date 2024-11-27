package com.capstone.SocietyManagementService.dto.emergencyContactDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmergencyContactDto {
    private long emergencyId;
    private String personName;
    private String serviceType;
    private String phoneNo;
    private Long societyId;
}