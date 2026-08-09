package com.smartstudy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class DocumentResponse {
    private Long id;
    private String originalName;
    private String fileType;
    private String status;
    private LocalDateTime uploadedAt;
}