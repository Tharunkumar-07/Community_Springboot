package com.capstone.SocietyManagementService.service;

import com.capstone.SocietyManagementService.dto.SecurityDetailsDtos.SecurityDetailsDto;
import com.capstone.SocietyManagementService.exception.BlockNotFoundException;
import com.capstone.SocietyManagementService.exception.SecurityDetailsNotFoundException;
import com.capstone.SocietyManagementService.exception.SocietyNotFoundException;
import com.capstone.SocietyManagementService.model.SecurityDetails;
import com.capstone.SocietyManagementService.model.Society;
import com.capstone.SocietyManagementService.repository.SecurityDetailsRepository;
import com.capstone.SocietyManagementService.repository.SocietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SecurityDetailsService {

    @Autowired
    private SecurityDetailsRepository securityDetailsRepository;

    @Autowired
    private SocietyRepository societyRepository;

    public SecurityDetailsDto createSecurity(SecurityDetailsDto securityDetailsDto) {
        Society society = societyRepository.findById(securityDetailsDto.getSocietyId())
                .orElseThrow(() -> new SocietyNotFoundException("Society not found with ID: " + securityDetailsDto.getSocietyId()));

        SecurityDetails securityDetails = dtoToEntity(securityDetailsDto, society);

        SecurityDetails savedSecurityDatails = securityDetailsRepository.save(securityDetails);
        return entityToDto(savedSecurityDatails);
    }

    public List<SecurityDetailsDto> getAllSecurityDetails() {
        return securityDetailsRepository.findAll()
                .stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    public SecurityDetailsDto getSecurityDetailsById(long securityId) {
        return securityDetailsRepository.findBySecurityId(securityId)
                .map(this::entityToDto)
                .orElseThrow(() -> new SecurityDetailsNotFoundException("Security details not found with ID: " + securityId));
    }

    public SecurityDetailsDto updateSecurity(long securityId, SecurityDetailsDto securityDetailsDto) {
        SecurityDetails securityDetails = securityDetailsRepository.findBySecurityId(securityId)
               .orElseThrow(() -> new SecurityDetailsNotFoundException("Security details not found with ID: " + securityDetailsDto.getSecurityId()));

        securityDetails.setSecurityName(securityDetailsDto.getSecurityName());
        securityDetails.setPhoneNo(securityDetailsDto.getPhoneNo());
        securityDetails.setBlockNo(securityDetailsDto.getBlockNo());

        SecurityDetails updatedSecurityDetails = securityDetailsRepository.save(securityDetails);
        return entityToDto(updatedSecurityDetails);
    }

    public void deleteSecurity(long securityId) {
        Optional<SecurityDetails> securityDetails=securityDetailsRepository.findById(securityId);
        if(securityDetails.isPresent()){
            securityDetailsRepository.deleteById(securityId);
        } else {
            throw new SecurityDetailsNotFoundException("Security details not found with ID: " + securityId);
        }
    }

    public List<SecurityDetailsDto> getSecurityDetailsBySociety(long societyId) {
        return securityDetailsRepository.findAllBySocietyId(societyId)
               .stream()
               .map(this::entityToDto)
               .collect(Collectors.toList());
    }

    public List<SecurityDetailsDto> getSecurityDetailsBySocietyAndBlock(long societyId, String blockNo) {
        // Check if the society exists by its ID
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new SocietyNotFoundException("Society not found with ID: " + societyId));

        // Check if the blockNo exists for the given society
        boolean blockExists = securityDetailsRepository.existsBySocietyIdAndBlockNo(societyId, blockNo);
        if (!blockExists) {
            throw new BlockNotFoundException("Block " + blockNo + " not found in Society ID: " + societyId);
        }

        // Retrieve security details for the given society and blockNo
        return securityDetailsRepository.findAllBySocietyIdAndBlockNo(societyId, blockNo)
                .stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }


    private SecurityDetails dtoToEntity(SecurityDetailsDto securityDetailsDto, Society society) {
        SecurityDetails securityDetails = new SecurityDetails();
        securityDetails.setSecurityName(securityDetailsDto.getSecurityName());
        securityDetails.setPhoneNo(securityDetailsDto.getPhoneNo());
        securityDetails.setBlockNo(securityDetailsDto.getBlockNo());
        securityDetails.setSociety(society);

        return securityDetails;
    }

    private SecurityDetailsDto entityToDto(SecurityDetails securityDetails) {
        SecurityDetailsDto securityDetailsDto = new SecurityDetailsDto();
        securityDetailsDto.setSecurityId(securityDetails.getSecurityId());
        securityDetailsDto.setSecurityName(securityDetails.getSecurityName());
        securityDetailsDto.setPhoneNo(securityDetails.getPhoneNo());
        securityDetailsDto.setBlockNo(securityDetails.getBlockNo());
        securityDetailsDto.setSocietyId(securityDetails.getSociety().getId());

        return securityDetailsDto;
    }
}