package com.capstone.SocietyManagementService.repository;

import com.capstone.SocietyManagementService.model.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocietyRepository extends JpaRepository<Society, Long> {
    Optional<Society> findBySocietyNameAndPostal(String societyName, String postal);

    Society findByEmail(String email);
}