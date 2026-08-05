package com.smartstudy.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ScheduleRequest {

    @NotNull(message = "Course ID không được để trống")
    private Long courseId;

    @NotNull(message = "Thứ trong tuần không được để trống")
    @Min(value = 1, message = "Thứ phải từ 1 (Thứ 2) đến 7 (Chủ nhật)")
    @Max(value = 7, message = "Thứ phải từ 1 (Thứ 2) đến 7 (Chủ nhật)")
    private Short dayOfWeek;

    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime startTime;

    @NotNull(message = "Giờ kết thúc không được để trống")
    private LocalTime endTime;
    private LocalDate startDate;
    private LocalDate endDate;

    private String room;
}