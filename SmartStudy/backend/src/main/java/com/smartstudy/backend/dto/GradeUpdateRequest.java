package com.smartstudy.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class GradeUpdateRequest {

    @NotNull(message = "Grade Component ID không được để trống")
    private Long gradeComponentId;

    @NotNull(message = "Điểm không được để trống")
    private BigDecimal score;
}