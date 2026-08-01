package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.GradeComponentRequest;
import com.smartstudy.backend.dto.GradeComponentResponse;
import com.smartstudy.backend.entity.Course;
import com.smartstudy.backend.entity.GradeComponent;
import com.smartstudy.backend.repository.CourseRepository;
import com.smartstudy.backend.repository.GradeComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GradeComponentService {

    private final GradeComponentRepository gradeComponentRepository;
    private final CourseRepository courseRepository;

    public GradeComponentResponse createComponent(GradeComponentRequest request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

        GradeComponent component = new GradeComponent();
        component.setCourse(course);
        component.setName(request.getName());
        component.setWeight(request.getWeight());

        return toResponse(gradeComponentRepository.save(component));
    }

    public List<GradeComponentResponse> getComponentsByCourse(Long courseId) {
        return gradeComponentRepository.findByCourseId(courseId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private GradeComponentResponse toResponse(GradeComponent component) {
        return new GradeComponentResponse(
                component.getId(),
                component.getCourse().getId(),
                component.getName(),
                component.getWeight()
        );
    }
}