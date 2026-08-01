package com.smartstudy.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "grade_components")
@Getter
@Setter
@NoArgsConstructor
public class GradeComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String name; // vd: 'Chuyên cần', 'Giữa kỳ', 'Cuối kỳ'

    @Column(nullable = false)
    private BigDecimal weight; // vd: 10.00 nghĩa là 10%
}