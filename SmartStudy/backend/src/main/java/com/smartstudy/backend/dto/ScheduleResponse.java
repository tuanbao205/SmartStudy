package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
public class ScheduleResponse {
    private Long id;
    private Long courseId;
    private String courseName;
    private Short dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
    private LocalDate startDate;
    private LocalDate endDate;
}