package com.capstone.SocietyManagementService.service;


import com.capstone.SocietyManagementService.dto.residentdtos.ResidentRequest;
import com.capstone.SocietyManagementService.dto.residentdtos.ResidentRequestToUpdate;
import com.capstone.SocietyManagementService.dto.residentdtos.ResidentResponse;
import com.capstone.SocietyManagementService.exception.ResidentAlreadyExistsException;
import com.capstone.SocietyManagementService.exception.ResidentNotFoundException;
import com.capstone.SocietyManagementService.exception.SocietyNotFoundException;
import com.capstone.SocietyManagementService.model.*;
import com.capstone.SocietyManagementService.repository.FlatRepository;
import com.capstone.SocietyManagementService.repository.ParkingRepository;
import com.capstone.SocietyManagementService.repository.ResidentRepository;
import com.capstone.SocietyManagementService.repository.SocietyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResidentService {

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private ParkingRepository parkingRepository;

    public ResidentResponse createResident(ResidentRequest residentRequest) {
        if (residentRepository.existsByEmail(residentRequest.getEmail())) {
            throw new ResidentAlreadyExistsException("Resident already exists with email: " + residentRequest.getEmail());
        }

        Society society = societyRepository.findBySocietyNameAndPostal(residentRequest.getSocietyName(), residentRequest.getPostal())
                .orElseThrow(() -> new SocietyNotFoundException("Society not found with name: " + residentRequest.getSocietyName() + " and postal: " + residentRequest.getPostal()));

        // Find or create the flat
        Flat flat = flatRepository.findByFlatNoAndSociety(residentRequest.getFlatNo(), society)
                .orElseGet(() -> {
                    Flat newFlat = new Flat();
                    newFlat.setFlatNo(residentRequest.getFlatNo());
                    newFlat.setSociety(society);
                    Flat newSavedFlat=flatRepository.save(newFlat);

                    //save the parking for the resident when a new flat is created
                    Parking parking = new Parking();
                    parking.setParkingNo("P-" + newSavedFlat.getFlatNo());
                    parking.setFlatNo(newSavedFlat.getFlatNo());
                    parking.setFlat(newSavedFlat);
                    parking.setSociety(society);
                    parkingRepository.save(parking);

                    return newSavedFlat;
                });

        Resident newResident=dtoToEntity(residentRequest, flat);

        Resident savedResident = residentRepository.save(newResident);

        return entityToDto(savedResident);
    }

    public List<ResidentResponse> getAllResidents() {
        List<Resident> residents = residentRepository.findAll();
        return residents.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    public ResidentResponse getResidentById(Long residentId) {
        Resident resident = residentRepository.findById(residentId)
               .orElseThrow(() -> new ResidentNotFoundException("Resident not found with ID: " + residentId));
        return entityToDto(resident);
    }

    public ResidentResponse updateResident(Long residentId, ResidentRequestToUpdate residentRequestToUpdate) {
        Resident resident = residentRepository.findById(residentId)
               .orElseThrow(() -> new ResidentNotFoundException("Resident not found with ID: " + residentId));

        resident.setName(residentRequestToUpdate.getName());
        resident.setPhoneNo(residentRequestToUpdate.getPhoneNo());
        resident.setEmail(residentRequestToUpdate.getEmail());
        Resident savedResident = residentRepository.save(resident);

        return entityToDto(savedResident);
    }

    public void deleteResident(Long residentId) {
        if (!residentRepository.existsById(residentId)) {
            throw new ResidentNotFoundException("Resident not found with ID: " + residentId);
        }
        residentRepository.deleteById(residentId);
    }

    public ResidentResponse getResidentByEmail(String email) {
        Resident resident = residentRepository.findByEmail(email)
                .orElseThrow(() -> new ResidentNotFoundException("Resident not found with email: " + email));
        return entityToDto(resident);
    }

    public List<ResidentResponse> getResidentBySocietyId(long societyId) {
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new SocietyNotFoundException("Society not found with ID: " + societyId));
        List<Resident> residents = residentRepository.findAllBySocietyId(societyId);
        return residents.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    private Resident dtoToEntity(ResidentRequest residentRequest, Flat flat) {
        Resident newResident = new Resident();
        newResident.setName(residentRequest.getName());
        newResident.setPhoneNo(residentRequest.getPhoneNo());
        newResident.setEmail(residentRequest.getEmail());
        newResident.setFlatNo(residentRequest.getFlatNo());
        newResident.setPostal(residentRequest.getPostal());
        newResident.setSocietyName(residentRequest.getSocietyName());
        newResident.setSocietyId(flat.getSociety().getId());
        newResident.setRole(Role.RESIDENT);
        newResident.setFlat(flat);
        return newResident;
    }


    private ResidentResponse entityToDto(Resident resident) {
        ResidentResponse residentDto = new ResidentResponse();
        residentDto.setResidentId(resident.getResidentId());
        residentDto.setName(resident.getName());
        residentDto.setPhoneNo(resident.getPhoneNo());
        residentDto.setFlatNo(resident.getFlat().getFlatNo());
        residentDto.setPostal(resident.getFlat().getSociety().getPostal());
        residentDto.setEmail(resident.getEmail());
        residentDto.setSocietyName(resident.getFlat().getSociety().getSocietyName());
        residentDto.setSocietyId(resident.getFlat().getSociety().getId());
        residentDto.setRole(resident.getRole()); // Directly assign Role enum
        return residentDto;
    }

}