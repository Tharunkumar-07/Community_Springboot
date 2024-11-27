package com.capstone.EventsUpdatesService.service;

import com.capstone.EventsUpdatesService.dto.feedbackDtos.FeedbackDto;
import com.capstone.EventsUpdatesService.model.Event;
import com.capstone.EventsUpdatesService.model.Feedback;
import com.capstone.EventsUpdatesService.repository.EventRepository;
import com.capstone.EventsUpdatesService.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private EventRepository eventRepository;

    // Create feedback
    public FeedbackDto createFeedback(FeedbackDto feedbackDto) {
        Event event = eventRepository.findById(feedbackDto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + feedbackDto.getEventId()));

        Feedback feedback = dtoToEntity(feedbackDto, event);

        Feedback savedFeedback = feedbackRepository.save(feedback);

        return entityToDto(savedFeedback);
    }

    // Get all feedbacks
    public List<FeedbackDto> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        return feedbacks.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Get feedbacks by event ID
    public List<FeedbackDto> getFeedbacksByEventId(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        List<Feedback> feedbacks = feedbackRepository.findByEvent(event);

        return feedbacks.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Convert DTO to entity
    private Feedback dtoToEntity(FeedbackDto feedbackDto, Event event) {
        Feedback feedback = new Feedback();
        feedback.setContent(feedbackDto.getContent());
        feedback.setEvent(event);
        return feedback;
    }

    // Convert entity to DTO
    private FeedbackDto entityToDto(Feedback feedback) {
        FeedbackDto feedbackDto = new FeedbackDto();
        feedbackDto.setFeedbackId(feedback.getFeedbackId());
        feedbackDto.setContent(feedback.getContent());
        feedbackDto.setEventId(feedback.getEvent().getEventId());
        return feedbackDto;
    }
}