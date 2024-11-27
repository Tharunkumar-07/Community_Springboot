package com.capstone.ComplaintRequestService.controller;


import com.capstone.ComplaintRequestService.dto.complaintDtos.ComplaintRequest; JGE
import com.capstone.ComplaintRequestService.dto.complaintDtos.ComplaintResponse;
import com.capstone.ComplaintRequestService.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/complaint-service/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping("/create-complaint")
    public ResponseEntity<ComplaintResponse> createComplaint(@RequestBody ComplaintRequest complaintRequest) {
        ComplaintResponse createdComplaint = complaintService.createComplaint(complaintRequest);
        return new ResponseEntity<>(createdComplaint, HttpStatus.CREATED);
    }

    @GetMapping("/get-complaints")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        List<ComplaintResponse> complaints = complaintService.getAllComplaints();
        return new ResponseEntity<>(complaints, HttpStatus.OK);
    }

    @GetMapping("/get-complaints/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable("id") long complaintId) {
        ComplaintResponse complaint = complaintService.getComplaintById(complaintId);
        return new ResponseEntity<>(complaint, HttpStatus.OK);
    }

    @PutMapping("/update-complaint/{id}")
    public ResponseEntity<ComplaintResponse> updateComplaint(@PathVariable("id") long complaintId, @RequestBody ComplaintRequest complaintRequest) {
        ComplaintResponse updatedComplaint = complaintService.updateComplaint(complaintId, complaintRequest);
        return new ResponseEntity<>(updatedComplaint, HttpStatus.OK);
    }

    @DeleteMapping("/delete-complaint/{id}")
    public ResponseEntity<String> deleteComplaint(@PathVariable("id") long complaintId) {
        complaintService.deleteComplaint(complaintId);
        return new ResponseEntity<>("Complaint deleted successfully.", HttpStatus.OK);
    }

    @GetMapping("/by-resident/{residentId}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByResidentId(@PathVariable("residentId") long residentId) {
        List<ComplaintResponse> complaints = complaintService.getComplaintsByResidentId(residentId);
        return new ResponseEntity<>(complaints, HttpStatus.OK);
    }

    @GetMapping("/by-society/{societyId}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsBySocietyId(@PathVariable("societyId") long societyId) {
        List<ComplaintResponse> complaints = complaintService.getComplaintsBySocietyId(societyId);
        return new ResponseEntity<>(complaints, HttpStatus.OK);
    }

    @GetMapping("/by-society/open/{societyId}")
    public ResponseEntity<List<ComplaintResponse>> getOpenComplaintsBySocietyId(@PathVariable("societyId") long societyId) {
        List<ComplaintResponse> openComplaints = complaintService.getOpenComplaintsBySocietyId(societyId);
        return new ResponseEntity<>(openComplaints, HttpStatus.OK);
    }
}