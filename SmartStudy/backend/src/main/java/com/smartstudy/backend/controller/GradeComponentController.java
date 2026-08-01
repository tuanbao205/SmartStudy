package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.GradeComponentRequest;
import com.smartstudy.backend.dto.GradeComponentResponse;
import com.smartstudy.backend.service.GradeComponentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grade-components")
@RequiredArgsConstructor
public class GradeComponentController {

    private final GradeComponentService gradeComponentService;

    @PostMapping
    public ResponseEntity<GradeComponentResponse> create(@Valid @RequestBody GradeComponentRequest request) {
        return ResponseEntity.ok(gradeComponentService.createComponent(request));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<GradeComponentResponse>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(gradeComponentService.getComponentsByCourse(courseId));
    }
}