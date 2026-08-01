package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.CourseRequest;
import com.smartstudy.backend.dto.CourseResponse;
import com.smartstudy.backend.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseRequest request,
                                                   Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(courseService.createCourse(request, email));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getMyCourses(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(courseService.getMyCourses(email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}