package com.bi.semanticlayer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mismatch_reports")
@Getter
@Setter
public class MismatchReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mismatch_id")
    private Integer mismatchId;

    @Column(name = "comparison_id", nullable = false)
    private Integer comparisonId;

    @Column(name = "severity")
    private String severity;

    @Column(name = "expected_definition", nullable = false, columnDefinition = "TEXT")
    private String expectedDefinition;

    @Column(name = "actual_definition", nullable = false, columnDefinition = "TEXT")
    private String actualDefinition;

    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;
}