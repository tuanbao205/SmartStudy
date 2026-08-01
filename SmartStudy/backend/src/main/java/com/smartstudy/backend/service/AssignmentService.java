package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.AssignmentRequest;
import com.smartstudy.backend.dto.AssignmentResponse;
import com.smartstudy.backend.dto.AssignmentStatusUpdateRequest;
import com.smartstudy.backend.entity.Assignment;
import com.smartstudy.backend.entity.Course;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.AssignmentRepository;
import com.smartstudy.backend.repository.CourseRepository;
import com.smartstudy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public AssignmentResponse createAssignment(AssignmentRequest request, String email) {
        userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

        Assignment assignment = new Assignment();
        assignment.setCourse(course);
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setDeadline(request.getDeadline());
        assignment.setPriority(request.getPriority() != null ? request.getPriority() : "MEDIUM");
        assignment.setEstimatedHours(request.getEstimatedHours());

        return toResponse(assignmentRepository.save(assignment));
    }

    public List<AssignmentResponse> getMyAssignments(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        return assignmentRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AssignmentResponse updateStatus(Long assignmentId, AssignmentStatusUpdateRequest request) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bài tập"));

        assignment.setStatus(request.getStatus());
        return toResponse(assignmentRepository.save(assignment));
    }

    public void deleteAssignment(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new IllegalArgumentException("Không tìm thấy bài tập");
        }
        assignmentRepository.deleteById(assignmentId);
    }

    private AssignmentResponse toResponse(Assignment assignment) {
        return new AssignmentResponse(
                assignment.getId(),
                assignment.getCourse().getId(),
                assignment.getCourse().getName(),
                assignment.getTitle(),
                assignment.getDescription(),
                assignment.getDeadline(),
                assignment.getPriority(),
                assignment.getStatus(),
                assignment.getEstimatedHours()
        );
    }
}