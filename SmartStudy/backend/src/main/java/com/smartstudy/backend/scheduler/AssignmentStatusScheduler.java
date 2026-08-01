package com.smartstudy.backend.scheduler;

import com.smartstudy.backend.entity.Assignment;
import com.smartstudy.backend.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AssignmentStatusScheduler {

    private final AssignmentRepository assignmentRepository;

    // Chạy mỗi 1 giờ (3600000 ms) - có thể chỉnh lại tuỳ nhu cầu
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void markOverdueAssignments() {
        List<Assignment> overdueList = assignmentRepository.findOverdueAssignments(LocalDateTime.now());

        if (overdueList.isEmpty()) {
            log.info("Không có assignment nào quá hạn cần cập nhật.");
            return;
        }

        for (Assignment assignment : overdueList) {
            assignment.setStatus("OVERDUE");
        }
        assignmentRepository.saveAll(overdueList);

        log.info("Đã cập nhật {} assignment sang trạng thái OVERDUE.", overdueList.size());
    }
}