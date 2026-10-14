package com.bi.semanticlayer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "definition_comparisons")
@Getter
@Setter
public class DefinitionComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comparison_id")
    private Integer comparisonId;

    @Column(name = "metric_id", nullable = false)
    private Integer metricId;

    @Column(name = "dashboard_id", nullable = false)
    private Integer dashboardId;

    @Column(name = "metric_version_id", nullable = false)
    private Integer metricVersionId;

    @Column(name = "dashboard_definition_id", nullable = false)
    private Integer dashboardDefinitionId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "formula_match")
    private Boolean formulaMatch;

    @Column(name = "source_match")
    private Boolean sourceMatch;

    @Column(name = "filter_match")
    private Boolean filterMatch;

    @Column(name = "time_window_match")
    private Boolean timeWindowMatch;

    @Column(name = "dimension_match")
    private Boolean dimensionMatch;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;
}