package com.capstone.SocietyManagementService.dto.societydtos.FeignResponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventResponse {
    private long eventId;
    private String eventName;
    private Date eventDate;
    private String eventDetails;
    private long societyId;
}