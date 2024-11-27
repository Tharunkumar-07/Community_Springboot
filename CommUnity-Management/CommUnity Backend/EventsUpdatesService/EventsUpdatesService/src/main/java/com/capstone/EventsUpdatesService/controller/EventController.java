package com.capstone.EventsUpdatesService.controller;

import com.capstone.EventsUpdatesService.dto.eventDtos.EventDto;
import com.capstone.EventsUpdatesService.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community/event-service/event")
public class EventController {

    @Autowired
    private EventService eventService;

    // Create an event
    @PostMapping("/create-event")
    public ResponseEntity<EventDto> createEvent(@RequestBody EventDto eventDto) {
        EventDto createdEvent = eventService.createEvent(eventDto);
        return ResponseEntity.ok(createdEvent);
    }

    // Get all events
    @GetMapping("/get-events")
    public ResponseEntity<List<EventDto>> getAllEvents() {
        List<EventDto> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    // Get event by ID
    @GetMapping("/get-events/{eventId}")
    public ResponseEntity<EventDto> getEventById(@PathVariable long eventId) {
        EventDto eventDto = eventService.getEventById(eventId);
        return ResponseEntity.ok(eventDto);
    }

    // Get events by societyId
    @GetMapping("/event-by-society/{societyId}")
    public ResponseEntity<List<EventDto>> getEventsBySocietyId(@PathVariable long societyId) {
        List<EventDto> events = eventService.getEventsBySocietyId(societyId);
        return ResponseEntity.ok(events);
    }

    // Update an event
    @PutMapping("/update-events/{eventId}")
    public ResponseEntity<EventDto> updateEvent(@PathVariable long eventId, @RequestBody EventDto eventDto) {
        EventDto updatedEvent = eventService.updateEvent(eventId, eventDto);
        return ResponseEntity.ok(updatedEvent);
    }

    // Delete an event
    @DeleteMapping("delete-events/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable long eventId) {
        eventService.deleteEvent(eventId);
        return new ResponseEntity<>("Event with ID: "+ eventId+" deleted successfully!!", HttpStatus.OK);
    }
}