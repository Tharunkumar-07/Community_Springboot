package com.capstone.ComplaintRequestService.model;

import com.capstone.ComplaintRequestService.ComplaintStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long complaintId;
    private String personName;
    private String flatNo;
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status = ComplaintStatus.OPEN; // Default status is OPE
    private long residentId;
    private long societyId;
}