package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class GradeComponentResponse {
    private Long id;
    private Long courseId;
    private String name;
    private BigDecimal weight;
}