package com.capstone.SocietyManagementService.repository;

import com.capstone.SocietyManagementService.model.Parking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, Long> {
    List<Parking> findAllBySociety_Id(Long societyId);
}
