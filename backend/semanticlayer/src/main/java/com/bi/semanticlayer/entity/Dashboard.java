package com.bi.semanticlayer.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "dashboards")
@Getter
@Setter
public class Dashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dashboard_id")
    private Integer dashboardId;

    @Column(name = "dashboard_name", nullable = false, unique = true)
    private String dashboardName;

    @Column(name = "owner")
    private String owner;

    @Column(name = "description")
    private String description;
}