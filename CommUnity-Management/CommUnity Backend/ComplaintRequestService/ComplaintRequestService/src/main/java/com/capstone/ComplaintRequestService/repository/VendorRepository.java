package com.capstone.ComplaintRequestService.repository;

import com.capstone.ComplaintRequestService.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByServiceAndSocietyId(String service, Long societyId);

    List<Vendor> findBySocietyId(Long societyId);
}