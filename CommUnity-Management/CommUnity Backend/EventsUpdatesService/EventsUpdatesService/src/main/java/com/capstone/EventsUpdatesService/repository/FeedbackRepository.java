package com.capstone.EventsUpdatesService.repository;

import com.capstone.EventsUpdatesService.model.Event;
import com.capstone.EventsUpdatesService.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEvent(Event event);
}