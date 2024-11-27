package com.capstone.SocietyManagementService.controller;

import com.capstone.SocietyManagementService.dto.Parkingdtos.ParkingDto;
import com.capstone.SocietyManagementService.service.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/management-service/parking")
public class ParkingController {

    @Autowired
    private ParkingService parkingService;

    @GetMapping()
    public ResponseEntity<List<ParkingDto>> getAllParking() {
        return new ResponseEntity<>(parkingService.getAllParking(), HttpStatus.OK);
    }

    @GetMapping("/{parkingId}")
    public ResponseEntity<ParkingDto> getParkingById(@PathVariable("parkingId") Long parkingId) {
        return new ResponseEntity<>(parkingService.getParkingById(parkingId), HttpStatus.OK);
    }

    @GetMapping("/by-society/{societyId}")
    public ResponseEntity<List<ParkingDto>> getParkingBySocietyId(@PathVariable("societyId") Long societyId) {
        return new ResponseEntity<>(parkingService.getParkingBySocietyId(societyId), HttpStatus.OK);
    }
}
