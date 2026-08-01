package com.smartstudy.backend.controller;

import com.smartstudy.backend.dto.AssignmentRequest;
import com.smartstudy.backend.dto.AssignmentResponse;
import com.smartstudy.backend.dto.AssignmentStatusUpdateRequest;
import com.smartstudy.backend.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<AssignmentResponse> create(@Valid @RequestBody AssignmentRequest request,
                                                        Authentication authentication) {
        return ResponseEntity.ok(assignmentService.createAssignment(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getMyAssignments(Authentication authentication) {
        return ResponseEntity.ok(assignmentService.getMyAssignments(authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AssignmentResponse> updateStatus(@PathVariable Long id,
                                                              @Valid @RequestBody AssignmentStatusUpdateRequest request) {
        return ResponseEntity.ok(assignmentService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}