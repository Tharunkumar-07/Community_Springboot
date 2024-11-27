package com.capstone.SocietyManagementService.controller;

import com.capstone.SocietyManagementService.dto.societydtos.FeignResponses.EventResponse;
import com.capstone.SocietyManagementService.dto.societydtos.FeignResponses.NoticeResponse;
import com.capstone.SocietyManagementService.dto.societydtos.SocietyRequest;
import com.capstone.SocietyManagementService.dto.societydtos.SocietyResponse;
import com.capstone.SocietyManagementService.service.SocietyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/management-service/societies")
public class SocietyController {
    @Autowired
    private SocietyService societyService;

    @PostMapping()
    public ResponseEntity<SocietyResponse> createSociety(@RequestBody SocietyRequest societyRequest) {
        return new ResponseEntity<>(societyService.createSociety(societyRequest), HttpStatus.CREATED);
    }

    @GetMapping()
    public  ResponseEntity<List<SocietyResponse>> getAllSociety(){
        return new ResponseEntity<>(societyService.getAllSociety(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SocietyResponse> getSocietyById(@PathVariable Long id) {
        return new ResponseEntity<>(societyService.getSocietyById(id), HttpStatus.OK);
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<SocietyResponse> getSocietyByEmail(@PathVariable String email) {
        return new ResponseEntity<>(societyService.getSocietyByEmail(email), HttpStatus.OK);
    }
    @DeleteMapping("/delete-society/{id}")
    public ResponseEntity<String> deleteSociety(@PathVariable Long id) {
        societyService.deleteSocietyById(id);
        return new ResponseEntity<>("Society deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/notice-by-society/{societyId}")
    public ResponseEntity<List<NoticeResponse>> getNoticesBySocietyId(@PathVariable("societyId") long societyId) {
        List<NoticeResponse> notices = societyService.getNoticesBySocietyId(societyId);
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    @GetMapping("/event-by-society/{societyId}")
    public ResponseEntity<List<EventResponse>> getEventsBySocietyId(@PathVariable("societyId") long societyId) {
        List<EventResponse> events = societyService.getEventsBySocietyId(societyId);
        return ResponseEntity.ok(events);
    }
}