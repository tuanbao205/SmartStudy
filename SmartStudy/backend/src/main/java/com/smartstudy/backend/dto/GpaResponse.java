package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class GpaResponse {
    private BigDecimal gpa;
    private List<CourseGradeSummary> courseSummaries;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CourseGradeSummary {
        private Long courseId;
        private String courseName;
        private Integer credits;
        private BigDecimal totalScore; // null nếu chưa có điểm
        private BigDecimal gpa4Scale;
    }
}