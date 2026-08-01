package com.smartstudy.backend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignmentStatusUpdateRequest {

    @Pattern(regexp = "TODO|IN_PROGRESS|COMPLETED|OVERDUE", message = "Status không hợp lệ")
    private String status;
}