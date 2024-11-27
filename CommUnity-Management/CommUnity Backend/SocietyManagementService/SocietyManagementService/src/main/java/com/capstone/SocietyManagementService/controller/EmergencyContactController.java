package com.capstone.SocietyManagementService.controller;

import com.capstone.SocietyManagementService.dto.emergencyContactDtos.EmergencyContactDto;
import com.capstone.SocietyManagementService.service.EmergencyContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/management-service/emergency-contacts")
public class EmergencyContactController {

    @Autowired
    private EmergencyContactService emergencyContactService;

    @PostMapping
    public ResponseEntity<EmergencyContactDto> createEmergencyContact(@RequestBody EmergencyContactDto emergencyContactRequest) {
        EmergencyContactDto emergencyContactResponse = emergencyContactService.createEmergencyContact(emergencyContactRequest);
        return new ResponseEntity<>(emergencyContactResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmergencyContactDto>> getAllEmergencyContacts() {
        List<EmergencyContactDto> emergencyContacts = emergencyContactService.getAllEmergencyContacts();
        return new ResponseEntity<>(emergencyContacts, HttpStatus.OK);
    }

    @GetMapping("/{emergencyId}")
    public ResponseEntity<EmergencyContactDto> getEmergencyContactById(@PathVariable("emergencyId") Long emergencyId) {
        EmergencyContactDto emergencyContact = emergencyContactService.getEmergencyContactById(emergencyId);
        return new ResponseEntity<>(emergencyContact, HttpStatus.OK);
    }

    @GetMapping("/get-by-society/{societyId}")
    public ResponseEntity<List<EmergencyContactDto>> getContactsBySocietyId(@PathVariable("societyId") long societyId){
        List<EmergencyContactDto> emergencyContactList = emergencyContactService.getEmergencyContactBySocietyId(societyId);
        return new ResponseEntity<>(emergencyContactList, HttpStatus.OK);
    }

    @PutMapping("/update-emergency-contact/{emergencyId}")
    public ResponseEntity<EmergencyContactDto> updateEmergencyContact(@PathVariable("emergencyId") Long emergencyId, @RequestBody EmergencyContactDto emergencyContactRequest) {
        EmergencyContactDto updatedEmergencyContact = emergencyContactService.updateEmergencyContact(emergencyId, emergencyContactRequest);
        return new ResponseEntity<>(updatedEmergencyContact, HttpStatus.OK);
    }

    @DeleteMapping("/delete-emergency-contact/{emergencyId}")
    public ResponseEntity<String> deleteEmergencyContact(@PathVariable("emergencyId") Long emergencyId) {
        emergencyContactService.deleteEmergencyContact(emergencyId);
        return new ResponseEntity<>("Emergency Contact successfully deleted with ID: "+emergencyId, HttpStatus.NO_CONTENT);
    }
}
