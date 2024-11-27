package com.capstone.EventsUpdatesService.controller;

import com.capstone.EventsUpdatesService.dto.noticeDtos.NoticeRequest;
import com.capstone.EventsUpdatesService.dto.noticeDtos.NoticeResponse;
import com.capstone.EventsUpdatesService.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
    @RequestMapping("/api/community/event-service/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @PostMapping("/create-notice")
    public ResponseEntity<NoticeResponse> createNotice(@RequestBody NoticeRequest noticeRequest) {
        NoticeResponse createdNotice = noticeService.createNotice(noticeRequest);
        return new ResponseEntity<>(createdNotice, HttpStatus.CREATED);
    }

    @GetMapping("/get-notices")
    public ResponseEntity<List<NoticeResponse>> getAllNotices() {
        List<NoticeResponse> notices = noticeService.getAllNotices();
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    @GetMapping("/notice-by-society/{societyId}")
    public ResponseEntity<List<NoticeResponse>> getNoticesBySocietyId(@PathVariable("societyId") long societyId) {
        List<NoticeResponse> notices = noticeService.getNoticesBySocietyId(societyId);
        return new ResponseEntity<>(notices, HttpStatus.OK);
    }

    @GetMapping("get-notices/{noticeId}")
    public ResponseEntity<NoticeResponse> getNoticeById(@PathVariable("noticeId") long noticeId) {
        NoticeResponse notice = noticeService.getNoticeById(noticeId);
        return new ResponseEntity<>(notice, HttpStatus.OK);
    }

    @PutMapping("/update-notices/{noticeId}")
    public ResponseEntity<NoticeResponse> updateNotice(@PathVariable("noticeId") long noticeId, @RequestBody NoticeRequest noticeRequest) {
        NoticeResponse updatedNotice = noticeService.updateNotice(noticeId, noticeRequest);
        return new ResponseEntity<>(updatedNotice, HttpStatus.OK);
    }

    @DeleteMapping("/delete-notices/{noticeId}")
    public ResponseEntity<String> deleteNotice(@PathVariable("noticeId") long noticeId) {
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok("Notice with ID: " + noticeId + " successfully deleted!");
    }
}
