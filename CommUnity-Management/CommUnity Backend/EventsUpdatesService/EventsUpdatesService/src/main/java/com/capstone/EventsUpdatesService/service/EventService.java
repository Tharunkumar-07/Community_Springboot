package com.capstone.EventsUpdatesService.service;

import com.capstone.EventsUpdatesService.dto.eventDtos.EventDto;
import com.capstone.EventsUpdatesService.exception.EventNotFoundException;
import com.capstone.EventsUpdatesService.model.Event;
import com.capstone.EventsUpdatesService.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // Create an event
    public EventDto createEvent(EventDto eventDto) {
        Event newEvent = dtoToEntity(eventDto);
        Event savedEvent = eventRepository.save(newEvent);
        return entityToDto(savedEvent);
    }

    // Get all events
    public List<EventDto> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return events.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Get event by ID
    public EventDto getEventById(long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));
        return entityToDto(event);
    }

    // Get events by societyId
    public List<EventDto> getEventsBySocietyId(long societyId) {
        List<Event> events = eventRepository.findBySocietyId(societyId);
        return events.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Update an event
    public EventDto updateEvent(long eventId, EventDto eventDto) {
        Event existingEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));

        existingEvent.setEventName(eventDto.getEventName());
        existingEvent.setEventDate(eventDto.getEventDate() != null ? eventDto.getEventDate() : new Date());
        existingEvent.setEventDetails(eventDto.getEventDetails());
        existingEvent.setEventImage(eventDto.getEventImage());
        existingEvent.setSocietyId(eventDto.getSocietyId());

        Event updatedEvent = eventRepository.save(existingEvent);
        return entityToDto(updatedEvent);
    }

    // Delete an event
    public void deleteEvent(long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID: " + eventId));
        eventRepository.delete(event);
    }

    // Convert EventDto to Event entity
    private Event dtoToEntity(EventDto eventDto) {
        Event event = new Event();
        event.setEventName(eventDto.getEventName());
        event.setEventDate(eventDto.getEventDate() != null ? eventDto.getEventDate() : new Date());
        event.setEventDetails(eventDto.getEventDetails());
        event.setEventImage(eventDto.getEventImage());
        event.setSocietyId(eventDto.getSocietyId());
        return event;
    }

    // Convert Event entity to EventDto
    private EventDto entityToDto(Event event) {
        EventDto eventDto = new EventDto();
        eventDto.setEventId(event.getEventId());
        eventDto.setEventName(event.getEventName());
        eventDto.setEventDate(event.getEventDate());
        eventDto.setEventDetails(event.getEventDetails());
        eventDto.setEventImage(event.getEventImage());
        eventDto.setSocietyId(event.getSocietyId());
        return eventDto;
    }
}