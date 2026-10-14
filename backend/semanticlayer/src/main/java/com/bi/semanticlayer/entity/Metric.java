package com.bi.semanticlayer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "metrics")
@Getter
@Setter
public class Metric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "metric_id")
    private Integer metricId;

    @Column(name = "metric_name", nullable = false, unique = true)
    private String metricName;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "owner")
    private String owner;

    @Column(name = "status")
    private String status;
}