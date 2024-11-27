package com.capstone.SocietyManagementService.dto.Parkingdtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParkingDto {
    private Long parkingId;
    private String parkingNo;
    private String flatNo;
    private long flatId;
    private long societyId;
}