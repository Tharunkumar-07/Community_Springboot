package com.capstone.ComplaintRequestService.dto.complaintDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintResponse {
    private long complaintId;
    private String personName;
    private String flatNo;
    private String title;
    private String description;
    private String status;
}