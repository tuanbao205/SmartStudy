package com.smartstudy.backend.repository;

import com.smartstudy.backend.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {

    @Query("SELECT g FROM Grade g JOIN FETCH g.gradeComponent gc JOIN FETCH gc.course " +
           "WHERE g.user.id = :userId AND gc.course.id = :courseId")
    List<Grade> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);

    Optional<Grade> findByUserIdAndGradeComponentId(Long userId, Long gradeComponentId);
}