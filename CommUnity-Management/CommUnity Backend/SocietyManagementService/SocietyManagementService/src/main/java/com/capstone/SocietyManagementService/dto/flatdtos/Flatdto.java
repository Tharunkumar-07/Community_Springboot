package com.capstone.SocietyManagementService.dto.flatdtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Flatdto {
    private Long flatId;
    private String flatNo;
    private Long societyId;
}