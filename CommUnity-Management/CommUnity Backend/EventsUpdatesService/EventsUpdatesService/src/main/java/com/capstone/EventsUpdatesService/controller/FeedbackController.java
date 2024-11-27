package com.capstone.EventsUpdatesService.controller;

import com.capstone.EventsUpdatesService.dto.feedbackDtos.FeedbackDto;
import com.capstone.EventsUpdatesService.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/event-service/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Post a new feedback
    @PostMapping("/create-feedback")
    public ResponseEntity<FeedbackDto> postFeedback(@RequestBody FeedbackDto feedbackDto) {
        FeedbackDto createdFeedback = feedbackService.createFeedback(feedbackDto);
        return new ResponseEntity<>(createdFeedback, HttpStatus.CREATED);
    }

    // Get all feedbacks
    @GetMapping("/get-feedbacks")
    public ResponseEntity<List<FeedbackDto>> getAllFeedbacks() {
        List<FeedbackDto> feedbacks = feedbackService.getAllFeedbacks();
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }

    // Get feedbacks by eventId
    @GetMapping("/by-event/{eventId}")
    public ResponseEntity<List<FeedbackDto>> getFeedbacksByEventId(@PathVariable("eventId") Long eventId) {
        List<FeedbackDto> feedbacks = feedbackService.getFeedbacksByEventId(eventId);
        return new ResponseEntity<>(feedbacks, HttpStatus.OK);
    }
}
