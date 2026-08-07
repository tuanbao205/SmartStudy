package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.CourseGradeResponse;
import com.smartstudy.backend.dto.GradeUpdateRequest;
import com.smartstudy.backend.entity.*;
import com.smartstudy.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.smartstudy.backend.dto.GpaResponse;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;
    private final GradeComponentRepository gradeComponentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final StudentCourseRepository studentCourseRepository;

    // Nhập/cập nhật điểm cho 1 thành phần điểm cụ thể
    public void updateGrade(GradeUpdateRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        GradeComponent component = gradeComponentRepository.findById(request.getGradeComponentId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thành phần điểm"));

        Grade grade = gradeRepository.findByUserIdAndGradeComponentId(user.getId(), component.getId())
                .orElseGet(() -> {
                    Grade newGrade = new Grade();
                    newGrade.setUser(user);
                    newGrade.setGradeComponent(component);
                    return newGrade;
                });

        grade.setScore(request.getScore());
        gradeRepository.save(grade);
    }

    // Lấy điểm chi tiết + tổng kết của 1 môn học
    public CourseGradeResponse getCourseGrade(Long courseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

        List<GradeComponent> allComponents = gradeComponentRepository.findByCourseId(courseId);

        List<Grade> existingGrades = gradeRepository.findByUserIdAndCourseId(user.getId(), courseId);
        Map<Long, BigDecimal> scoreByComponentId = existingGrades.stream()
                .collect(Collectors.toMap(g -> g.getGradeComponent().getId(), Grade::getScore));

        List<CourseGradeResponse.GradeDetail> details = allComponents.stream()
                .map(component -> new CourseGradeResponse.GradeDetail(
                        component.getName(),
                        component.getWeight(),
                        scoreByComponentId.get(component.getId()) // null nếu chưa nhập điểm
                ))
                .toList();

        BigDecimal totalScore = calculateTotalScore(allComponents, scoreByComponentId);

        return new CourseGradeResponse(course.getId(), course.getName(), details, totalScore);
    }

    public GpaResponse calculateGpa(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        List<StudentCourse> enrolledCourses = studentCourseRepository.findByUserIdWithCourse(user.getId());

        BigDecimal weightedSum = BigDecimal.ZERO;
        int totalCredits = 0;
        List<GpaResponse.CourseGradeSummary> summaries = new java.util.ArrayList<>();

        for (StudentCourse sc : enrolledCourses) {
            Course course = sc.getCourse();
            List<GradeComponent> components = gradeComponentRepository.findByCourseId(course.getId());
            List<Grade> grades = gradeRepository.findByUserIdAndCourseId(user.getId(), course.getId());

            Map<Long, BigDecimal> scoreByComponentId = grades.stream()
                    .collect(Collectors.toMap(g -> g.getGradeComponent().getId(), Grade::getScore));

            BigDecimal totalScore = calculateTotalScore(components, scoreByComponentId);
            Integer credits = course.getCredits();

            BigDecimal gpa4Scale = convertToGpa4Scale(totalScore);
            summaries.add(new GpaResponse.CourseGradeSummary(
                    course.getId(), course.getName(), credits, totalScore, gpa4Scale));

            if (totalScore != null && credits != null) {
                weightedSum = weightedSum.add(totalScore.multiply(BigDecimal.valueOf(credits)));
                totalCredits += credits;
            }
        }

       BigDecimal gpa = totalCredits == 0
            ? null
            : weightedSum.divide(BigDecimal.valueOf(totalCredits), 2, RoundingMode.HALF_UP);

        BigDecimal gpa4Scale = convertToGpa4Scale(gpa);

        return new GpaResponse(gpa, gpa4Scale, summaries);
    }

    public GpaResponse.CourseGradeSummary getCourseGpa(Long courseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

        List<GradeComponent> components = gradeComponentRepository.findByCourseId(courseId);
        List<Grade> grades = gradeRepository.findByUserIdAndCourseId(user.getId(), courseId);

        Map<Long, BigDecimal> scoreByComponentId = grades.stream()
                .collect(Collectors.toMap(g -> g.getGradeComponent().getId(), Grade::getScore));

        BigDecimal totalScore = calculateTotalScore(components, scoreByComponentId);
        BigDecimal gpa4Scale = convertToGpa4Scale(totalScore);

        return new GpaResponse.CourseGradeSummary(
                course.getId(), course.getName(), course.getCredits(), totalScore, gpa4Scale);
    }

    private BigDecimal convertToGpa4Scale(BigDecimal score10) {
        if (score10 == null) {
            return null;
        }
        double s = score10.doubleValue();
        double gpa4;

        if (s >= 9.0) gpa4 = 4.0;
        else if (s >= 8.5) gpa4 = 3.7;
        else if (s >= 8.0) gpa4 = 3.5;
        else if (s >= 7.0) gpa4 = 3.0;
        else if (s >= 6.5) gpa4 = 2.5;
        else if (s >= 5.5) gpa4 = 2.0;
        else if (s >= 5.0) gpa4 = 1.5;
        else if (s >= 4.0) gpa4 = 1.0;
        else gpa4 = 0.0;

        return BigDecimal.valueOf(gpa4).setScale(2, RoundingMode.HALF_UP);
    }

    // Tính điểm tổng kết = sum(score * weight / 100), chỉ tính các component đã có điểm
    private BigDecimal calculateTotalScore(List<GradeComponent> components, Map<Long, BigDecimal> scoreByComponentId) {
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal totalWeightEntered = BigDecimal.ZERO;

        for (GradeComponent component : components) {
            BigDecimal score = scoreByComponentId.get(component.getId());
            if (score != null) {
                total = total.add(score.multiply(component.getWeight()));
                totalWeightEntered = totalWeightEntered.add(component.getWeight());
            }
        }

        if (totalWeightEntered.compareTo(BigDecimal.ZERO) == 0) {
            return null; // chưa có điểm nào được nhập
        }

        // Chia cho 100 vì weight lưu dạng phần trăm (vd: 30.00 = 30%)
        return total.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
    
}