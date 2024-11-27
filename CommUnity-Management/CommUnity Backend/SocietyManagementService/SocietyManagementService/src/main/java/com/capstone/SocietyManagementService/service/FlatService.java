package com.capstone.SocietyManagementService.service;

import com.capstone.SocietyManagementService.dto.flatdtos.Flatdto;
import com.capstone.SocietyManagementService.exception.DuplicateFlatException;
import com.capstone.SocietyManagementService.exception.FlatNotFoundException;
import com.capstone.SocietyManagementService.exception.SocietyNotFoundException;
import com.capstone.SocietyManagementService.model.Flat;
import com.capstone.SocietyManagementService.model.Society;
import com.capstone.SocietyManagementService.repository.FlatRepository;
import com.capstone.SocietyManagementService.repository.SocietyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FlatService {

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private SocietyRepository societyRepository;

    //Method to create a flat
    @Transactional
    public Flatdto createFlat(Flatdto flatDto) {
        // Find the Society by ID
        Society society = societyRepository.findById(flatDto.getSocietyId())
                .orElseThrow(() -> new SocietyNotFoundException("Society not found with ID: " + flatDto.getSocietyId()));

        // Check if a flat with the same flatNo exists in the same society
        Optional<Flat> existingFlat = flatRepository.findByFlatNoAndSociety(flatDto.getFlatNo(), society);
        if (existingFlat.isPresent()) {
            throw new DuplicateFlatException("Flat number " + flatDto.getFlatNo() + " already exists in society " + society.getSocietyName());
        }

        // Convert DTO to Entity and set the society
        Flat newFlat = dtoToEntity(flatDto);
        newFlat.setSociety(society);

        // Save the new flat
        Flat savedFlat = flatRepository.save(newFlat);
        // Convert the saved flat back to DTO and return
        return entityToDto(savedFlat);
    }

    //Method to get all flats
    public List<Flatdto> getAllFlat(){
        List<Flat> flats = flatRepository.findAll();
        return flats.stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    //Method to get a flat by flatId
    public Flatdto getFlatById(Long flatId) {
        Optional<Flat> flat = flatRepository.findById(flatId);
        if(flat.isPresent()){
            return entityToDto(flat.get());
        }
        throw new FlatNotFoundException("Flat not found with ID: "+flatId);
    }

    //Method to delete a flat by flatId
    public String deleteFlat(Long flatId){
        Optional<Flat> flat=flatRepository.findById(flatId);
        if(flat.isPresent()){
            flatRepository.deleteById(flatId);
            return "Flat with ID: "+flatId+" deleted successfully!";
        }
        throw new FlatNotFoundException("Flat not found with ID: "+flatId);
    }

    // Method to convert entity to dto
    private Flatdto entityToDto(Flat flat) {
        Flatdto flatDto = new Flatdto();
        flatDto.setFlatId(flat.getFlatId());
        flatDto.setFlatNo(flat.getFlatNo());
        flatDto.setSocietyId(flat.getSociety().getId());
        return flatDto;
    }

    // Method to convert dto to entity
    private Flat dtoToEntity(Flatdto flatDto) {
        Flat newFlat = new Flat();
        newFlat.setFlatId(flatDto.getFlatId());
        newFlat.setFlatNo(flatDto.getFlatNo());

        Society society = societyRepository.findById(flatDto.getSocietyId())
                .orElseThrow(() -> new SocietyNotFoundException("Society not found with ID: " + flatDto.getSocietyId()));
        newFlat.setSociety(society);

        return newFlat;
    }
}