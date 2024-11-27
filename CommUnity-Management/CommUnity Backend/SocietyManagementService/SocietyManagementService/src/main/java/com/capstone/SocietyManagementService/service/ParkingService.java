package com.capstone.SocietyManagementService.service;

import com.capstone.SocietyManagementService.dto.Parkingdtos.ParkingDto;
import com.capstone.SocietyManagementService.exception.ParkingNotFoundException;
import com.capstone.SocietyManagementService.exception.SocietyNotFoundException;
import com.capstone.SocietyManagementService.model.Parking;
import com.capstone.SocietyManagementService.repository.ParkingRepository;
import com.capstone.SocietyManagementService.repository.SocietyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ParkingService {

    @Autowired
    private ParkingRepository parkingRepository;

    @Autowired
    private SocietyRepository societyRepository;

    public List<ParkingDto> getAllParking() {
        return parkingRepository.findAll().stream().map(this::entityTDto).collect(Collectors.toList());
    }

    private ParkingDto entityTDto(Parking parking){
        ParkingDto parkingDto=new ParkingDto();
        parkingDto.setParkingId(parking.getParkingId());
        parkingDto.setParkingNo(parking.getParkingNo());
        parkingDto.setFlatNo(parking.getFlatNo());
        parkingDto.setFlatId(parking.getFlat().getFlatId());
        parkingDto.setSocietyId(parking.getSociety().getId());

        return parkingDto;
    }

    public ParkingDto getParkingById(Long parkingId) {
        return parkingRepository.findById(parkingId)
                .map(this::entityTDto)
                .orElseThrow(() -> new ParkingNotFoundException("Parking not found with ID: " + parkingId));
    }

    public List<ParkingDto> getParkingBySocietyId(Long societyId) {
        if(societyRepository.findById(societyId).isPresent()){
            return parkingRepository.findAllBySociety_Id(societyId)
                    .stream()
                    .map(this::entityTDto)
                    .collect(Collectors.toList());
        }
        throw new SocietyNotFoundException("Society not found with ID: "+societyId);

    }
}