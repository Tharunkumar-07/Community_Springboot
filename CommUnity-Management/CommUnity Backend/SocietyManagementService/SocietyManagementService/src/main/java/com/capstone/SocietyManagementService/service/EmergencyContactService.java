package com.capstone.SocietyManagementService.service;

import com.capstone.SocietyManagementService.dto.emergencyContactDtos.EmergencyContactDto;
import com.capstone.SocietyManagementService.exception.EmergencyContactNotFoundException;
import com.capstone.SocietyManagementService.exception.SocietyNotFoundException;
import com.capstone.SocietyManagementService.model.EmergencyContact;
import com.capstone.SocietyManagementService.model.Society;
import com.capstone.SocietyManagementService.repository.EmergencyContactRepository;
import com.capstone.SocietyManagementService.repository.SocietyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class EmergencyContactService {

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private SocietyRepository societyRepository;

    public EmergencyContactDto createEmergencyContact(EmergencyContactDto emergencyContactDto) {
        Society society = societyRepository.findById(emergencyContactDto.getSocietyId())
                .orElseThrow(() -> new SocietyNotFoundException("Society not found with ID: " + emergencyContactDto.getSocietyId()));

        EmergencyContact emergencyContact = dtoToEntity(emergencyContactDto, society);

        EmergencyContact savedContact=emergencyContactRepository.save(emergencyContact);
        return entityToDto(savedContact);
    }

    public List<EmergencyContactDto> getAllEmergencyContacts() {
        List<EmergencyContact> emergencyContacts = emergencyContactRepository.findAll();
        return emergencyContacts.stream()
               .map(this::entityToDto)
               .collect(Collectors.toList());
    }

    public EmergencyContactDto getEmergencyContactById(Long emergencyId) {
        return emergencyContactRepository.findByEmergencyId(emergencyId)
               .map(this::entityToDto)
               .orElseThrow(() -> new EmergencyContactNotFoundException("Emergency contact not found with ID: " + emergencyId));
    }

    public EmergencyContactDto updateEmergencyContact(Long emergencyId, EmergencyContactDto emergencyContactRequest) {
        EmergencyContact existingEmergencyContact = emergencyContactRepository.findByEmergencyId(emergencyId)
               .orElseThrow(() -> new EmergencyContactNotFoundException("Emergency contact not found with ID: " + emergencyId));

        existingEmergencyContact.setPersonName(emergencyContactRequest.getPersonName());
        existingEmergencyContact.setServiceType(emergencyContactRequest.getServiceType());
        existingEmergencyContact.setPhoneNo(emergencyContactRequest.getPhoneNo());

        EmergencyContact updatedEmergencyContact = emergencyContactRepository.save(existingEmergencyContact);
        return entityToDto(updatedEmergencyContact);
    }

    public void deleteEmergencyContact(Long emergencyId) {
        EmergencyContact existingEmergencyContact = emergencyContactRepository.findByEmergencyId(emergencyId)
                .orElseThrow(() -> new EmergencyContactNotFoundException("Emergency contact not found with ID: " + emergencyId));

        emergencyContactRepository.delete(existingEmergencyContact);
    }

    public List<EmergencyContactDto> getEmergencyContactBySocietyId(long societyId) {
        Society society = societyRepository.findById(societyId)
               .orElseThrow(() -> new SocietyNotFoundException("Society not found with ID: " + societyId));

        List<EmergencyContact> emergencyContacts = emergencyContactRepository.findAllBySociety(society);
        return emergencyContacts.stream()
               .map(this::entityToDto)
               .collect(Collectors.toList());
    }

    private EmergencyContact dtoToEntity(EmergencyContactDto emergencyContactDto,Society society){
        EmergencyContact emergencyContact = new EmergencyContact();
        emergencyContact.setPersonName(emergencyContactDto.getPersonName());
        emergencyContact.setServiceType(emergencyContactDto.getServiceType());
        emergencyContact.setPhoneNo(emergencyContactDto.getPhoneNo());
        emergencyContact.setSociety(society);

        return emergencyContact;
    }

    private EmergencyContactDto entityToDto(EmergencyContact emergencyContact) {
        EmergencyContactDto emergencyContactDto = new EmergencyContactDto();
        emergencyContactDto.setEmergencyId(emergencyContact.getEmergencyId());
        emergencyContactDto.setPersonName(emergencyContact.getPersonName());
        emergencyContactDto.setServiceType(emergencyContact.getServiceType());
        emergencyContactDto.setPhoneNo(emergencyContact.getPhoneNo());
        emergencyContactDto.setSocietyId(emergencyContact.getSociety().getId());

        return emergencyContactDto;
    }
}