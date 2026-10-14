package com.bi.semanticlayer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "dashboard_definitions")
@Getter
@Setter
public class DashboardDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dashboard_definition_id")
    private Integer dashboardDefinitionId;

    @Column(name = "dashboard_id", nullable = false)
    private Integer dashboardId;

    @Column(name = "metric_id", nullable = false)
    private Integer metricId;

    @Column(name = "definition_text", nullable = false, columnDefinition = "TEXT")
    private String definitionText;

    @Column(name = "formula", columnDefinition = "TEXT")
    private String formula;

    @Column(name = "source_tables", columnDefinition = "TEXT")
    private String sourceTables;

    @Column(name = "filters", columnDefinition = "TEXT")
    private String filters;

    @Column(name = "time_window")
    private String timeWindow;

    @Column(name = "dimensions", columnDefinition = "TEXT")
    private String dimensions;
}