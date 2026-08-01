package com.smartstudy.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseRequest {

    @NotBlank(message = "Tên môn học không được để trống")
    private String name;

    private String code;
    private Integer credits;
    private String lecturerName;
    private String semester;
    private String academicYear;
    private String color;
}