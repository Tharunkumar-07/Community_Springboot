package com.capstone.EventsUpdatesService.service;

import com.capstone.EventsUpdatesService.dto.noticeDtos.NoticeRequest;
import com.capstone.EventsUpdatesService.dto.noticeDtos.NoticeResponse;
import com.capstone.EventsUpdatesService.exception.NoticeNotFoundException;
import com.capstone.EventsUpdatesService.model.Notice;
import com.capstone.EventsUpdatesService.repository.NoticeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    // Create a notice
    public NoticeResponse createNotice(NoticeRequest noticeRequest) {
        Notice newNotice = dtoToEntity(noticeRequest);
        Notice savedNotice = noticeRepository.save(newNotice);
        return entityToDto(savedNotice);
    }

    // Get all notices
    public List<NoticeResponse> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        return notices.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Get a notice by ID
    public NoticeResponse getNoticeById(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));
        return entityToDto(notice);
    }

    // Get notices by societyId
    public List<NoticeResponse> getNoticesBySocietyId(Long societyId) {
        List<Notice> notices = noticeRepository.findBySocietyId(societyId);
        return notices.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    // Update a notice
    @Transactional
    public NoticeResponse updateNotice(Long noticeId, NoticeRequest noticeDto) {
        Notice existingNotice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));

        existingNotice.setHeading(noticeDto.getHeading());
        existingNotice.setContent(noticeDto.getContent());
        existingNotice.setNoticeImage(noticeDto.getNoticeImage());
        existingNotice.setSocietyId(noticeDto.getSocietyId());
        existingNotice.setDatePosted(LocalDateTime.now());

        Notice updatedNotice = noticeRepository.save(existingNotice);
        return entityToDto(updatedNotice);
    }

    // Delete a notice
    public void deleteNotice(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new NoticeNotFoundException("Notice not found with ID: " + noticeId));

        noticeRepository.delete(notice);
    }

    // Convert NoticeRequest DTO to Notice entity
    private Notice dtoToEntity(NoticeRequest noticeDto) {
        Notice notice = new Notice();
        notice.setHeading(noticeDto.getHeading());
        notice.setContent(noticeDto.getContent());
        notice.setNoticeImage(noticeDto.getNoticeImage());
        notice.setDatePosted(LocalDateTime.now());
        notice.setSocietyId(noticeDto.getSocietyId());
        return notice;
    }

    // Convert Notice entity to NoticeResponse DTO
    private NoticeResponse entityToDto(Notice notice) {
        NoticeResponse noticeDto = new NoticeResponse();
        noticeDto.setNoticeId(notice.getNoticeId());
        noticeDto.setHeading(notice.getHeading());
        noticeDto.setContent(notice.getContent());
        noticeDto.setNoticeImage(notice.getNoticeImage());
        noticeDto.setDatePosted(notice.getDatePosted());
        noticeDto.setSocietyId(notice.getSocietyId());
        return noticeDto;
    }
}