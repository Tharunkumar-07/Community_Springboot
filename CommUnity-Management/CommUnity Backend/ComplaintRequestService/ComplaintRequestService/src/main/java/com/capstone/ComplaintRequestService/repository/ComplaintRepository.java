package com.capstone.ComplaintRequestService.repository;

import com.capstone.ComplaintRequestService.ComplaintStatus;
import com.capstone.ComplaintRequestService.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByResidentId(long residentId);

    List<Complaint> findBySocietyId(long societyId);

    List<Complaint> findBySocietyIdAndStatus(long societyId, ComplaintStatus complaintStatus);
}