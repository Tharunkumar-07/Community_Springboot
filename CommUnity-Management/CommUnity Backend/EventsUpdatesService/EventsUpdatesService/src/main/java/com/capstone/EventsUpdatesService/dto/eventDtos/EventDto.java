package com.capstone.EventsUpdatesService.dto.eventDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDto {
    private long eventId;
    private String eventName;
    private Date eventDate;
    private String eventDetails;
    private String eventImage;
    private long societyId;
}