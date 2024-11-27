package com.capstone.ComplaintRequestService.dto.complaintDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintRequest {
    private String personName;
    private String flatNo;
    private String title;
    private String description;
    private String status;
    private long residentId;
    private long societyId;
}