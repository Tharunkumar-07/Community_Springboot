package com.capstone.EventsUpdatesService.dto.noticeDtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeResponse {
    private Long noticeId;
    private String heading;
    private String content;
    private String noticeImage;
    private LocalDateTime datePosted;
    private Long societyId;
}
