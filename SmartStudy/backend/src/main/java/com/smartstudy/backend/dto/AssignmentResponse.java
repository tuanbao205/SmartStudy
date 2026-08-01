package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AssignmentResponse {
    private Long id;
    private Long courseId;
    private String courseName;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private String priority;
    private String status;
    private BigDecimal estimatedHours;
}