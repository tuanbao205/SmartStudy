package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.DashboardResponse;
import com.smartstudy.backend.entity.Assignment;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.AssignmentRepository;
import com.smartstudy.backend.repository.StudentCourseRepository;
import com.smartstudy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final GradeService gradeService;
    private final AssignmentRepository assignmentRepository;
    private final StudentCourseRepository studentCourseRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        BigDecimal gpa = gradeService.calculateGpa(email).getGpa();

        int totalCourses = studentCourseRepository.findByUserIdWithCourse(user.getId()).size();

        List<Assignment> assignments = assignmentRepository.findAllByUserId(user.getId());
        int totalAssignments = assignments.size();

        long completed = assignments.stream()
                .filter(a -> "COMPLETED".equals(a.getStatus()))
                .count();

        long overdue = assignments.stream()
                .filter(a -> "OVERDUE".equals(a.getStatus()))
                .count();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysLater = now.plusDays(7);
        long upcoming = assignments.stream()
                .filter(a -> !"COMPLETED".equals(a.getStatus()) && !"OVERDUE".equals(a.getStatus()))
                .filter(a -> a.getDeadline().isAfter(now) && a.getDeadline().isBefore(sevenDaysLater))
                .count();

        return new DashboardResponse(
                gpa,
                totalCourses,
                totalAssignments,
                (int) completed,
                (int) overdue,
                (int) upcoming
        );
    }
}