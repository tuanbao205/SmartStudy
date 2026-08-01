package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.ScheduleRequest;
import com.smartstudy.backend.dto.ScheduleResponse;
import com.smartstudy.backend.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<ScheduleResponse> create(@Valid @RequestBody ScheduleRequest request,
                                                     Authentication authentication) {
        return ResponseEntity.ok(scheduleService.createSchedule(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> getMySchedules(Authentication authentication) {
        return ResponseEntity.ok(scheduleService.getMySchedules(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}