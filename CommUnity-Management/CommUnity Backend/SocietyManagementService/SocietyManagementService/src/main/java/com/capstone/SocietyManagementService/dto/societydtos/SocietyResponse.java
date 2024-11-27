package com.capstone.SocietyManagementService.dto.societydtos;

import com.capstone.SocietyManagementService.dto.SecurityDetailsDtos.SecurityDetailsDto;
import com.capstone.SocietyManagementService.dto.emergencyContactDtos.EmergencyContactDto;
import com.capstone.SocietyManagementService.dto.flatdtos.Flatdto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SocietyResponse {
    private Long id;
    private String name;
    private String phoneNo;
    private String societyName;
    private String societyAddress;
    private String city;
    private String district;
    private String postal;
    private String email;
    private List<Flatdto> flats;
    private List<EmergencyContactDto> emergencyContacts;
    private List<SecurityDetailsDto> securityDetails;
}