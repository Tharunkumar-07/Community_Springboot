package com.capstone.EventsUpdatesService.repository;

import com.capstone.EventsUpdatesService.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findBySocietyId(long societyId);
}