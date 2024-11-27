package com.capstone.SocietyManagementService.repository;

import com.capstone.SocietyManagementService.model.SecurityDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SecurityDetailsRepository extends JpaRepository<SecurityDetails, Long> {
    Optional<SecurityDetails> findBySecurityId(long securityId);

    List<SecurityDetails> findAllBySocietyId(long societyId);

    boolean existsBySocietyIdAndBlockNo(long societyId, String blockNo);

    List<SecurityDetails> findAllBySocietyIdAndBlockNo(long societyId, String blockNo);
}