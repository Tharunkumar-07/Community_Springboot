package com.capstone.SocietyManagementService.dto.societydtos.FeignResponses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoticeResponse {
    private Long noticeId;
    private String heading;
    private String content;
    private LocalDateTime datePosted;
    private long societyId;
}