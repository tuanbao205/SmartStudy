package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.CourseRequest;
import com.smartstudy.backend.dto.CourseResponse;
import com.smartstudy.backend.entity.Course;
import com.smartstudy.backend.entity.StudentCourse;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.CourseRepository;
import com.smartstudy.backend.repository.StudentCourseRepository;
import com.smartstudy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final StudentCourseRepository studentCourseRepository;
    private final UserRepository userRepository;

    // Tạo course mới VÀ tự động đăng ký (enroll) cho user đang tạo
    public CourseResponse createCourse(CourseRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        Course course = new Course();
        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setCredits(request.getCredits());
        course.setLecturerName(request.getLecturerName());
        course.setSemester(request.getSemester());
        course.setAcademicYear(request.getAcademicYear());
        course.setColor(request.getColor());

        Course savedCourse = courseRepository.save(course);

        StudentCourse enrollment = new StudentCourse();
        enrollment.setUser(user);
        enrollment.setCourse(savedCourse);
        studentCourseRepository.save(enrollment);

        return toResponse(savedCourse);
    }

    // Lấy danh sách course của user đang đăng nhập
    public List<CourseResponse> getMyCourses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        return studentCourseRepository.findByUserIdWithCourse(user.getId())
                .stream()
                .map(sc -> toResponse(sc.getCourse()))
                .toList();
    }

    public CourseResponse updateCourse(Long courseId, CourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setCredits(request.getCredits());
        course.setLecturerName(request.getLecturerName());
        course.setSemester(request.getSemester());
        course.setAcademicYear(request.getAcademicYear());
        course.setColor(request.getColor());

        return toResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new IllegalArgumentException("Không tìm thấy môn học");
        }
        courseRepository.deleteById(courseId);
    }

    private CourseResponse toResponse(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getName(),
                course.getCode(),
                course.getCredits(),
                course.getLecturerName(),
                course.getSemester(),
                course.getAcademicYear(),
                course.getColor()
        );
    }
}