package com.smartstudy.backend.repository;

import com.smartstudy.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s JOIN FETCH s.course c JOIN StudentCourse sc ON sc.course = c " +
           "WHERE sc.user.id = :userId")
    List<Schedule> findAllByUserId(@Param("userId") Long userId);

    List<Schedule> findByCourseId(Long courseId);
}