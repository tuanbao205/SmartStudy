package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CalendarEventResponse {
    private String type;        // "CLASS" hoặc "ASSIGNMENT"
    private String title;
    private String courseName;
    private LocalDateTime startTime;
    private LocalDateTime endTime; // null nếu là assignment (chỉ có deadline)
    private String extraInfo;      // room (nếu CLASS) hoặc priority/status (nếu ASSIGNMENT)
}