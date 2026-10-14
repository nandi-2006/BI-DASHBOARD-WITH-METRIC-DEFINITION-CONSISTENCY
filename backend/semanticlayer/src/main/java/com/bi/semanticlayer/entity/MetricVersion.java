package com.bi.semanticlayer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "metric_versions")
@Getter
@Setter
public class MetricVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metric_version_id")
    private Integer metricVersionId;

    @Column(name = "metric_id", nullable = false)
    private Integer metricId;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(name = "business_definition", nullable = false, columnDefinition = "TEXT")
    private String businessDefinition;

    @Column(name = "formula", nullable = false, columnDefinition = "TEXT")
    private String formula;

    @Column(name = "source_tables", nullable = false, columnDefinition = "TEXT")
    private String sourceTables;

    @Column(name = "filters", columnDefinition = "TEXT")
    private String filters;

    @Column(name = "time_window")
    private String timeWindow;

    @Column(name = "dimensions", columnDefinition = "TEXT")
    private String dimensions;

    @Column(name = "is_current")
    private Boolean isCurrent;
}