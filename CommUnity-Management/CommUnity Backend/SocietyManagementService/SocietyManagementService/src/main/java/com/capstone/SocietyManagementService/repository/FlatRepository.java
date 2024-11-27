package com.capstone.SocietyManagementService.repository;

import com.capstone.SocietyManagementService.model.Flat;
import com.capstone.SocietyManagementService.model.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FlatRepository extends JpaRepository<Flat, Long> {
    Optional<Flat> findByFlatNoAndSociety(String flatNo, Society society);
}