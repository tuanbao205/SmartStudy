package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponse {
    private BigDecimal gpa;
    private int totalCourses;
    private int totalAssignments;
    private int completedAssignments;
    private int overdueAssignments;
    private int upcomingAssignments; // deadline trong 7 ngày tới, chưa hoàn thành
}