package com.capstone.SocietyManagementService.dto.societydtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SocietyRequest {
    private Long id;
    private String name;
    private String phoneNo;
    private String societyName;
    private String societyAddress;
    private String city;
    private String district;
    private String postal;
    private String email;
}