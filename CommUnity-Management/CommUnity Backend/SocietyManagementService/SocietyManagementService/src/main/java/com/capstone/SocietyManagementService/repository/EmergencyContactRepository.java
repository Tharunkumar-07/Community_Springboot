package com.capstone.SocietyManagementService.repository;

import com.capstone.SocietyManagementService.model.EmergencyContact;
import com.capstone.SocietyManagementService.model.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContact, Long> {
    Optional<EmergencyContact> findByEmergencyId(Long emergencyId);

    void deleteByEmergencyId(Long emergencyId);

    List<EmergencyContact> findAllBySociety(Society society);
}