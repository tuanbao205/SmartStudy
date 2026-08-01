package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String name;
    private String code;
    private Integer credits;
    private String lecturerName;
    private String semester;
    private String academicYear;
    private String color;
}