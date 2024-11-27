package com.capstone.PaymentService.repository;

import com.capstone.PaymentService.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByFlatNoAndSocietyIdAndStatus(String flatNo, Long societyId, String pending);

    List<Payment> findAllBySocietyId(long societyId);

    Payment findByFlatNoAndSocietyIdAndStatus(String flatNo, long societyId, String status);
}