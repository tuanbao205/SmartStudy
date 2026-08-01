package com.smartstudy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class GradeComponentRequest {

    @NotNull(message = "Course ID không được để trống")
    private Long courseId;

    @NotBlank(message = "Tên thành phần điểm không được để trống")
    private String name;

    @NotNull(message = "Trọng số không được để trống")
    private BigDecimal weight;
}