package com.smartstudy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class AssignmentRequest {

    @NotNull(message = "Course ID không được để trống")
    private Long courseId;

    @NotBlank(message = "Tên bài tập không được để trống")
    private String title;

    private String description;

    @NotNull(message = "Deadline không được để trống")
    private LocalDateTime deadline;

    @Pattern(regexp = "LOW|MEDIUM|HIGH", message = "Priority phải là LOW, MEDIUM hoặc HIGH")
    private String priority = "MEDIUM";

    private BigDecimal estimatedHours;
}