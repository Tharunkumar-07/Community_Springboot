package com.capstone.SocietyManagementService.service;

import com.capstone.SocietyManagementService.dto.SecurityDetailsDtos.SecurityDetailsDto;
import com.capstone.SocietyManagementService.dto.emergencyContactDtos.EmergencyContactDto;
import com.capstone.SocietyManagementService.dto.flatdtos.Flatdto;
import com.capstone.SocietyManagementService.dto.societydtos.FeignResponses.EventResponse;
import com.capstone.SocietyManagementService.dto.societydtos.FeignResponses.NoticeResponse;
import com.capstone.SocietyManagementService.dto.societydtos.SocietyRequest;
import com.capstone.SocietyManagementService.dto.societydtos.SocietyResponse;
import com.capstone.SocietyManagementService.exception.SocietyNotFoundException;
import com.capstone.SocietyManagementService.feign.EventClient;
import com.capstone.SocietyManagementService.feign.NoticeClient;
import com.capstone.SocietyManagementService.model.*;
import com.capstone.SocietyManagementService.repository.FlatRepository;
import com.capstone.SocietyManagementService.repository.ParkingRepository;
import com.capstone.SocietyManagementService.repository.ResidentRepository;
import com.capstone.SocietyManagementService.repository.SocietyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SocietyService {

    @Autowired
    private SocietyRepository repo;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private NoticeClient noticeClient;

    @Autowired
    private EventClient eventClient;

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private ParkingRepository parkingRepository;

    //Method to create a new society
    @Transactional
    public SocietyResponse createSociety(SocietyRequest societyRequest) {
        Society newSociety = dtoToEntity(societyRequest);
        Society savedSociety = repo.save(newSociety);

        // Extract admin details from SocietyRequest and store them as a resident
        Resident adminResident = new Resident();
        adminResident.setName(societyRequest.getName());
        adminResident.setPhoneNo(societyRequest.getPhoneNo());
        adminResident.setPostal(societyRequest.getPostal());
        adminResident.setEmail(societyRequest.getEmail());
        adminResident.setSocietyName(savedSociety.getSocietyName());
        adminResident.setSocietyId(savedSociety.getId());
        adminResident.setRole(Role.ADMIN);

        Flat adminFlat=new Flat();
        adminFlat.setFlatNo("ADMIN-FL"+savedSociety.getId());
        adminFlat.setSociety(savedSociety);
        Flat savedAdminFlat=flatRepository.save(adminFlat);
        adminResident.setFlatNo(savedAdminFlat.getFlatNo());
        adminResident.setFlat(savedAdminFlat);
        residentRepository.save(adminResident);

        //save the parking for the ADMIN
        Parking parking = new Parking();
        parking.setParkingNo("P-" + savedAdminFlat.getFlatNo());
        parking.setFlatNo(savedAdminFlat.getFlatNo());
        parking.setFlat(savedAdminFlat);
        parking.setSociety(savedSociety);
        parkingRepository.save(parking);
        return entityToDto(savedSociety);
    }

    //Method to get all societies
    public List<SocietyResponse> getAllSociety() {
        List<Society> societies = repo.findAll();
        return societies.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    //Method to get society by id
    public SocietyResponse getSocietyById(Long id) {
        Optional<Society> society = repo.findById(id);
        if(society.isPresent()){
            return entityToDto(society.get());
        }
        throw new SocietyNotFoundException("Society not found with ID: "+id);
    }

    //Method to delete society by id
    public void deleteSocietyById(Long id) {
        Optional<Society> societyToDelete= repo.findById(id);
        if(societyToDelete.isPresent()){
            repo.deleteById(id);
        }
        else{
            throw new SocietyNotFoundException("Society not found with the ID: "+id);
        }
    }

    //accessing through feign client
    public List<NoticeResponse> getNoticesBySocietyId(Long societyId) {
        return noticeClient.getNoticesBySocietyId(societyId);
    }

    public List<EventResponse> getEventsBySocietyId(Long societyId) {
        return eventClient.getEventsBySocietyId(societyId);
    }

    public SocietyResponse getSocietyByEmail(String email) {
        Society society = repo.findByEmail(email);
        if(society!= null){
            return entityToDto(society);
        }
        throw new SocietyNotFoundException("Society not found with email: "+email);
    }
    
    //Method to convert entity to dto
    private SocietyResponse entityToDto(Society savedSociety) {
        SocietyResponse societyDto = new SocietyResponse();
        societyDto.setId(savedSociety.getId());
        societyDto.setName(savedSociety.getName());
        societyDto.setPhoneNo(savedSociety.getPhoneNo());
        societyDto.setSocietyName(savedSociety.getSocietyName());
        societyDto.setSocietyAddress(savedSociety.getSocietyAddress());
        societyDto.setCity(savedSociety.getCity());
        societyDto.setDistrict(savedSociety.getDistrict());
        societyDto.setPostal(savedSociety.getPostal());
        societyDto.setEmail(savedSociety.getEmail());

        // If the flat list is empty then create an empty list
        if (savedSociety.getFlats() == null) {
            List<Flatdto> Flatdtos = new ArrayList<>();
            societyDto.setFlats(Flatdtos);
        } else {
            // Convert flat entities to flat DTOs
            List<Flatdto> Flatdtos = savedSociety.getFlats().stream()
                    .map(flat -> {
                        Flatdto Flatdto = new Flatdto();
                        Flatdto.setFlatId(flat.getFlatId());
                        Flatdto.setFlatNo(flat.getFlatNo());
                        Flatdto.setSocietyId(flat.getSociety().getId());
                        return Flatdto;
                    }).collect(Collectors.toList());
            societyDto.setFlats(Flatdtos);
        }

        // If the emergency contacts list is empty, create an empty list
        if (savedSociety.getEmergencyContacts() == null) {
            List<EmergencyContactDto> emergencyContactDto = new ArrayList<>();
            societyDto.setEmergencyContacts(emergencyContactDto);
        } else {
            // Convert emergency contact entities to emergency contact DTOs
            List<EmergencyContactDto> emergencyContactDtos = savedSociety.getEmergencyContacts().stream()
                    .map(contact -> {
                        EmergencyContactDto emergencyContactDto = new EmergencyContactDto();
                        emergencyContactDto.setEmergencyId(contact.getEmergencyId());
                        emergencyContactDto.setPersonName(contact.getPersonName());
                        emergencyContactDto.setServiceType(contact.getServiceType());
                        emergencyContactDto.setPhoneNo(contact.getPhoneNo());
                        emergencyContactDto.setSocietyId(contact.getSociety().getId());
                        return emergencyContactDto;
                    }).collect(Collectors.toList());
            societyDto.setEmergencyContacts(emergencyContactDtos);
        }

        // If the security details list is empty, create an empty list
        if (savedSociety.getSecurityDetails() == null) {
            List<SecurityDetailsDto> securityDetailsDtos = new ArrayList<>();
            societyDto.setSecurityDetails(securityDetailsDtos);
        } else {
            // Convert security details entities to security details DTOs
            List<SecurityDetailsDto> securityDetailsDtos = savedSociety.getSecurityDetails().stream()
                    .map(security -> {
                        SecurityDetailsDto securityDetailsDto = new SecurityDetailsDto();
                        securityDetailsDto.setSecurityId(security.getSecurityId());
                        securityDetailsDto.setSecurityName(security.getSecurityName());
                        securityDetailsDto.setPhoneNo(security.getPhoneNo());
                        securityDetailsDto.setBlockNo(security.getBlockNo());
                        securityDetailsDto.setSocietyId(security.getSociety().getId());
                        return securityDetailsDto;
                    }).collect(Collectors.toList());
            societyDto.setSecurityDetails(securityDetailsDtos);
        }

        return societyDto;
    }

    //Method to convert dto to entity
    private Society dtoToEntity(SocietyRequest societyRequest) {
        Society society=new Society();
        society.setId(societyRequest.getId());
        society.setName(societyRequest.getName());
        society.setPhoneNo(societyRequest.getPhoneNo());
        society.setSocietyName(societyRequest.getSocietyName());
        society.setSocietyAddress(societyRequest.getSocietyAddress());
        society.setCity(societyRequest.getCity());
        society.setDistrict(societyRequest.getDistrict());
        society.setPostal(societyRequest.getPostal());
        society.setEmail(societyRequest.getEmail());
        return society;
    }

}