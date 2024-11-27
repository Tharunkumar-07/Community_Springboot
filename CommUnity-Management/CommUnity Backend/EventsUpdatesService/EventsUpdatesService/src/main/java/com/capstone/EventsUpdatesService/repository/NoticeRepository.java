package com.capstone.EventsUpdatesService.repository;

import com.capstone.EventsUpdatesService.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findBySocietyId(Long societyId);
}