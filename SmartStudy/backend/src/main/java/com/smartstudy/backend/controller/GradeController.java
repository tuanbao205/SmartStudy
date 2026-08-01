package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.CourseGradeResponse;
import com.smartstudy.backend.dto.GpaResponse;
import com.smartstudy.backend.dto.GradeUpdateRequest;
import com.smartstudy.backend.service.GradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @PutMapping
    public ResponseEntity<Void> updateGrade(@Valid @RequestBody GradeUpdateRequest request,
                                              Authentication authentication) {
        gradeService.updateGrade(request, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<CourseGradeResponse> getCourseGrade(@PathVariable Long courseId,
                                                                 Authentication authentication) {
        return ResponseEntity.ok(gradeService.getCourseGrade(courseId, authentication.getName()));
    }

    @GetMapping("/gpa")
    public ResponseEntity<GpaResponse> getGpa(Authentication authentication) {
        return ResponseEntity.ok(gradeService.calculateGpa(authentication.getName()));
    }

    @GetMapping("/course/{courseId}/summary")
    public ResponseEntity<GpaResponse.CourseGradeSummary> getCourseSummary(@PathVariable Long courseId,
                                                                            Authentication authentication) {
        return ResponseEntity.ok(gradeService.getCourseGpa(courseId, authentication.getName()));
    }   
}