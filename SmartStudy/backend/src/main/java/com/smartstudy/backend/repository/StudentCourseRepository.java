package com.smartstudy.backend.repository;

import com.smartstudy.backend.entity.StudentCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentCourseRepository extends JpaRepository<StudentCourse, Long> {

    @Query("SELECT sc FROM StudentCourse sc JOIN FETCH sc.course WHERE sc.user.id = :userId")
    List<StudentCourse> findByUserIdWithCourse(@Param("userId") Long userId);
    List<StudentCourse> findByCourseId(Long courseId);

    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}