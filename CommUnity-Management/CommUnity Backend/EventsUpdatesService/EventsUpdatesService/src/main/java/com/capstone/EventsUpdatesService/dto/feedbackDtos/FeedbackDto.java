package com.capstone.EventsUpdatesService.dto.feedbackDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDto {
    private Long feedbackId;
    private String content;
    private Long eventId;
}