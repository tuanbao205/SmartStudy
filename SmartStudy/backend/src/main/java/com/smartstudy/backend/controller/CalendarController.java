package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.CalendarEventResponse;
import com.smartstudy.backend.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping
    public ResponseEntity<List<CalendarEventResponse>> getEvents(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            Authentication authentication) {
        return ResponseEntity.ok(calendarService.getCalendarEvents(authentication.getName(), from, to));
    }

    @GetMapping("/current-week")
    public ResponseEntity<List<CalendarEventResponse>> getCurrentWeek(Authentication authentication) {
        return ResponseEntity.ok(calendarService.getCurrentWeekEvents(authentication.getName()));
    }
}