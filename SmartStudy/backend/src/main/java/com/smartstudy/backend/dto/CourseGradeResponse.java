package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CourseGradeResponse {
    private Long courseId;
    private String courseName;
    private List<GradeDetail> details;
    private BigDecimal totalScore;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class GradeDetail {
        private String componentName;
        private BigDecimal weight;
        private BigDecimal score;
    }
}