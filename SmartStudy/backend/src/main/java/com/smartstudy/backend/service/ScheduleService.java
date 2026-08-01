package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.ScheduleRequest;
import com.smartstudy.backend.dto.ScheduleResponse;
import com.smartstudy.backend.entity.Course;
import com.smartstudy.backend.entity.Schedule;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.CourseRepository;
import com.smartstudy.backend.repository.ScheduleRepository;
import com.smartstudy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public ScheduleResponse createSchedule(ScheduleRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy môn học"));

        checkScheduleConflict(user.getId(), request, null);

        Schedule schedule = new Schedule();
        schedule.setCourse(course);
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setRoom(request.getRoom());

        return toResponse(scheduleRepository.save(schedule));
    }

    public List<ScheduleResponse> getMySchedules(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        return scheduleRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteSchedule(Long scheduleId) {
        if (!scheduleRepository.existsById(scheduleId)) {
            throw new IllegalArgumentException("Không tìm thấy lịch học");
        }
        scheduleRepository.deleteById(scheduleId);
    }

    // Kiểm tra trùng giờ học trong cùng 1 thứ
    private void checkScheduleConflict(Long userId, ScheduleRequest request, Long excludeScheduleId) {
        List<Schedule> existingSchedules = scheduleRepository.findAllByUserId(userId);

        for (Schedule existing : existingSchedules) {
            if (excludeScheduleId != null && existing.getId().equals(excludeScheduleId)) {
                continue;
            }
            if (!existing.getDayOfWeek().equals(request.getDayOfWeek())) {
                continue;
            }
            boolean overlap = request.getStartTime().isBefore(existing.getEndTime())
                    && existing.getStartTime().isBefore(request.getEndTime());
            if (overlap) {
                throw new IllegalArgumentException(
                        "Lịch học bị trùng với môn \"" + existing.getCourse().getName() +
                        "\" (" + existing.getStartTime() + " - " + existing.getEndTime() + ")");
            }
        }
    }

    private ScheduleResponse toResponse(Schedule schedule) {
        return new ScheduleResponse(
                schedule.getId(),
                schedule.getCourse().getId(),
                schedule.getCourse().getName(),
                schedule.getDayOfWeek(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getRoom()
        );
    }
}