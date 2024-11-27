package com.capstone.SocietyManagementService.feign;

import com.capstone.SocietyManagementService.dto.societydtos.FeignResponses.NoticeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;

@FeignClient(name = "notice-service", url = "http://localhost:7002/api/community/notice")
public interface NoticeClient {
    @GetMapping("/notice-by-society/{societyId}")
    public List<NoticeResponse> getNoticesBySocietyId(@PathVariable("societyId") long societyId);
