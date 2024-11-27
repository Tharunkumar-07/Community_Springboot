package com.capstone.SocietyManagementService.controller;

import com.capstone.SocietyManagementService.dto.SecurityDetailsDtos.SecurityDetailsDto;
import com.capstone.SocietyManagementService.service.SecurityDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/management-service/security-details")
public class SecurityDetailsController {

    @Autowired
    private SecurityDetailsService securityDetailsService;

    @PostMapping()
    public ResponseEntity<SecurityDetailsDto> createSecurity(@RequestBody SecurityDetailsDto securityDetailsDto){
        return new ResponseEntity<>(securityDetailsService.createSecurity(securityDetailsDto), HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<SecurityDetailsDto>> getSecurityDetails(){
        return new ResponseEntity<>(securityDetailsService.getAllSecurityDetails(), HttpStatus.OK);
    }

    @GetMapping("/{securityId}")
    public ResponseEntity<SecurityDetailsDto> getSecurityDetailsById(@PathVariable("securityId") long securityId){
        return new ResponseEntity<>(securityDetailsService.getSecurityDetailsById(securityId), HttpStatus.OK);
    }

    @PutMapping("/update-security-details/{securityId}")
    public ResponseEntity<SecurityDetailsDto> updateSecurity(@PathVariable("securityId") long securityId, @RequestBody SecurityDetailsDto securityDetailsDto){
        return new ResponseEntity<>(securityDetailsService.updateSecurity(securityId, securityDetailsDto), HttpStatus.OK);
    }

    @GetMapping("/get-by-society/{societyId}")
    public ResponseEntity<List<SecurityDetailsDto>> getSecurityDetailsBySociety(@PathVariable("societyId") long societyId){
        return new ResponseEntity<>(securityDetailsService.getSecurityDetailsBySociety(societyId), HttpStatus.OK);
    }

    @GetMapping("/get-by-society/{societyId}/block/{blockNo}")
    public ResponseEntity<List<SecurityDetailsDto>> getSecurityDetailsBySocietyAndBlock(@PathVariable("societyId") long societyId,
                                                                                        @PathVariable("blockNo") String blockNo) {
        return new ResponseEntity<>(securityDetailsService.getSecurityDetailsBySocietyAndBlock(societyId, blockNo), HttpStatus.OK);
    }

    @DeleteMapping("/delete-security-details/{securityId}")
    public ResponseEntity<String> deleteSecurity(@PathVariable("securityId") long securityId){
        securityDetailsService.deleteSecurity(securityId);
        return ResponseEntity.ok("Security Details with ID: "+ securityId+" successfully!!");
    }
}