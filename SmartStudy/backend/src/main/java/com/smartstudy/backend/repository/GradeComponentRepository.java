package com.smartstudy.backend.repository;

import com.smartstudy.backend.entity.GradeComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeComponentRepository extends JpaRepository<GradeComponent, Long> {
    List<GradeComponent> findByCourseId(Long courseId);
}