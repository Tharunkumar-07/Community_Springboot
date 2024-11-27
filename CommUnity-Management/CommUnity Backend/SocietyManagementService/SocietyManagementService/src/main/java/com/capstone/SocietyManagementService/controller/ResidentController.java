package com.capstone.SocietyManagementService.controller;

import com.capstone.SocietyManagementService.dto.residentdtos.ResidentRequest;
import com.capstone.SocietyManagementService.dto.residentdtos.ResidentRequestToUpdate;
import com.capstone.SocietyManagementService.dto.residentdtos.ResidentResponse;
import com.capstone.SocietyManagementService.service.ResidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/management-service/residents")
public class ResidentController {

    @Autowired
    private ResidentService residentService;

    // Endpoint to create a new resident
    @PostMapping()
    public ResponseEntity<ResidentResponse> createResident(@RequestBody ResidentRequest residentRequest) {
        return new ResponseEntity<>(residentService.createResident(residentRequest), HttpStatus.CREATED);
    }

    // Endpoint to get all residents
    @GetMapping("/getAll")
    public ResponseEntity<List<ResidentResponse>> getAllResidents() {
        List<ResidentResponse> residents = residentService.getAllResidents();
        return ResponseEntity.ok(residents);
    }

    @GetMapping("/{residentId}")
    public ResponseEntity<ResidentResponse> getResidentById(@PathVariable("residentId") Long residentId) {
        ResidentResponse resident = residentService.getResidentById(residentId);
        return ResponseEntity.ok(resident);
    }

    @GetMapping("/findby-email/{email}")
    public ResponseEntity<ResidentResponse> getResidentByEmail(@PathVariable("email") String email) {
        ResidentResponse resident = residentService.getResidentByEmail(email);
        return ResponseEntity.ok(resident);
    }

    @GetMapping("/findby-societyid/{societyId}")
    public ResponseEntity<List<ResidentResponse>> getResidentBySocietyId(@PathVariable("societyId") long societyId){
        return new ResponseEntity<>(residentService.getResidentBySocietyId(societyId), HttpStatus.OK);
    }

    @PutMapping("/update-user/{residentId}")
    public ResponseEntity<ResidentResponse> updateResident(@PathVariable("residentId") Long residentId, @RequestBody ResidentRequestToUpdate residentRequestToUpdate) {
        return ResponseEntity.ok(residentService.updateResident(residentId, residentRequestToUpdate));
    }

    @DeleteMapping("/delete-resident/{residentId}")
    public ResponseEntity<String> deleteResident(@PathVariable Long residentId) {
        residentService.deleteResident(residentId);
        return new ResponseEntity<>("Resident with ID: "+residentId+" deleted successfully", HttpStatus.OK);
    }
}