package com.capstone.SocietyManagementService.dto.SecurityDetailsDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecurityDetailsDto {
    private long securityId;
    private String securityName;
    private String phoneNo;
    private String blockNo;
    private Long societyId;
}