package com.capstone.ComplaintRequestService.repository;

import com.capstone.ComplaintRequestService.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findBySocietyId(Long societyId);
}