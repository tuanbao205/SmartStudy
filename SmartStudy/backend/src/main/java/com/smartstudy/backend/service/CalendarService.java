package com.smartstudy.backend.service;

import com.smartstudy.backend.dto.CalendarEventResponse;
import com.smartstudy.backend.entity.Assignment;
import com.smartstudy.backend.entity.Schedule;
import com.smartstudy.backend.entity.User;
import com.smartstudy.backend.repository.AssignmentRepository;
import com.smartstudy.backend.repository.ScheduleRepository;
import com.smartstudy.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final ScheduleRepository scheduleRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    // Lấy lịch trong khoảng thời gian [from, to)
    public List<CalendarEventResponse> getCalendarEvents(String email, LocalDate from, LocalDate to) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy user"));

        List<CalendarEventResponse> events = new ArrayList<>();

        // 1. Sinh sự kiện CLASS từ Schedule (lặp lại hàng tuần) cho từng ngày trong khoảng from-to
        List<Schedule> schedules = scheduleRepository.findAllByUserId(user.getId());
        LocalDate cursor = from;
        while (!cursor.isAfter(to)) {
            int isoDayOfWeek = cursor.getDayOfWeek().getValue(); // 1=Monday ... 7=Sunday, khớp với dayOfWeek trong DB
            for (Schedule s : schedules) {
                if (s.getDayOfWeek() == isoDayOfWeek) {
                    events.add(new CalendarEventResponse(
                            "CLASS",
                            s.getCourse().getName(),
                            s.getCourse().getName(),
                            LocalDateTime.of(cursor, s.getStartTime()),
                            LocalDateTime.of(cursor, s.getEndTime()),
                            s.getRoom()
                    ));
                }
            }
            cursor = cursor.plusDays(1);
        }

        // 2. Sinh sự kiện ASSIGNMENT từ Assignment có deadline trong khoảng from-to
        List<Assignment> assignments = assignmentRepository.findAllByUserId(user.getId());
        for (Assignment a : assignments) {
            LocalDate deadlineDate = a.getDeadline().toLocalDate();
            if (!deadlineDate.isBefore(from) && !deadlineDate.isAfter(to)) {
                events.add(new CalendarEventResponse(
                        "ASSIGNMENT",
                        a.getTitle(),
                        a.getCourse().getName(),
                        a.getDeadline(),
                        null,
                        a.getPriority() + " / " + a.getStatus()
                ));
            }
        }

        // Sắp xếp theo thời gian bắt đầu
        events.sort(Comparator.comparing(CalendarEventResponse::getStartTime));

        return events;
    }

    // Tiện ích: lấy lịch của tuần hiện tại
    public List<CalendarEventResponse> getCurrentWeekEvents(String email) {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate sunday = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        return getCalendarEvents(email, monday, sunday);
    }
}