package com.capstone.SocietyManagementService.feign;

import com.capstone.SocietyManagementService.dto.societydtos.FeignResponses.EventResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "events-service", url = "http://localhost:7002/api/community/event")
public interface EventClient {
    @GetMapping("/event-by-society/{societyId}")
    public List<EventResponse> getEventsBySocietyId(@PathVariable("societyId") long societyId);
}