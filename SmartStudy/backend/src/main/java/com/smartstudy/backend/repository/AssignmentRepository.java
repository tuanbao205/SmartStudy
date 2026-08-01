package com.smartstudy.backend.repository;

import com.smartstudy.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    @Query("SELECT a FROM Assignment a JOIN FETCH a.course c JOIN StudentCourse sc ON sc.course = c " +
           "WHERE sc.user.id = :userId ORDER BY a.deadline ASC")
    List<Assignment> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM Assignment a WHERE a.deadline < :now AND a.status NOT IN ('COMPLETED', 'OVERDUE')")
    List<Assignment> findOverdueAssignments(@Param("now") LocalDateTime now);
}